// utils/responseHelper.js

import { Response } from "express";


/**
 * Standardized success response
 * @param {object} res - Express response object
 * @param {*} data - Data to send (optional)
 * @param {string} message - Success message (optional)
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (
  res: Response,
  data: any = null,
  message: string = "Success",
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardized error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 */
export const errorResponse = (
    res: Response,
    message: string = "Internal Server Error",
    statusCode: number = 500
) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

