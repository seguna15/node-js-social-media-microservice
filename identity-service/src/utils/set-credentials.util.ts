import { Response } from "express";
import { sendCookie } from "./cookies.util";
import { genToken, saveRefreshTokenToCache } from "./jwt.util";

export const setCredentials = async (res: Response, id: string) => {
   
    const { accessToken, refreshToken } = genToken(id);

    await sendCookie(res, "accessToken", accessToken, 60 * 60 * 1000);
    await sendCookie(res, "refreshToken", refreshToken, 86400 * 1000);
             
    await saveRefreshTokenToCache(
    id,
    refreshToken
    );
} 