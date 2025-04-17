import { logger } from "@/utils";
import { CustomError } from "@/utils/CustomError";
import { ErrorRequestHandler,Request, Response, NextFunction } from "express";


export const globalErrorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof CustomError) {
        logger.error(`${err.name} - ${err.statusCode} - ${err.message} - ${err.stack}`)
        res.status(err.statusCode).json(err.serialize())
        return
    }
    

    logger.error(`${err.name} - ${err.message} - ${err.stack} ${err}`)
    res.status(500).json({
        success: false,
        message: "Something went wrong"
    })
    return
}
    
