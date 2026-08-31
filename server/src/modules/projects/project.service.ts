import {
  injectable,
  inject
} from "inversify";

import ApiError from "../../utils/ApiError.js";
import { TYPES } from "../../types.js";
import {
  ProjectRepository,
  CreateProjectData,
  UpdateProjectData,
  ProjectFilters
} from "./project.repository.js";
import { uploadToImageKit, uploadImageValue } from "../../utils/imagekit.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

@injectable()
export class ProjectService {
  constructor(
    @inject(TYPES.ProjectRepository)
    private readonly projectRepository: ProjectRepository
  ) {}

  async listProjects(
    filters: ProjectFilters,
    page: number,
    pageSize: number
  ) {
    return this.projectRepository.findMany(filters, page, pageSize);
  }

  async getProject(id: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new ApiError(404, "Project not found");
    return project;
  }

  async createProject(data: CreateProjectData) {
    const slug = data.slug || slugify(data.name);

    const existing = await this.projectRepository.findBySlug(slug);
    if (existing) throw new ApiError(409, "A project with this slug already exists");

    const { file, ...projectData } = data;

    if (file?.buffer && file.originalname) {
      // Multipart upload (Buffer from memory storage)
      projectData.coverImage = await uploadToImageKit(
        file.buffer,
        file.originalname,
        "ovastin/projects"
      );
    } else if (projectData.coverImage) {
      // Base64 data URL from the admin UI is uploaded to ImageKit; plain URLs pass through
      const uploaded = await uploadImageValue(
        projectData.coverImage,
        "ovastin/projects",
        "project-cover"
      );
      if (uploaded) projectData.coverImage = uploaded;
    }

    return this.projectRepository.create({ ...projectData, slug });
  }

  async updateProject(id: string, data: UpdateProjectData) {
    await this.getProject(id);

    if (data.slug) {
      const existing = await this.projectRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        throw new ApiError(409, "A project with this slug already exists");
      }
    }

    const { file, ...updateData } = data;

    if (file?.buffer && file.originalname) {
      updateData.coverImage = await uploadToImageKit(
        file.buffer,
        file.originalname,
        "ovastin/projects"
      );
    } else if (updateData.coverImage) {
      const uploaded = await uploadImageValue(
        updateData.coverImage,
        "ovastin/projects",
        "project-cover"
      );
      if (uploaded) updateData.coverImage = uploaded;
    }

    return this.projectRepository.update(id, updateData);
  }

  async deleteProject(id: string) {
    await this.getProject(id);
    return this.projectRepository.delete(id);
  }

  async addProjectImage(
    projectId: string,
    imageUrl: string,
    altText?: string,
    sortOrder?: number
  ) {
    await this.getProject(projectId);
    return this.projectRepository.addImage(projectId, imageUrl, altText, sortOrder);
  }

  async removeProjectImage(projectId: string, imageId: string) {
    await this.getProject(projectId);
    return this.projectRepository.removeImage(imageId);
  }

  async setProjectAmenities(projectId: string, amenityIds: string[]) {
    await this.getProject(projectId);
    return this.projectRepository.setAmenities(projectId, amenityIds);
  }
}
