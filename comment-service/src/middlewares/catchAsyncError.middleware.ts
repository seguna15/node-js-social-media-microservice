import { Response, Request, NextFunction } from "express";

interface AsyncHandler {
    (req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const catchAsyncError =
    (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next).catch(next);
    }
    