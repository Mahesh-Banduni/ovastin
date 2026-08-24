import { injectable, inject } from "inversify";
import ApiError from "../../utils/ApiError.js";
import { TYPES } from "../../types.js";
import { AwardRepository, CreateAwardData, UpdateAwardData } from "./award.repository.js";
import { uploadToImageKit } from "../../utils/imagekit.js";

@injectable()
export class AwardService {
  constructor(
    @inject(TYPES.AwardRepository)
    private readonly awardRepository: AwardRepository
  ) {}

  async listAwards(page: number, pageSize: number, search?: string) {
    return this.awardRepository.findMany(page, pageSize, search);
  }

  async getAward(id: string) {
    const award = await this.awardRepository.findById(id);
    if (!award) throw new ApiError(404, "Award not found");
    return award;
  }

  async createAward(data: CreateAwardData) {
    return this.awardRepository.create(data);
  }

  async updateAward(id: string, data: UpdateAwardData) {
    await this.getAward(id);
    return this.awardRepository.update(id, data);
  }

  async deleteAward(id: string) {
    await this.getAward(id);
    return this.awardRepository.delete(id);
  }

  async uploadAwardImage(id: string, fileBuffer: Buffer, fileName: string): Promise<string> {
    await this.getAward(id);
    const url = await uploadToImageKit(fileBuffer, fileName, "ovastin/awards");
    await this.awardRepository.update(id, { imageUrl: url });
    return url;
  }
}
