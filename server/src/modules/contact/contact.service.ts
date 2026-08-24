import { injectable, inject } from "inversify";
import ApiError from "../../utils/ApiError.js";
import { TYPES } from "../../types.js";
import { ContactRepository } from "./contact.repository.js";

@injectable()
export class ContactService {
  constructor(
    @inject(TYPES.ContactRepository)
    private readonly contactRepository: ContactRepository
  ) {}

  async listSubmissions(page: number, pageSize: number, isRead?: boolean) {
    return this.contactRepository.findMany(page, pageSize, isRead);
  }

  async submitForm(data: { name: string; email: string; phone?: string; message: string }) {
    return this.contactRepository.create(data);
  }

  async markRead(id: string) {
    const submission = await this.contactRepository.findById(id);
    if (!submission) throw new ApiError(404, "Submission not found");
    return this.contactRepository.markRead(id);
  }

  async deleteSubmission(id: string) {
    const submission = await this.contactRepository.findById(id);
    if (!submission) throw new ApiError(404, "Submission not found");
    return this.contactRepository.delete(id);
  }
}
