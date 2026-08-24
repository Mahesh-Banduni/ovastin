import { FastifyInstance } from "fastify";
import container, { TYPES } from "../../container.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";
import { AmenityController } from "./amenity.controller.js";
import { createAmenitySchema, updateAmenitySchema } from "./amenity.validation.js";

export async function amenityRoutes(app: FastifyInstance) {
  const controller = container.get<AmenityController>(TYPES.AmenityController);

  app.get("/", controller.list);
  app.get("/all", controller.listAll);
  app.get("/:id", controller.getById);

  app.post(
    "/",
    { preHandler: [authenticate as any], preValidation: validateRequest({ body: createAmenitySchema }) },
    controller.create
  );

  app.patch(
    "/:id",
    { preHandler: [authenticate as any], preValidation: validateRequest({ body: updateAmenitySchema }) },
    controller.update
  );

  app.delete("/:id", { preHandler: [authenticate as any] }, controller.delete);
}
