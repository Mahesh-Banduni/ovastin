import { FastifyInstance } from "fastify";
import container, { TYPES } from "../../container.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";
import { uploadFields } from "../../middleware/upload.middleware.js";
import { ServiceController } from "./service.controller.js";
import { createServiceSchema, updateServiceSchema } from "./service.validation.js";

export async function serviceRoutes(app: FastifyInstance) {
  const controller = container.get<ServiceController>(TYPES.ServiceController);

  app.get("/", controller.list);
  app.get("/:id", controller.getById);

  app.post(
    "/",
    {
      preHandler: [
        authenticate as any,
        uploadFields([
          { name: "icon", maxCount: 1 },
          { name: "coverImage", maxCount: 1 }
        ]),
        validateRequest({ body: createServiceSchema })
      ]
    },
    controller.create
  );

  app.patch(
    "/:id",
    {
      preHandler: [
        authenticate as any,
        uploadFields([
          { name: "icon", maxCount: 1 },
          { name: "coverImage", maxCount: 1 }
        ]),
        validateRequest({ body: updateServiceSchema })
      ]
    },
    controller.update
  );

  app.delete("/:id", { preHandler: [authenticate as any] }, controller.delete);
}
