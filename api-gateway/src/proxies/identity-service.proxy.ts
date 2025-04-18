import proxy from "express-http-proxy";
import { logger } from "@/utils";

export const identityServiceProxy = (proxyOptions: any) => {
  return proxy(process.env.IDENTITY_SERVICE_URL || "http://localhost:3001", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Received ${proxyRes.statusCode} response from identity service`
      );
      return proxyResData;
    },
  });
};
