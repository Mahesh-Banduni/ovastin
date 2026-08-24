import { FastifyInstance } from "fastify";
import container, { TYPES } from "../../container.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";
import { DeveloperController } from "./developer.controller.js";
import { createDeveloperSchema, updateDeveloperSchema } from "./developer.validation.js";

export async function developerRoutes(app: FastifyInstance) {
  const controller = container.get<DeveloperController>(TYPES.DeveloperController);

  app.get("/", controller.list);
  app.get("/:id", controller.getById);

  app.post(
    "/",
    { preHandler: [authenticate as any], preValidation: validateRequest({ body: createDeveloperSchema }) },
    controller.create
  );

  app.patch(
    "/:id",
    { preHandler: [authenticate as any], preValidation: validateRequest({ body: updateDeveloperSchema }) },
    controller.update
  );

  app.delete("/:id", { preHandler: [authenticate as any] }, controller.delete);
}
