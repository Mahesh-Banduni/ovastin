import {
  FastifyRequest
} from "fastify";

import { ZodType } from "zod";

import ApiError from "../utils/ApiError.js";

export interface RequestValidationSchema {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export function validateRequest(
  schema: RequestValidationSchema
) {
  return async (
    request: FastifyRequest
  ) => {
    const errors = [];

    if (schema.body) {
      const result =
        schema.body.safeParse(request.body);

      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        );
      } else {
        request.body = result.data;
      }
    }

    if (schema.query) {
      const result =
        schema.query.safeParse(request.query);

      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        );
      } else {
        request.query = result.data;
      }
    }

    if (schema.params) {
      const result =
        schema.params.safeParse(request.params);

      if (!result.success) {
        errors.push(
          ...result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        );
      } else {
        request.params = result.data;
      }
    }

    if (errors.length > 0) {
      throw new ApiError(
        400,
        "Validation failed",
        errors
      );
    }
  };
}