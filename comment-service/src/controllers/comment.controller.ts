import { ConflictError } from "@/errors/ConflictError";
import { createComment, getPostComments } from "@/services/comment.service";
import { logger } from "@/utils";
import { MongoServerError } from "mongodb";
import { NextFunction, Request, Response } from "express";

export const createCommentController = async (req: Request, res: Response, next: NextFunction) =>{
    logger.info(`Creating  comment...`);
    try {
       const { postId, comment} = req.body;
       const userId = req.user?.id!;

       const newComment = await createComment({userId, postId, comment})
         res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: newComment
        })
        return;
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
          next(new ConflictError("Comment already exists"));
          return;
        }
        if (error instanceof Error) {
          logger.error(`Error occurred while creating comment ${error.message}`);
          next(new Error(`Error occurred while creating comment`));
          return;
        }
        logger.error(`An unknown error occurred while creating comment`);
        next(new Error(`An unknown error occurred while creating comment`));
    }
}


export const getPostCommentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`Getting post comment...`);
  try {
    const { postId } = req.params!;
    const comments = await getPostComments(postId);
    
    res.status(201).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments
    });
    return;
  } catch (error) {
    
    if (error instanceof Error) {
      logger.error(`Error occurred while creating comment ${error.message}`);
      next(new Error(`Error occurred while creating comment`));
      return;
    }
    logger.error(`An unknown error occurred while creating comment`);
    next(new Error(`An unknown error occurred while creating comment`));
  }
};