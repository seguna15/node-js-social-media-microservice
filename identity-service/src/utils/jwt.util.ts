import { redis } from "@/config";
import { IDecoded } from "@/Interfaces";
import * as jwt from "jsonwebtoken";


export const genToken = (id: string) => {
    const accessToken = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: "60m"})
    const refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: "1d"})
    return {accessToken, refreshToken}
}


export const saveRefreshTokenToCache = async (id: string, token: string) => {
    await redis.setex(`refresh-token:${id}`, 86400, token) // expires after 1day
}


export const verifyToken =  (token: string, secret: string) => {
    const payload: jwt.JwtPayload = jwt.verify(token, secret) as jwt.JwtPayload;

    if(payload === null){
        return null;
    }
    if(typeof payload === "string"){
        return null;
    }

    const decoded: IDecoded = {
        id: payload.id,
    }
    return decoded;
}

