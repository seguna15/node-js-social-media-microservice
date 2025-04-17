import { redis } from "@/config";
import { ConflictError } from "@/errors/ConflictError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { InvalidRequestError } from "@/errors/InvalidRequestError";
import { NotFoundError } from "@/errors/NotFoundError";
import { fetchUserByEmailOrUsername, loginUserService, registerUserService } from "@/services/identity.service";
import {  genToken, logger, loginSchema, registrationSchema,  verifyToken } from "@/utils";
import { sendCookie } from "@/utils/cookies.util";
import { setCredentials } from "@/utils/set-credentials.util";
import { NextFunction, Request, Response } from "express";


/***
 * @route /api/auth/register
 * @access public
 * @argument userData {username, email, password}
 * @return success: boolean, message: string
 */
export const RegisterCtrl = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Register controller called');
    try {
        const validateData = registrationSchema.safeParse(req.body);
        if(!validateData.success){
            logger.error(`Registration validation error: ${validateData.error.issues[0].message}`)
            next(new InvalidRequestError(validateData.error.issues[0].message))
            return
        }
        
        const {username, email, password} = req.body;
        const existingUser = await fetchUserByEmailOrUsername(email, username);

        if(existingUser){
            logger.warn('User already exists')
            next(new ConflictError('User already exists'));
            return
        }
        
        const newUser = await registerUserService({username, email, password});
        
        if(newUser && newUser?.id){
            logger.info('User registered successfully');
            
            await setCredentials(res, newUser?.id);

             res.status(201).json({
               success: true,
               message: "User registered successfully",
               newUser
             });
             return
        }
    } catch (error) {
        logger.error(error);
        next(new Error("Oops Something went wrong."));
        return
    }
    
}


/***
 * @route /api/auth/login
 * @access public
 * @argument userData {email, password}
 * @return success: boolean, message: string
 */
export const loginCtrl = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Login controller called')
    try {

        if (req?.cookies?.refreshToken) {
          res?.clearCookie("refreshToken", { httpOnly: true });
        }

        if (req?.cookies?.accessToken) {
          res?.clearCookie("accessToken", { httpOnly: true });
        }
       

        const validateData = loginSchema.safeParse(req.body);

        if(!validateData.success){
            logger.error(`Login validation error: ${validateData.error.issues[0].message}`)
            next(new InvalidRequestError(validateData.error.issues[0].message))
            return
        }
        
        const {email, password} = req.body;

        const user = await loginUserService({email, password});

        if(!user){
            logger.warn('User not found')
            next(new NotFoundError('User not found'));
            return
        }

        //at this point I know user has id.
        await setCredentials(res, user?.id!);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user
        });

        return 
    }catch(error){
        logger.error(error);
        next(new Error("Oops Something went wrong."));
        return;
    }
}



/***
 * @route /api/auth/logout
 * @access public
 * @argument none
 * @return success: boolean, message: string
 */
export const logoutCtrl = async(req: Request, res: Response, next: NextFunction) => {
    logger.info('Logout controller called')
    try {
        const { refreshToken } = req.cookies;
       
        if(refreshToken){
           const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
           await redis.del(`refresh-token:${decoded?.id}`);
        }

         res.clearCookie("accessToken", { httpOnly: true });
         res.clearCookie("refreshToken", { httpOnly: true });

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
        return
    }catch(error){
        logger.error(error);
        next(new Error("Oops Something went wrong."));
        return;
    }
}


/***
 * @route /api/auth/refresh-token
 * @access public
 * @argument none
 * @return success: boolean, message: string
 */
export const refreshAccessToken = async(req: Request, res: Response, next: NextFunction) => {
    logger.info('Refresh token controller called')
    try {
        const {refreshToken} = req.cookies;
        if(!refreshToken){
            logger.warn('No refresh token found')
            next(new ForbiddenError('No refresh token found'));
            return
        }

        const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

        if(!decoded){
            logger.warn('Invalid refresh token')
            res.clearCookie("refreshToken", { httpOnly: true });
            res.clearCookie("accessToken", { httpOnly: true });
            next(new ForbiddenError('Invalid refresh token'));
            return
        }

        const cachedToken = await redis.get(`refresh-token:${decoded.id}`);

        if(!cachedToken){
            logger.warn('No cached token found');
            res.clearCookie("refreshToken", {httpOnly: true});
            res.clearCookie("accessToken", {httpOnly: true});
            next(new ForbiddenError('No cached token found'));
            return
        }

        if(cachedToken !== refreshToken){
            logger.warn('Cached token does not match refresh token');
            res.clearCookie('refreshToken', {httpOnly: true});
            res.clearCookie('accessToken', {httpOnly: true});
            next(new ForbiddenError('Invalid refresh token'));
            return
        }

        const {accessToken:newAccessToken} = genToken(decoded.id);
        sendCookie(res, "accessToken", newAccessToken, 60 * 60 * 1000);
        
        

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
        });

        return;
      
    } catch (error) {
        logger.error(error);
        next(new Error("Oops Something went wrong."));
        return;
    }
}

