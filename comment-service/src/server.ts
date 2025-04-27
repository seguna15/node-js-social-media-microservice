import app from "./app";
import * as http from "http";
import "dotenv/config";
import { consumeEvent, dbConnection } from "./config";
import { logger } from "@/utils";
import { connectToRabbitMQ } from "./config";
import {  handleDelete } from "./handlers/comment-event";

dbConnection(process.env.MONGO_URL!);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3002;

const server = http.createServer(app);

async function startServer(){
  try {
    await connectToRabbitMQ()
     await consumeEvent("post.deleted", handleDelete);
    server.listen(PORT, () =>
      logger.info(`post-service is running on port ${PORT}`)
    );
  } catch (error) {
    logger.error(`Something went wrong: ${error}`)
  }
}

startServer()

//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});
