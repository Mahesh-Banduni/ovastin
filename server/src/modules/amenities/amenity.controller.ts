import { injectable, inject } from "inversify";
import { TYPES } from "../../types.js";
import { AmenityService } from "./amenity.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

@injectable()
export class AmenityController {
  constructor(
    @inject(TYPES.AmenityService)
    private readonly amenityService: AmenityService
  ) {}

  list = asyncHandler(async (request, reply) => {
    const { page = 1, pageSize = 10, search } = request.query as any;
    const result = await this.amenityService.listAmenities(+page, +pageSize, search);
    return reply.status(200).send(new ApiResponse(200, result, "Amenities fetched"));
  });

  listAll = asyncHandler(async (_request, reply) => {
    const result = await this.amenityService.getAllAmenities();
    return reply.status(200).send(new ApiResponse(200, result, "All amenities fetched"));
  });

  getById = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const amenity = await this.amenityService.getAmenity(id);
    return reply.status(200).send(new ApiResponse(200, amenity, "Amenity fetched"));
  });

  create = asyncHandler(async (request, reply) => {
    const amenity = await this.amenityService.createAmenity(request.body as any);
    return reply.status(201).send(new ApiResponse(201, amenity, "Amenity created"));
  });

  update = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    const amenity = await this.amenityService.updateAmenity(id, request.body as any);
    return reply.status(200).send(new ApiResponse(200, amenity, "Amenity updated"));
  });

  delete = asyncHandler(async (request, reply) => {
    const { id } = request.params as { id: string };
    await this.amenityService.deleteAmenity(id);
    return reply.status(200).send(new ApiResponse(200, null, "Amenity deleted"));
  });
}
