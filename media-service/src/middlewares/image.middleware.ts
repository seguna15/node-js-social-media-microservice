import { upload } from "@/config";
import { logger } from "@/utils";
import { NextFunction, Request, Response } from "express";
import multer from "multer";


export const validateImage = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
    
    if (err instanceof multer.MulterError) {
      logger.error("Multer error while uploading", err);
      return res.status(400).json({
        success: false,
        message: "Multer error while uploading",
        error: err.message,
        stack: err.stack,
      });
    } else if (err) {
      logger.error("Unexpected error while uploading", err);
      return res.status(500).json({
        success: false,
        message: "Unexpected error while uploading",
        error: err.message,
        stack: err.stack,
      });
    }

    if (!req.file) {
      logger.error("No file uploaded");
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please add a file and try again",
      });
    }

    next();
  });
};


