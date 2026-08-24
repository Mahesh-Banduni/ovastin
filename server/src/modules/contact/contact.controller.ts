import { injectable, inject } from "inversify";
import { TYPES } from "../../types.js";
import { ContactService } from "./contact.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

@injectable()
export class ContactController {
  constructor(
    @inject(TYPES.ContactService)
    private readonly contactService: ContactService
  ) {}

  submit = asyncHandler(async (request, reply) => {
    const submission = await this.contactService.submitForm(request.body as any);
    return reply.status(201).send(new ApiResponse(201, submission, "Message sent successfully"));
  });

  list = asyncHandler(async (request, reply) => {
    const { page = 1, pageSize = 10, isRead } = request.query as any;
    const parsedIsRead = isRead === "true" ? true : isRead === "false" ? false : undefined;
    const result = await this.contactService.listSubmissions(+page, +pageSize, parsedIsRead);
    return reply.status(200).send(new ApiResponse(200, result, "Submissions fetched"));
  });

  markRead = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    await this.contactService.markRead(id);
    return reply.status(200).send(new ApiResponse(200, null, "Marked as read"));
  });

  delete = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    await this.contactService.deleteSubmission(id);
    return reply.status(200).send(new ApiResponse(200, null, "Submission deleted"));
  });
}
