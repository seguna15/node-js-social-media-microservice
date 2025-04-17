import  { Response, Request } from "express";

export const sendCookie = async (res: Response, tokenName: string, token: string, expiration: number) => {
  res.cookie(tokenName, token, {
    httpOnly: true, // XSS
    secure: process.env.NODE_ENV === "production", // https
    sameSite: "strict", // csrf
    maxAge: expiration,
  });
};



