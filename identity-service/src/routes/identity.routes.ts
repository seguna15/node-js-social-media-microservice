import { redis } from "@/config";
import { loginCtrl, logoutCtrl, refreshAccessToken, RegisterCtrl } from "@/controllers/identity.controller";
import { TooManyRequests } from "@/errors/TooManyRequests";
import { catchAsyncError } from "@/middlewares";
import { logger } from "@/utils";
import express, {NextFunction, Response, Request, Router} from "express"
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

const routes: Router = express.Router();

const sensitiveEndpoint = rateLimit({
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

routes
    .post("/register", sensitiveEndpoint, catchAsyncError(RegisterCtrl))
    .post("/login", sensitiveEndpoint,  catchAsyncError(loginCtrl))
    .post("/logout", catchAsyncError(logoutCtrl))
    .post("/refresh-token", sensitiveEndpoint, catchAsyncError(refreshAccessToken))


export default routes;