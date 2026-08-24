import { FastifyInstance } from "fastify";
import multer from "multer";

import container, { TYPES } from "../../container.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";
import { ProjectController } from "./project.controller.js";
import {
  createProjectSchema,
  updateProjectSchema,
  projectFiltersSchema,
  addImageSchema
} from "./project.validation.js";

const upload = multer({ storage: multer.memoryStorage() });

export async function projectRoutes(app: FastifyInstance) {
  const controller = container.get<ProjectController>(TYPES.ProjectController);

  // Public routes
  app.get(
    "/",
    { preValidation: validateRequest({ query: projectFiltersSchema }) },
    controller.list
  );

  app.get("/:id", controller.getById);

  // Protected routes
  app.post(
    "/",
    {
      preHandler: [authenticate as any],
      preValidation: validateRequest({ body: createProjectSchema })
    },
    controller.create
  );

  app.patch(
    "/:id",
    {
      preHandler: [authenticate as any],
      preValidation: validateRequest({ body: updateProjectSchema })
    },
    controller.update
  );

  app.delete(
    "/:id",
    { preHandler: [authenticate as any] },
    controller.delete
  );

  app.post(
    "/:id/images/url",
    {
      preHandler: [authenticate as any],
      preValidation: validateRequest({ body: addImageSchema })
    },
    controller.addImageUrl
  );

  app.delete(
    "/:id/images/:imageId",
    { preHandler: [authenticate as any] },
    controller.removeImage
  );

  app.put(
    "/:id/amenities",
    { preHandler: [authenticate as any] },
    controller.setAmenities
  );
}
