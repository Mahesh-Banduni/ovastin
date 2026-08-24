import ImageKit, { toFile } from "@imagekit/nodejs";
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

export default imagekit;
