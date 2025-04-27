import { redis } from "@/config";
import { TooManyRequests } from "@/errors/TooManyRequests";
import { logger } from "@/utils";
import {Request, Response, NextFunction } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";

//DDOS protection & rate limit
const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

export const rateLimit = (async (req: Request, _res: Response, next: NextFunction) => {
  try {
    await rateLimiter.consume(req.ip || "");
    next();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Too many requests from ${req.ip}`, error.message);
    } else {
      logger.error(`Too many requests from ${req.ip}`, String(error));
    }
    next(new TooManyRequests("Too many requests"));
  }
});
