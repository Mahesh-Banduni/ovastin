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
    user: process.env.SMTP_USER ?? "",
    password:
      process.env.SMTP_PASSWORD ?? "",
    from:
      process.env.MAIL_FROM ?? ""
  }
};

export default config;