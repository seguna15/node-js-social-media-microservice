import { searchPost } from "@/services/search.service";
import { logger } from "@/utils";
import { NextFunction, Request, Response } from "express";

export const searchPostController = async (req: Request, res: Response, next: NextFunction) =>{
    logger.info(`Searching posts...`);
    try {
        const { searchQuery } = req.query!;
        const query = typeof searchQuery === "string" ? searchQuery : "";
        const result = await searchPost(query);
        res.json(result)
         return
    } catch (error) {
        logger.error(`Error occurred while searching posts`)
        next(new Error(`Error occurred while searching posts`))
        return
    }
}
