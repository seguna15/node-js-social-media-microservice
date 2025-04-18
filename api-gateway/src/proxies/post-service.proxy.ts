import proxy from "express-http-proxy";
import { logger } from "@/utils";

export const postServiceProxy = (proxyOptions: any) => {
  return proxy(process.env.POST_SERVICE_URL || "http://localhost:3002", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      proxyReqOpts.headers["Content-Type"] = "application/json";
      if (srcReq.user && srcReq.user.id) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.id;
      }
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Received ${proxyRes.statusCode} response from post service`
      );
      return proxyResData;
    },
  });
};
