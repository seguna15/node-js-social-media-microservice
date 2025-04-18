import proxy from "express-http-proxy";
import { logger } from "@/utils";

export const mediaServiceProxy = (proxyOptions: any) => {
  return proxy(process.env.MEDIA_SERVICE_URL || "http://localhost:3003", {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {};
       proxyReqOpts.headers["x-user-id"] = srcReq?.user?.id;
       
        if (!srcReq.headers["content-type"]?.startsWith("multipart/form-data")) {
          proxyReqOpts.headers["Content-Type"] = "application/json";
        }
      
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Received ${proxyRes.statusCode} response from media service`
      );
      return proxyResData;
    },
  });
};
