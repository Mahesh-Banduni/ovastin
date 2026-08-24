import "dotenv/config";
import "reflect-metadata";

import createApp from "./app.js";
import config from "./config/config.js";

import container, {
  TYPES
} from "./container.js";

import {
  PrismaService
} from "./utils/prismaService";


async function startServer() {
  let app;

  try {
    // Create Fastify application

    app = await createApp();


    // Get Prisma from Inversify

    const prisma =
      container.get<PrismaService>(
        TYPES.PrismaService
      );


    // Connect Database

    await prisma.connect();

    app.log.info(
      "Database connected successfully"
    );


    // Start Server

    await app.listen({
      port: config.port,
      host: "0.0.0.0"
    });


    app.log.info(
      `Server running on port ${config.port}`
    );


    app.log.info(
      `Environment: ${config.env}`
    );


  } catch (error) {

    // If Fastify was created, use its logger
    if (app) {
      app.log.error(
        error,
        "Failed to start server"
      );
    } else {
      console.error(
        "Failed to start server",
        error
      );
    }

    process.exit(1);
  }

  // Graceful Shutdow

  const shutdown = async (
    signal: string
  ) => {

    app.log.info(
      `${signal} received. Starting graceful shutdown...`
    );


    try {

      // Close Fastify
      await app.close();

      app.log.info(
        "Fastify server closed"
      );


      // Disconnect Prisma
      const prisma =
        container.get<PrismaService>(
          TYPES.PrismaService
        );

      await prisma.disconnect();

      app.log.info(
        "Database connection closed"
      );


      process.exit(0);

    } catch (error) {

      app.log.error(
        error,
        "Error during graceful shutdown"
      );

      process.exit(1);
    }
  };

  // Process Signal

  process.once(
    "SIGINT",
    () => {
      void shutdown("SIGINT");
    }
  );


  process.once(
    "SIGTERM",
    () => {
      void shutdown("SIGTERM");
    }
  );
}


void startServer();