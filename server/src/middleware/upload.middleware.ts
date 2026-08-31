import { FastifyRequest, FastifyReply } from "fastify";
import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/avif"
];

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `Unsupported file format: ${file.originalname}`));
    }
  }
});

/**
 * Wraps a Multer single file upload handler into a Fastify preHandler middleware.
 */
export function uploadSingle(fieldName: string) {
  const handler = upload.single(fieldName);
  return (req: FastifyRequest, reply: FastifyReply, done: (err?: any) => void) => {
    handler(req.raw as any, reply.raw as any, (err: any) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return done(new ApiError(400, "File exceeds 10MB image limit"));
        }
        return done(err);
      }

      const mergedBody = { ...(req.raw as any).body, ...(req.body as any) };
      if ((req.raw as any).file && fieldName in mergedBody) {
        delete mergedBody[fieldName];
      }

      // Sync body and file attached by Multer on req.raw to Fastify request object
      req.body = mergedBody;
      (req as any).file = (req.raw as any).file;
      done();
    });
  };
}

/**
 * Wraps a Multer fields upload handler into a Fastify preHandler middleware.
 */
export function uploadFields(fields: { name: string; maxCount?: number }[]) {
  const handler = upload.fields(fields);
  return (req: FastifyRequest, reply: FastifyReply, done: (err?: any) => void) => {
    handler(req.raw as any, reply.raw as any, (err: any) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return done(new ApiError(400, "File exceeds 10MB image limit"));
        }
        return done(err);
      }

      const mergedBody = { ...(req.raw as any).body, ...(req.body as any) };
      for (const field of fields) {
        if ((req.raw as any).files && field.name in mergedBody) {
          delete mergedBody[field.name];
        }
      }

      req.body = mergedBody;
      (req as any).files = (req.raw as any).files;
      done();
    });
  };
}

export default upload;
