import { injectable, inject } from "inversify";
import { TYPES } from "../../types.js";
import { ServiceService } from "./service.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

@injectable()
export class ServiceController {
  constructor(
    @inject(TYPES.ServiceService)
    private readonly serviceService: ServiceService
  ) {}

  list = asyncHandler(async (request, reply) => {
    const { page = 1, pageSize = 10, search } = request.query as any;
    const result = await this.serviceService.listServices(+page, +pageSize, search);
    return reply.status(200).send(new ApiResponse(200, result, "Services fetched"));
  });

  getById = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const service = await this.serviceService.getService(id);
    return reply.status(200).send(new ApiResponse(200, service, "Service fetched"));
  });

  create = asyncHandler(async (request, reply) => {
    const service = await this.serviceService.createService(request.body as any);
    return reply.status(201).send(new ApiResponse(201, service, "Service created"));
  });

  update = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const service = await this.serviceService.updateService(id, request.body as any);
    return reply.status(200).send(new ApiResponse(200, service, "Service updated"));
  });

  delete = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    await this.serviceService.deleteService(id);
    return reply.status(200).send(new ApiResponse(200, null, "Service deleted"));
  });
}
