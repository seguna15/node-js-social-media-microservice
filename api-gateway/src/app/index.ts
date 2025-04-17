import express, { Express, Request, Response, NextFunction } from "express";
import { configureCors, redis } from "@/config";
import { logger } from "@/utils";
import { TooManyRequests } from "@/errors/TooManyRequests";
import { globalErrorHandler } from "@/middlewares";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";


const app: Express = express();


app.use(helmet())
app.use(configureCors());
app.use(cookieParser())
app.use(express.json());


//rate Limit
const rateLimiter = rateLimit({
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

app.use(rateLimiter)

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body: ${JSON.stringify(req.body)}`);
  next();
});


const proxyOptions = {
  proxyReqPathResolver: (req: Request) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err: Error, res: Response) => {
    logger.error(`Error proxying request: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  },
};


//setting up proxy for our identity service
app.use(
  "/v1/auth",
  proxy(process.env.IDENTITY_SERVICE_URL || "http://localhost:3001", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Received ${proxyRes.statusCode} response from identity service `
      );
      return proxyResData;
    },
  })
);

app.use(globalErrorHandler)

export default app;