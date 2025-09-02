import sharp from "sharp";
import stream from "stream";

export async function resizeImage(buffer, options) {
  const { width, height, quality = 80, format = "jpeg" } = options;

  let transformer = sharp(buffer).resize(width, height).toFormat(format, { quality });
  return await transformer.toBuffer();
}
