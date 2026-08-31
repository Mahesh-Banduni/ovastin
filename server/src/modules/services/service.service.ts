import { injectable, inject } from "inversify";
import ApiError from "../../utils/ApiError.js";
import { TYPES } from "../../types.js";
import { ServiceRepository, CreateServiceData, UpdateServiceData } from "./service.repository.js";
import { uploadToImageKit } from "../../utils/imagekit.js";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

@injectable()
export class ServiceService {
  constructor(
    @inject(TYPES.ServiceRepository)
    private readonly serviceRepository: ServiceRepository
  ) {}

  async listServices(page: number, pageSize: number, search?: string) {
    return this.serviceRepository.findMany(page, pageSize, search);
  }

  async getService(id: string) {
    const service = await this.serviceRepository.findById(id);
    if (!service) throw new ApiError(404, "Service not found");
    return service;
  }

  async createService(data: CreateServiceData, files?: any) {
    const slug = data.slug || slugify(data.name);
    const existing = await this.serviceRepository.findBySlug(slug);
    if (existing) throw new ApiError(409, "A service with this slug already exists");

    const serviceData = { ...data };

    const iconFile = files?.icon?.[0];
    if (iconFile?.buffer && iconFile.originalname) {
      serviceData.icon = await uploadToImageKit(iconFile.buffer, iconFile.originalname, "ovastin/services");
    }

    const coverImageFile = files?.coverImage?.[0];
    if (coverImageFile?.buffer && coverImageFile.originalname) {
      serviceData.coverImage = await uploadToImageKit(coverImageFile.buffer, coverImageFile.originalname, "ovastin/services");
    }

    return this.serviceRepository.create({ ...serviceData, slug });
  }

  async updateService(id: string, data: UpdateServiceData, files?: any) {
    await this.getService(id);
    if (data.slug) {
      const existing = await this.serviceRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new ApiError(409, "A service with this slug already exists");
    }

    const updateData = { ...data };

    const iconFile = files?.icon?.[0];
    if (iconFile?.buffer && iconFile.originalname) {
      updateData.icon = await uploadToImageKit(iconFile.buffer, iconFile.originalname, "ovastin/services");
    }

    const coverImageFile = files?.coverImage?.[0];
    if (coverImageFile?.buffer && coverImageFile.originalname) {
      updateData.coverImage = await uploadToImageKit(coverImageFile.buffer, coverImageFile.originalname, "ovastin/services");
    }

    return this.serviceRepository.update(id, updateData);
  }

  async deleteService(id: string) {
    await this.getService(id);
    return this.serviceRepository.delete(id);
  }
}
