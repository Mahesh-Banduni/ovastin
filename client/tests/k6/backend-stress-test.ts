import http from "k6/http";
import { check, fail } from "k6";
import { Trend } from "k6/metrics";

/**
 * Backend Load Test
 *
 * Purpose:
 *   Compare Express vs Fastify under concurrent API load.
 *
 * Test characteristics:
 *   - Server health and authentication are performed once in setup().
 *   - The access token returned by setup() is shared with the VUs.
 *   - Independent API requests are executed concurrently using http.batch().
 *   - Load progressively increases:
 *       10 -> 25 -> 50 -> 100 -> 250 VUs
 *   - No artificial sleep is used.
 *   - Each iteration represents one group of frontend-style API requests.
 *
 * Run:
 *
 *   k6 run `
 *     --env K6_USER_EMAIL="your@email.com" `
 *     --env K6_USER_PASSWORD="your-password" `
 *     .\tests\k6\test-backend-load.ts
 *
 * Optional:
 *
 *   --env K6_BASE_URL="http://127.0.0.1:8000"
 */

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

const BASE_URL = normalizeBaseUrl(
  __ENV.K6_BASE_URL ??
    __ENV.SERVER_URL ??
    __ENV.NEXT_PUBLIC_SERVER_URL ??
    "http://127.0.0.1:8000"
);

const TEST_EMAIL =
  __ENV.K6_USER_EMAIL ??
  __ENV.USER_EMAIL ??
  "";

const TEST_PASSWORD =
  __ENV.K6_USER_PASSWORD ??
  __ENV.USER_PASSWORD ??
  "";

// -----------------------------------------------------------------------------
// Custom Endpoint Metrics
// -----------------------------------------------------------------------------

const healthDuration = new Trend(
  "health_duration",
  true
);

const projectsDuration = new Trend(
  "projects_duration",
  true
);

const servicesDuration = new Trend(
  "services_duration",
  true
);

const awardsDuration = new Trend(
  "awards_duration",
  true
);

const amenitiesDuration = new Trend(
  "amenities_duration",
  true
);

const profileDuration = new Trend(
  "profile_duration",
  true
);

// -----------------------------------------------------------------------------
// k6 Options
// -----------------------------------------------------------------------------

