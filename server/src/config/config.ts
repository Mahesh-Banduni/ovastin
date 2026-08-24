/*
 * Load .env BEFORE reading process.env below. Must be the first import
 * so every consumer of this config sees environment variables.
 */
import "dotenv/config";

const config = {
  env: process.env.NODE_ENV ?? "development",

  port: Number(
    process.env.PORT ?? 8080
  ),

  databaseUrl:
    process.env.DATABASE_URL ?? "",

  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET ?? "",

    refreshSecret:
      process.env.JWT_REFRESH_SECRET ?? ""
  },

  mail: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(
      process.env.SMTP_PORT ?? 587
    ),
    secure:
      process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? "",
    password:
      process.env.SMTP_PASS ??
      process.env.SMTP_PASSWORD ?? "",
    from:
      process.env.SMTP_FROM ??
      process.env.MAIL_FROM ?? ""
  },

  imagekit: {
    publicKey:
      process.env.IMAGEKIT_PUBLIC_KEY ?? "",
    privateKey:
      process.env.IMAGEKIT_PRIVATE_KEY ?? "",
    urlEndpoint:
      process.env.IMAGEKIT_URL_ENDPOINT ?? ""
  }
};

export default config;