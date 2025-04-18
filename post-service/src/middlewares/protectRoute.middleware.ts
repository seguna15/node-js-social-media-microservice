import { ForbiddenError } from "@/errors/ForbiddenError";
import { logger } from "@/utils";
import { NextFunction, Request, Response } from "express";

export const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    const userId =  req?.headers['x-user-id'];

    if(!userId || userId === "") {
        logger.warn('Access attempted without authorization header')
        next(new ForbiddenError('Access attempted without authorization header'))
        return
    }
    
    req.user =  {id: userId.toString()};

    next()
} ;

 