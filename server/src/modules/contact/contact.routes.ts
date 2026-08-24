import { FastifyInstance } from "fastify";
import container, { TYPES } from "../../container.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";
import { ContactController } from "./contact.controller.js";
import { contactSubmitSchema } from "./contact.validation.js";

export async function contactRoutes(app: FastifyInstance) {
  const controller = container.get<ContactController>(TYPES.ContactController);

  // Public - submit form
  app.post(
    "/",
    { preValidation: validateRequest({ body: contactSubmitSchema }) },
    controller.submit
  );

  // Admin - list, mark read, delete
  app.get("/", { preHandler: [authenticate as any] }, controller.list);
  app.patch("/:id/read", { preHandler: [authenticate as any] }, controller.markRead);
  app.delete("/:id", { preHandler: [authenticate as any] }, controller.delete);
}
