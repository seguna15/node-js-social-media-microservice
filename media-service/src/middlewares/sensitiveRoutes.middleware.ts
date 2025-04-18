import { NextFunction, Request, Response } from "express";
import { logger } from "@/utils";
import { redis } from "@/config";
import rateLimit from "express-rate-limit";
import { TooManyRequests } from "@/errors/TooManyRequests";
import RedisStore from "rate-limit-redis";

export const sensitiveEndpoint = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, _res: Response, next: NextFunction) => {
    logger.warn(`Sensitive endpoint accessed by ${req.ip}`),
    next(new TooManyRequests("Too many requests"));
  },
  store: new RedisStore({
    // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});
