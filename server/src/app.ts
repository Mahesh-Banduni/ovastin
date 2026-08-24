import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import config from "./config/config.js";
import container, {
  TYPES
} from "./container.js";

import {
  PrismaService
} from "./utils/prismaService";

import {
  authRoutes
} from "./modules/auth/auth.routes.js";

import ApiResponse from "./utils/ApiResponse.js";
import ApiError from "./utils/ApiError.js";

import {
  errorHandler
} from "./middleware/errorHandler.js";


export async function createApp() {

  // Create Fastify application

  const app = Fastify({
    logger: {
      level:
        config.env === "development"
          ? "debug"
          : "info"
    },

    requestIdHeader: "x-request-id"
  });


  // CORS

  await app.register(cors, {
    origin: [
      "*"
    ],

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Cache-Control",
      "ngrok-skip-browser-warning"
    ]
  });


  // Helmet

  await app.register(helmet, {
    contentSecurityPolicy: false
  });


  // Global Error Handler

  app.setErrorHandler(errorHandler);


  // 404 Handler

  app.setNotFoundHandler(
    async (request) => {

      throw new ApiError(
        404,
        `Route not found: ${request.method} ${request.url}`
      );
    }
  );


  // Health Check

  app.get(
    "/health",
    async (_request, reply) => {

      return reply
        .status(200)
        .send(
          new ApiResponse(
            200,
            {
              status: "UP",
              timestamp: new Date().toISOString()
            },
            "Server is healthy"
          )
        );
    }
  );


  // Root

  app.get(
    "/",
    async (_request, reply) => {

      return reply
        .status(200)
        .send(
          new ApiResponse(
            200,
            null,
            "API server is running"
          )
        );
    }
  );


  // Auth Routes

  await app.register(
    async (fastify) => {

      await authRoutes(
        fastify,
      );

    },
    {
      prefix: "/api/v1/auth"
    }
  );


  // Prisma

  const prisma =
    container.get<PrismaService>(
      TYPES.PrismaService
    );

  await prisma.connect();


  return app;
}


export default createApp;