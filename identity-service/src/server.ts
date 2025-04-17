import app from "./app";
import * as http from "http";
import "dotenv/config";
import { dbConnection } from "./config";
import { logger } from "@/utils";


dbConnection(process.env.MONGO_URL!);


const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const server = http.createServer(app);


server.listen(PORT, () => logger.info(`Identity-service is running on port ${PORT}`));

//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});