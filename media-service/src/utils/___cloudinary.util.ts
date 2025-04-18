import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import { logger } from "@/utils";
import { Express } from "express";

interface UploadedFile extends Express.Multer.File {
  // Use Express.Multer.File
  buffer: Buffer;
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const uploadMediaToCloudinary = async (
  file: UploadedFile,
  options: UploadApiOptions = {}
) => {
  try {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", ...options },
        (error, result) => {
          if (error) {
            logger.error("Cloudinary upload failed", {
              error,
              filename: file.originalname,
            });
            return reject(error);
          }
          logger.info("Cloudinary upload successful", {
            public_id: result?.public_id,
            url: result?.secure_url,
            filename: file.originalname,
          });
          resolve(result!);
        }
      );

      uploadStream.on("error", (err) => {
        // ADDED THIS
        logger.error("Error sending data to Cloudinary stream:", err);
        reject(err);
      });

      // Add logging to inspect the buffer
      logger.debug("File buffer length:", file.buffer.length);
      logger.debug(
        "File buffer start (hex):",
        file.buffer.toString("hex").substring(0, 200)
      );

      uploadStream.end(file.buffer);
    });
  } catch (error) {
    logger.error("Unexpected error in uploadMediaToCloudinary", error);
    throw error;
  }
};
