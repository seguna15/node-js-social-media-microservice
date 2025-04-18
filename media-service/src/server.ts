import app from "./app";
import * as http from "http";
import "dotenv/config";
import { dbConnection } from "./config";
import { logger } from "@/utils";


dbConnection(process.env.MONGO_URL!);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3002;

const server = http.createServer(app);

server.listen(PORT, () =>
  logger.info(`post-service is running on port ${PORT}`)
);

//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${JSON.stringify(promise)}, reason: ${JSON.stringify(reason)}`);
});
