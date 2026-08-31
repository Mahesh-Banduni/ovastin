import ImageKit, { toFile } from "@imagekit/nodejs";
import { randomUUID } from "node:crypto";
import config from "../config/config.js";

const imagekit = new ImageKit({
  privateKey: config.imagekit.privateKey
});

export async function uploadToImageKit(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = "ovastin"
): Promise<string> {
  const fileUpload = await toFile(fileBuffer, fileName);

  const result = await imagekit.files.upload({
    file: fileUpload,
    fileName,
    folder
  });

  return (result as any).url;
}

export async function uploadImageValue(
  value: string | undefined,
  folder: string,
  fileNamePrefix: string
): Promise<string | undefined> {
  if (!value || !value.startsWith("data:")) return value;

  const match = value.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");

  const mimeType = match[1] ?? "application/octet-stream";
  const encodedData = match[2] ?? "";
  const extension = mimeType.split("/")[1]?.replace("svg+xml", "svg") || "bin";
  const fileName = `${fileNamePrefix}-${randomUUID()}.${extension}`;
  return uploadToImageKit(Buffer.from(encodedData, "base64"), fileName, folder);
}

export default imagekit;
