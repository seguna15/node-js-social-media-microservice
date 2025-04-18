import { AuthenticationError } from "@/errors/AuthenticationError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { logger, verifyToken } from "@/utils";
import { NextFunction, Request, Response } from "express";

export const protectedRoute = (req: Request, res: Response, next: NextFunction) => {

    const unprotectedRoutes = ["/public", "/health"];
    
    if(unprotectedRoutes.some((route) => req.path.startsWith(route))) {
        return next()
    }
    
    const accessToken = req.cookies.accessToken;


    if (!accessToken) {
        logger.warn('No access token found');
        res.clearCookie("accessToken", { httpOnly: true });
        next(new ForbiddenError('No access token found'));
        return
    }

    const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET!);
    if (!decoded) {
        logger.warn('Invalid access token');
        next(new AuthenticationError('Invalid access token'));
        return
    }

    req.user = decoded;
    next()
    
}