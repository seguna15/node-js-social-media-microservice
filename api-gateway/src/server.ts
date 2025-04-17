import app from "./app";
import * as http from "http";
import "dotenv/config";
import { logger } from "@/utils";


const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    logger.info(`API Gateway is running on port ${PORT}`);
    logger.info(`Identity-service is running on port ${process.env.IDENTITY_SERVICE_URL}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});
