import express from "express";

interface ReqUser {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser;
    }
  }
}
