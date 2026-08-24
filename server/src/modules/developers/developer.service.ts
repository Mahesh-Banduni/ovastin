import { injectable, inject } from "inversify";
import ApiError from "../../utils/ApiError.js";
import { TYPES } from "../../types.js";
import { DeveloperRepository, CreateDeveloperData, UpdateDeveloperData } from "./developer.repository.js";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

@injectable()
export class DeveloperService {
  constructor(
    @inject(TYPES.DeveloperRepository)
    private readonly developerRepository: DeveloperRepository
  ) {}

  async listDevelopers(page: number, pageSize: number, search?: string) {
    return this.developerRepository.findMany(page, pageSize, search);
  }

  async getDeveloper(id: string) {
    const developer = await this.developerRepository.findById(id);
    if (!developer) throw new ApiError(404, "Developer not found");
    return developer;
  }

  async createDeveloper(data: CreateDeveloperData) {
    const slug = data.slug || slugify(data.name);
    const existing = await this.developerRepository.findBySlug(slug);
    if (existing) throw new ApiError(409, "A developer with this slug already exists");
    return this.developerRepository.create({ ...data, slug });
  }

  async updateDeveloper(id: string, data: UpdateDeveloperData) {
    await this.getDeveloper(id);
    if (data.slug) {
      const existing = await this.developerRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new ApiError(409, "A developer with this slug already exists");
    }
    return this.developerRepository.update(id, data);
  }

  async deleteDeveloper(id: string) {
    await this.getDeveloper(id);
    return this.developerRepository.delete(id);
  }
}
