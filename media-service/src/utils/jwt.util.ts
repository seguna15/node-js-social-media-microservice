import { IDecoded } from "@/Interfaces";
import * as jwt from "jsonwebtoken";


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

