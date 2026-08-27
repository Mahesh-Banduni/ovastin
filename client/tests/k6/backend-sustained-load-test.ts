import http from "k6/http";
import { check, fail, sleep } from "k6";

const BASE_URL = normalizeBaseUrl(
  __ENV.K6_BASE_URL ??
    __ENV.SERVER_URL ??
    __ENV.NEXT_PUBLIC_SERVER_URL ??
    "http://127.0.0.1:8080"
);
const TEST_EMAIL = __ENV.K6_USER_EMAIL ?? __ENV.USER_EMAIL ?? "";
const TEST_PASSWORD = __ENV.K6_USER_PASSWORD ?? __ENV.USER_PASSWORD ?? "";

export const options = {
  scenarios: {
    sustained_backend_checks: {
      executor: "constant-vus",
      vus: 10,
      duration: "5m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<3000"],
  },
  summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
};

function normalizeBaseUrl(value: string) {
  return value.replace(/\/$/, "");
}

function requireEnv(name: string, value: string) {
  if (!value) {
    fail(`Missing required environment variable: ${name}`);
  }
  return value;
}

function safeJson(response: http.RefinedResponse<any>): any {
  try {
    return response.json();
  } catch {
    return null;
  }
}

function loginAndGetToken() {
  const response = http.post(
    `${BASE_URL}/api/v1/auth/signin`,
    JSON.stringify({
      email: requireEnv("USER_EMAIL", TEST_EMAIL),
      password: requireEnv("USER_PASSWORD", TEST_PASSWORD),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      tags: {
        endpoint: "signin",
      },
    }
  );

  const body = safeJson(response);
  const token = body?.data?.accessToken;

  check(response, {
    "signin returned 200": (r) => r.status === 200,
    "signin response succeeded": () => body?.success === true,
    "signin returned an access token": () => typeof token === "string" && token.length > 0,
  });

  if (response.status !== 200 || typeof token !== "string" || !token) {
    fail("Signin failed");
  }

  return token;
}

function checkPaginatedList(
  response: http.RefinedResponse<any>,
  label: string
) {
  const body = safeJson(response);
  const items = body?.data?.items;

  return check(response, {
    [`${label} returned 200`]: (r) => r.status === 200,
    [`${label} succeeded`]: () => body?.success === true,
    [`${label} returned items`]: () => Array.isArray(items),
    [`${label} returned pagination metadata`]: () =>
      typeof body?.data?.total === "number" &&
      typeof body?.data?.page === "number" &&
      typeof body?.data?.pageSize === "number",
  });
}

function checkArrayList(
  response: http.RefinedResponse<any>,
  label: string
) {
  const body = safeJson(response);

  return check(response, {
    [`${label} returned 200`]: (r) => r.status === 200,
    [`${label} succeeded`]: () => body?.success === true,
    [`${label} returned an array`]: () => Array.isArray(body?.data),
  });
}

export function setup() {
  const health = http.get(`${BASE_URL}/health`, {
    tags: {
      endpoint: "health",
    },
  });

  const healthBody = safeJson(health);
  check(health, {
    "health returned 200": (r) => r.status === 200,
    "health response succeeded": () => healthBody?.success === true,
  });

  const accessToken = loginAndGetToken();

  return {
    baseUrl: BASE_URL,
    accessToken,
  };
}

export default function (data: { baseUrl: string; accessToken: string }) {
  const authHeaders = {
    Authorization: `Bearer ${data.accessToken}`,
  };

  const health = http.get(`${data.baseUrl}/health`, {
    tags: {
      endpoint: "health",
    },
  });
  const projects = http.get(
    `${data.baseUrl}/api/v1/projects?page=1&pageSize=10`,
    {
      tags: {
        endpoint: "projects",
      },
    }
  );
  const services = http.get(
    `${data.baseUrl}/api/v1/services?page=1&pageSize=10`,
    {
      tags: {
        endpoint: "services",
      },
    }
  );
  const awards = http.get(
    `${data.baseUrl}/api/v1/awards?page=1&pageSize=10`,
    {
      tags: {
        endpoint: "awards",
      },
    }
  );
  const amenities = http.get(`${data.baseUrl}/api/v1/amenities/all`, {
    tags: {
      endpoint: "amenities",
    },
  });
  const profile = http.get(`${data.baseUrl}/api/v1/profile/me`, {
    headers: authHeaders,
    tags: {
      endpoint: "profile-me",
    },
  });

  const healthBody = safeJson(health);
  check(health, {
    "health returned 200": (r) => r.status === 200,
    "health response succeeded": () => healthBody?.success === true,
  });

  checkPaginatedList(projects, "projects list");
  checkPaginatedList(services, "services list");
  checkPaginatedList(awards, "awards list");
  checkArrayList(amenities, "amenities list");

  const profileBody = safeJson(profile);
  check(profile, {
    "profile returned 200": (r) => r.status === 200,
    "profile response succeeded": () => profileBody?.success === true,
    "profile returned a user object": () => Boolean(profileBody?.data?.id && profileBody?.data?.email),
  });

  sleep(1);
}
