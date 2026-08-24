import {
  FastifyReply,
  FastifyRequest
} from "fastify";

type AsyncHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<unknown>;

const asyncHandler = (
  handler: AsyncHandler
): AsyncHandler => {
  return async (request, reply) => {
    return handler(request, reply);
  };
};

export default asyncHandler;