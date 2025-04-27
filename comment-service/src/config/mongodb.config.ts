import mongoose from "mongoose";
import { logger } from "@/utils";
export const dbConnection = async (url: string)  => {
    try {
        const connection = await mongoose.connect(url);
        logger.info(`Mongo DB connected to ${connection.connection.host}`)
    } catch (error) {
        logger.error(`error connecting to mongoDB: ${error}`);
        process.exit(1);
    }
}