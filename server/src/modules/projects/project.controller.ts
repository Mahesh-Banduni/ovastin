import {
  injectable,
  inject
} from "inversify";

import { TYPES } from "../../types.js";
import { ProjectService } from "./project.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import { uploadToImageKit } from "../../utils/imagekit.js";

@injectable()
export class ProjectController {
  constructor(
    @inject(TYPES.ProjectService)
    private readonly projectService: ProjectService
  ) {}

  list = asyncHandler(async (request, reply) => {
    const { page, pageSize, ...filters } = request.query as any;
    const result = await this.projectService.listProjects(filters, page, pageSize);
    return reply.status(200).send(new ApiResponse(200, result, "Projects fetched"));
  });

  getById = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const project = await this.projectService.getProject(id);
    return reply.status(200).send(new ApiResponse(200, project, "Project fetched"));
  });

  create = asyncHandler(async (request, reply) => {
    const body = request.body as any;
    const { amenityIds, ...projectData } = body;

    if (body.possessionDate) {
      projectData.possessionDate = new Date(body.possessionDate);
    }

    const project = await this.projectService.createProject(projectData);

    if (amenityIds && amenityIds.length > 0) {
      await this.projectService.setProjectAmenities(project.id, amenityIds);
    }

    return reply.status(201).send(new ApiResponse(201, project, "Project created"));
  });

  update = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const { amenityIds, ...updateData } = body;

    if (body.possessionDate) {
      updateData.possessionDate = new Date(body.possessionDate);
    }

    const project = await this.projectService.updateProject(id, updateData);

    if (amenityIds !== undefined) {
      await this.projectService.setProjectAmenities(id, amenityIds);
    }

    return reply.status(200).send(new ApiResponse(200, project, "Project updated"));
  });

  delete = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    await this.projectService.deleteProject(id);
    return reply.status(200).send(new ApiResponse(200, null, "Project deleted"));
  });

  uploadImage = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const file = (request as any).file;

    if (!file) {
      return reply.status(400).send(new ApiResponse(400, null, "No file uploaded"));
    }

    const imageUrl = await uploadToImageKit(
      file.buffer,
      file.originalname,
      "ovastin/projects"
    );

    const image = await this.projectService.addProjectImage(id, imageUrl, undefined, 0);
    return reply.status(201).send(new ApiResponse(201, image, "Image uploaded"));
  });

  addImageUrl = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const { imageUrl, altText, sortOrder } = request.body as any;

    const image = await this.projectService.addProjectImage(id, imageUrl, altText, sortOrder);
    return reply.status(201).send(new ApiResponse(201, image, "Image added"));
  });

  removeImage = asyncHandler(async (request, reply) => {
    const { id, imageId } = request.params as { id: string; imageId: string };
    await this.projectService.removeProjectImage(id, imageId);
    return reply.status(200).send(new ApiResponse(200, null, "Image removed"));
  });

  setAmenities = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const { amenityIds } = request.body as { amenityIds: string[] };
    await this.projectService.setProjectAmenities(id, amenityIds);
    return reply.status(200).send(new ApiResponse(200, null, "Amenities updated"));
  });
}
