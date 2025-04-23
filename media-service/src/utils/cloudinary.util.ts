import { v2 as cloudinary } from "cloudinary";
import { logger } from "@/utils";
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface UploadedFile extends Express.Multer.File {
  // Use Express.Multer.File
  buffer: Buffer;
}

export const uploadMediaToCloudinary = async (file: UploadedFile) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Add error handling for the stream
    uploadStream.on("error", (err) => {
      logger.error("Stream error:", err);
      reject(err);
    });

    // Write the buffer to the stream
    uploadStream.write(file.buffer);
    uploadStream.end();
  });
};


export const deleteMediaFromCloudinary = async (publicId: string) => {
  try {
      const result  = await cloudinary.uploader.destroy(publicId);
      logger.info(`Media deleted from Cloudinary: ${publicId}`);
      return result;
  } catch (error) {
      logger.error("Error deleting media from Cloudinary:", error);
      throw error;
  }
}