export const options = {
  scenarios: {
    backend_load_test: {
      executor: "ramping-vus",

      stages: [
        // Warm-up
        {
          duration: "30s",
          target: 10,
        },

        // 10 VUs
        {
          duration: "1m",
          target: 10,
        },

        // Ramp to 25 VUs
        {
          duration: "30s",
          target: 25,
        },
        {
          duration: "1m",
          target: 25,
        },

        // Ramp to 50 VUs
        {
          duration: "30s",
          target: 50,
        },
        {
          duration: "1m",
          target: 50,
        },

        // Ramp to 100 VUs
        {
          duration: "30s",
          target: 100,
        },
        {
          duration: "1m",
          target: 100,
        },

        // Ramp to 250 VUs
        {
          duration: "30s",
          target: 250,
        },
        {
          duration: "1m",
          target: 250,
        },

        // Ramp down
        {
          duration: "30s",
          target: 0,
        },
      ],

      gracefulRampDown: "30s",
      gracefulStop: "30s",
    },
  },

  thresholds: {
    // Overall HTTP reliability
    http_req_failed: [
      "rate<0.01",
    ],

    // Overall HTTP latency
    http_req_duration: [
      "p(95)<3000",
      "p(99)<5000",
    ],

    // Individual endpoint latency
    health_duration: [
      "p(95)<500",
    ],

    projects_duration: [
      "p(95)<3000",
    ],

    services_duration: [
      "p(95)<3000",
    ],

    awards_duration: [
      "p(95)<3000",
    ],

    amenities_duration: [
      "p(95)<3000",
    ],

    profile_duration: [
      "p(95)<3000",
    ],
  },

  summaryTrendStats: [
    "avg",
    "min",
    "med",
    "max",
    "p(90)",
    "p(95)",
    "p(99)",
  ],
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function requireEnv(
  name: string,
  value: string
): string {
  if (!value) {
    fail(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

function safeJson(
  response: http.Response
): any {
  try {
    return response.json();
  } catch {
    return null;
  }
}

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

function loginAndGetToken(): string {
  const response = http.post(
    `${BASE_URL}/api/v1/auth/signin`,
    JSON.stringify({
      email: requireEnv(
        "K6_USER_EMAIL",
        TEST_EMAIL
      ),
      password: requireEnv(
        "K6_USER_PASSWORD",
        TEST_PASSWORD
      ),
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

  const token =
    body?.data?.accessToken;

  const signinOk = check(response, {
    "signin returned 200": (r) =>
      r.status === 200,

    "signin response succeeded": () =>
      body?.success === true,

    "signin returned access token": () =>
      typeof token === "string" &&
      token.length > 0,
  });

  if (
    !signinOk ||
    response.status !== 200 ||
    typeof token !== "string" ||
    token.length === 0
  ) {
    fail("Signin failed");
  }

  return token;
}

// -----------------------------------------------------------------------------
// Response Validation
// -----------------------------------------------------------------------------

function checkPaginatedList(
  response: http.Response,
  label: string
): void {
  const body = safeJson(response);

  const items =
    body?.data?.items;

  check(response, {
    [`${label} returned 200`]: (r) =>
      r.status === 200,

    [`${label} succeeded`]: () =>
      body?.success === true,

    [`${label} returned items`]: () =>
      Array.isArray(items),

    [`${label} returned pagination metadata`]:
      () =>
        typeof body?.data?.total ===
          "number" &&
        typeof body?.data?.page ===
          "number" &&
        typeof body?.data?.pageSize ===
          "number",
  });
}

function checkArrayList(
  response: http.Response,
  label: string
): void {
  const body = safeJson(response);

  check(response, {
    [`${label} returned 200`]: (r) =>
      r.status === 200,

    [`${label} succeeded`]: () =>
      body?.success === true,

    [`${label} returned an array`]: () =>
      Array.isArray(body?.data),
  });
}

function checkProfile(
  response: http.Response
): void {
  const body = safeJson(response);

  check(response, {
    "profile returned 200": (r) =>
      r.status === 200,

    "profile response succeeded": () =>
      body?.success === true,

    "profile returned a user object": () =>
      Boolean(
        body?.data?.id &&
        body?.data?.email
      ),
  });
}

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

/**
 * setup() executes once before VU test execution begins.
 *
 * The returned access token is passed to the VUs.
 *
 * Authentication is intentionally not performed on every iteration because
 * this test focuses on backend API throughput and latency rather than
 * authentication throughput.
 */
export function setup() {
  // ---------------------------------------------------------------------------
  // Initial health check
  // ---------------------------------------------------------------------------

  const health = http.get(
    `${BASE_URL}/health`,
    {
      tags: {
        endpoint: "health-setup",
      },
    }
  );

  const healthBody =
    safeJson(health);

  const healthOk = check(health, {
    "setup health returned 200": (r) =>
      r.status === 200,

    "setup health succeeded": () =>
      healthBody?.success === true,
  });

  if (!healthOk) {
    fail(
      `Backend health check failed. Status: ${health.status}`
    );
  }

  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------

  const accessToken =
    loginAndGetToken();

  return {
    baseUrl: BASE_URL,
    accessToken,
  };
}

// -----------------------------------------------------------------------------
// Main Load Test
// -----------------------------------------------------------------------------

export default function (data: {
  baseUrl: string;
  accessToken: string;
}): void {
  const authHeaders = {
    Authorization:
      `Bearer ${data.accessToken}`,
  };

  /**
   * Execute all independent API requests concurrently.
   *
   * http.batch() is intentionally used instead of sequential http.get()
   * calls so that the workload represents a frontend making several
   * independent API requests at approximately the same time.
   */
  const responses = http.batch([
    {
      method: "GET",
      url:
        `${data.baseUrl}/health`,
      params: {
        tags: {
          endpoint: "health",
        },
      },
    },

    {
      method: "GET",
      url:
        `${data.baseUrl}/api/v1/projects?page=1&pageSize=10`,
      params: {
        tags: {
          endpoint: "projects",
        },
      },
    },

    {
      method: "GET",
      url:
        `${data.baseUrl}/api/v1/services?page=1&pageSize=10`,
      params: {
        tags: {
          endpoint: "services",
        },
      },
    },

    {
      method: "GET",
      url:
        `${data.baseUrl}/api/v1/awards?page=1&pageSize=10`,
      params: {
        tags: {
          endpoint: "awards",
        },
      },
    },

    {
      method: "GET",
      url:
        `${data.baseUrl}/api/v1/amenities/all`,
      params: {
        tags: {
          endpoint: "amenities",
        },
      },
    },

    {
      method: "GET",
      url:
        `${data.baseUrl}/api/v1/profile/me`,
      params: {
        headers: authHeaders,
        tags: {
          endpoint: "profile-me",
        },
      },
    },
  ]);

  // ---------------------------------------------------------------------------
  // Extract responses
  // ---------------------------------------------------------------------------

  const health =
    responses[0];

  const projects =
    responses[1];

  const services =
    responses[2];

  const awards =
    responses[3];

  const amenities =
    responses[4];

  const profile =
    responses[5];

  // ---------------------------------------------------------------------------
  // Record endpoint-specific timings
  // ---------------------------------------------------------------------------

  healthDuration.add(
    health.timings.duration
  );

  projectsDuration.add(
    projects.timings.duration
  );

  servicesDuration.add(
    services.timings.duration
  );

  awardsDuration.add(
    awards.timings.duration
  );

  amenitiesDuration.add(
    amenities.timings.duration
  );

  profileDuration.add(
    profile.timings.duration
  );

  // ---------------------------------------------------------------------------
  // Validate responses
  // ---------------------------------------------------------------------------

  const healthBody =
    safeJson(health);

  check(health, {
    "health returned 200": (r) =>
      r.status === 200,

    "health response succeeded": () =>
      healthBody?.success === true,
  });

  checkPaginatedList(
    projects,
    "projects list"
  );

  checkPaginatedList(
    services,
    "services list"
  );

  checkPaginatedList(
    awards,
    "awards list"
  );

  checkArrayList(
    amenities,
    "amenities list"
  );

  checkProfile(profile);
}