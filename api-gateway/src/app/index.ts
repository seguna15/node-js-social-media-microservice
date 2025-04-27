import express, { Express, Request, Response } from "express";
import { configureCors } from "@/config";
import { logger } from "@/utils";
import { globalErrorHandler, rateLimiter } from "@/middlewares";
import helmet from "helmet";

import cookieParser from "cookie-parser";
import { identityServiceProxy, postServiceProxy, mediaServiceProxy, searchServiceProxy, commentServiceProxy } from "@/proxies";
import { protectedRoute } from "@/middlewares";

const app: Express = express();


app.use(helmet())
app.use(configureCors());
app.use(cookieParser())
app.use((req, res, next) => {
  if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
    express.json()(req, res, next);
  } else {
    next();
  }
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
app.use("/v1/auth", identityServiceProxy(proxyOptions));

app.use("/v1/posts", protectedRoute, postServiceProxy(proxyOptions));

app.use("/v1/media", protectedRoute, mediaServiceProxy(proxyOptions));

app.use("/v1/search", protectedRoute, searchServiceProxy(proxyOptions));

app.use("/v1/comments", protectedRoute, commentServiceProxy(proxyOptions));

app.use(globalErrorHandler)

export default app;