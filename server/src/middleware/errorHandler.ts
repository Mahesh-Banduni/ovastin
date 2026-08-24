import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from "fastify";
import {
  Prisma
} from "@prisma/client";

import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import config from "../config/config";

export function errorHandler(
  error: FastifyError | ApiError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  let err = error;

  if (!(err instanceof ApiError)) {
    const statusCode =
      err.statusCode ??
      getErrorStatusCode(err);

    const message =
      err.message ||
      "Internal Server Error";

    err = new ApiError(
      statusCode,
      message,
      [],
      err.stack
    );
  }

  logger.error({
    statusCode: err.statusCode,
    message: err.message,
    url: request.url,
    method: request.method,
    ip: request.ip,
    ...(config.env === "development" && {
      stack: err.stack
    })
  });

  return reply
    .status(err.statusCode || 500)
    .send({
      statusCode: err.statusCode || 500,
      data: err.data,
      message: err.message,
      success: false,
      errors: err.errors,
      ...(config.env === "development" && {
        stack: err.stack
      })
    });
}

function getErrorStatusCode(
  error: FastifyError
): number {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError
  ) {
    switch (error.code) {
      case "P2002":
        return 409;

      case "P2025":
        return 404;

      default:
        return 400;
    }
  }

  if (
    error.statusCode &&
    error.statusCode >= 400 &&
    error.statusCode < 600
  ) {
    return error.statusCode;
  }

  return 500;
}

