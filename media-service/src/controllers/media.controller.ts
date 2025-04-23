import { UploadApiResponse } from "cloudinary";

import { InvalidRequestError } from "@/errors/InvalidRequestError";
import { createMedia, fetchAll } from "@/services/media.service";
import { logger, successResponse, uploadMediaToCloudinary } from "@/utils";
import { NextFunction, Request, Response } from "express";


/***
 * @route /api/media
 * @method POST
 * @access protected
 * @argument 
 * @return Promise<void>
 */
export const uploadMediaCtrl = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Uploading media...");

    try {
        if (!req.file) {
          logger.error("No file uploaded");
          next(
            new InvalidRequestError(
              "No file uploaded. Please add a file and try again"
            )
          );
          return;   
        }
        
        const { originalname, mimetype, buffer } = req.file;
        const userId = req?.user?.id!;
        
        logger.info(`File details = name=${originalname}, type=${mimetype}`);
        logger.info("Uploading to cloudinary starting....");

        const cloudinaryUploadResult: UploadApiResponse = await uploadMediaToCloudinary(req.file) as UploadApiResponse;
        logger.info(
          `Cloudinary upload successful. Public ID = ${cloudinaryUploadResult.public_id}`
        );

        const newlyCreatedMedia = await createMedia({
          publicId: cloudinaryUploadResult.public_id,
          originalName: originalname,
          mimeType: mimetype,
          url: cloudinaryUploadResult.secure_url,
          userId,
        });

        await newlyCreatedMedia.save(); 

         res.status(201).json({
          success: true,
          message: "Media uploaded successfully",
          mediaId: newlyCreatedMedia._id,
          url: newlyCreatedMedia.url, 
        });
        return
    } catch (error) {
        logger.error(`Error uploading media: ${error}`);
        next(new Error("Oops Something went wrong."));
        return;
    }
}


/***
 * @route /api/media
 * @method GET
 * @access protected
 * @argument 
 * @return Promise<void>
 */
export const getAllMedia = async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Fetching all media...`);
  try {
   
    const result = await fetchAll();
    successResponse(
      res,
      result,
      "Media fetched successfully",
      200
    );
    return;
  } catch (error) {
    logger.error(`Error fetching media: ${error}`)
    next(new Error("Oops Something went wrong."));
    return;
  }
}