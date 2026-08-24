import {
  FastifyRequest,
  FastifyReply
} from "fastify";

import container, { TYPES } from "../container.js";
import { JwtService } from "../utils/jwtService.js";
import ApiError from "../utils/ApiError.js";


export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized");
  }

  const token = authHeader.slice(7);

  const jwtService = container.get<JwtService>(TYPES.JwtService);

  try {
    const payload = await jwtService.verifyAccessToken(token);

    (request as any).user = {
      userId: payload.userId,
      email: payload.email
    };
  } catch {
    throw new ApiError(401, "Unauthorized");
  }
}
