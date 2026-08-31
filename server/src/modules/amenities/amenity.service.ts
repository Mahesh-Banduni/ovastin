import { injectable, inject } from "inversify";
import ApiError from "../../utils/ApiError.js";
import { TYPES } from "../../types.js";
import { uploadToImageKit } from "../../utils/imagekit.js";
import { AmenityRepository, CreateAmenityData, UpdateAmenityData } from "./amenity.repository.js";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

@injectable()
export class AmenityService {
  constructor(
    @inject(TYPES.AmenityRepository)
    private readonly amenityRepository: AmenityRepository
  ) {}

  async listAmenities(page: number, pageSize: number, search?: string) {
    return this.amenityRepository.findMany(page, pageSize, search);
  }

  async getAllAmenities() {
    return this.amenityRepository.findAll();
  }

  async getAmenity(id: string) {
    const amenity = await this.amenityRepository.findById(id);
    if (!amenity) throw new ApiError(404, "Amenity not found");
    return amenity;
  }

  async createAmenity(data: CreateAmenityData, files?: any) {
    const slug = data.slug || slugify(data.name);
    const existing = await this.amenityRepository.findBySlug(slug);
    if (existing) throw new ApiError(409, "An amenity with this slug already exists");

    const amenityData = { ...data };
    const iconFile = files?.icon?.[0];
    if (iconFile?.buffer && iconFile.originalname) {
      amenityData.icon = await uploadToImageKit(iconFile.buffer, iconFile.originalname, "ovastin/amenities");
    }

    return this.amenityRepository.create({ ...amenityData, slug });
  }

  async updateAmenity(id: string, data: UpdateAmenityData, files?: any) {
    await this.getAmenity(id);
    if (data.slug) {
      const existing = await this.amenityRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) throw new ApiError(409, "An amenity with this slug already exists");
    }

    const updateData = { ...data };
    const iconFile = files?.icon?.[0];
    if (iconFile?.buffer && iconFile.originalname) {
      updateData.icon = await uploadToImageKit(iconFile.buffer, iconFile.originalname, "ovastin/amenities");
    }

    return this.amenityRepository.update(id, updateData);
  }

  async deleteAmenity(id: string) {
    await this.getAmenity(id);
    return this.amenityRepository.delete(id);
  }
}
