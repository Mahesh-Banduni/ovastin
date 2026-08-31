import { injectable, inject } from "inversify";
import { TYPES } from "../../types.js";
import { AwardService } from "./award.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

@injectable()
export class AwardController {
  constructor(
    @inject(TYPES.AwardService)
    private readonly awardService: AwardService
  ) {}

  list = asyncHandler(async (request, reply) => {
    const { page = 1, pageSize = 10, search } = request.query as any;
    const result = await this.awardService.listAwards(+page, +pageSize, search);
    return reply.status(200).send(new ApiResponse(200, result, "Awards fetched"));
  });

  getById = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const award = await this.awardService.getAward(id);
    return reply.status(200).send(new ApiResponse(200, award, "Award fetched"));
  });

  create = asyncHandler(async (request, reply) => {
    const file = (request as any).file;
    const award = await this.awardService.createAward(request.body as any, file);
    return reply.status(201).send(new ApiResponse(201, award, "Award created"));
  });

  update = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const file = (request as any).file;
    const award = await this.awardService.updateAward(id, request.body as any, file);
    return reply.status(200).send(new ApiResponse(200, award, "Award updated"));
  });

  delete = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    await this.awardService.deleteAward(id);
    return reply.status(200).send(new ApiResponse(200, null, "Award deleted"));
  });

  uploadImage = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const file = (request as any).file;
    if (!file) return reply.status(400).send(new ApiResponse(400, null, "No file uploaded"));

    const url = await this.awardService.uploadAwardImage(id, file.buffer, file.originalname);
    return reply.status(200).send(new ApiResponse(200, { imageUrl: url }, "Image uploaded"));
  });
}
