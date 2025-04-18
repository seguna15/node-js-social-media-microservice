import { InvalidRequestError } from "@/errors/InvalidRequestError";
import { NotFoundError } from "@/errors/NotFoundError";
import { createPost, deletePost, getAllPosts, getPostById } from "@/services/post.service";
import { invalidateCache, logger, postCreationSchema } from "@/utils";
import { NextFunction, Request, Response } from "express";


/***
 * @route /api/posts
 * @method POST
 * @access protected
 * @argument postCreationData {title, content, media[]}
 * @return Promise<void>
 */
export const createPostCrl = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Creating post...")
    try {
        const validateData = postCreationSchema.safeParse(req.body);
        if (!validateData.success) {
            logger.warn(`Post creation validation error: ${validateData.error.issues[0].message}`)
            next(new InvalidRequestError(validateData.error.issues[0].message))
            return;
        }
        const { title, content, media } = req.body;
        const id = req?.user?.id!;
        
        const post = await createPost({title, content, media}, id);

        await invalidateCache();

        logger.info(`Post created successfully: ${post._id}`)
        res.status(201).json({
            success: true,
            data: post,
            message: "Post created successfully"
        })
        return
    } catch (error) {
        logger.error(`Error creating post: ${error}`);
        next(new Error("Oops Something went wrong."));
        return;
    }
}


/***
 * @route /api/posts/public
 * @access public
 * @method GET
 * @argument 
 * @return Promise<void>
 */
export const getAllPostsCtrl = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Fetching all posts...");
    try {
      const page = parseInt(req?.query?.page as string || "1");
      const limit = parseInt(req?.query?.limit as string || "10");
      
     const result = await getAllPosts(page, limit);

     logger.info(`Posts fetched successfully: ${result.posts.length}`)

    res.status(200).json(result);
    return;

    } catch (error) {
      logger.error(`Error fetching posts: ${error}`);
      next(new Error("Oops Something went wrong."));
      return;
    }
}


/***
 * @route /api/post/:id
 * @access public
 * @method GET
 * @argument 
 * @return Promise<void>
 */
export const getSinglePostCtrl = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Fetching single post...");
    try {
        const id = req.params.id;
        const post = await getPostById(id);
        if(!post){
            logger.warn(`Post with id ${id} not found.`)
            next(new NotFoundError(`Post with id ${id} not found.`))
            return;
        }

        logger.info(`Post fetched successfully: ${post._id}`)
        res.status(200).json(post);
        return;
    
    } catch (error) {
        logger.error(`Error fetching single post: ${error}`);
        next(new Error("Oops Something went wrong."));
        return;
    }
}


/***
 * @route /api/post/:id
 * @access protected
 * @method DELETE
 * @argument 
 * @return Promise<void>
 */
export const deleteSinglePostCtrl = async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Deleting single post...");
    try {
        const id = req.params.id;
        const userId = req?.user?.id!;
        const post = await deletePost(id, userId);

        if(!post){
            logger.warn(`Post with id ${id} not found.`)
            next(new NotFoundError(`Post with id ${id} not found.`))
            return;
        }

        await invalidateCache(id);

        logger.info(`Post deleted successfully: ${post._id}`)
        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        })
        return;
    }catch(error){
        logger.error(`Error deleting post: ${error}`);
        next(new Error("Oops Something went wrong"));
        return;
    }
}






