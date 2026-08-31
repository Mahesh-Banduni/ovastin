import { injectable, inject } from "inversify";
import { TYPES } from "../../types.js";
import { DeveloperService } from "./developer.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import { uploadToImageKit } from "../../utils/imagekit.js";

@injectable()
export class DeveloperController {
  constructor(
    @inject(TYPES.DeveloperService)
    private readonly developerService: DeveloperService
  ) {}

  list = asyncHandler(async (request, reply) => {
    const { page = 1, pageSize = 10, search } = request.query as any;
    const result = await this.developerService.listDevelopers(+page, +pageSize, search);
    return reply.status(200).send(new ApiResponse(200, result, "Developers fetched"));
  });

  getById = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const developer = await this.developerService.getDeveloper(id);
    return reply.status(200).send(new ApiResponse(200, developer, "Developer fetched"));
  });

  create = asyncHandler(async (request, reply) => {
    const file = (request as any).file;
    const developer = await this.developerService.createDeveloper(request.body as any, file);
    return reply.status(201).send(new ApiResponse(201, developer, "Developer created"));
  });

  update = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const file = (request as any).file;
    const developer = await this.developerService.updateDeveloper(id, request.body as any, file);
    return reply.status(200).send(new ApiResponse(200, developer, "Developer updated"));
  });

  delete = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    await this.developerService.deleteDeveloper(id);
    return reply.status(200).send(new ApiResponse(200, null, "Developer deleted"));
  });

  uploadLogo = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const file = (request as any).file;
    if (!file) return reply.status(400).send(new ApiResponse(400, null, "No file uploaded"));

    const logoUrl = await uploadToImageKit(file.buffer, file.originalname, "ovastin/developers");
    const developer = await this.developerService.updateDeveloper(id, { logo: logoUrl });
    return reply.status(200).send(new ApiResponse(200, developer, "Logo uploaded"));
  });
}
