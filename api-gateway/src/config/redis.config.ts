import { logger } from "@/utils";
import RedisClient from "ioredis";

export const redis = new RedisClient();


redis.on("connect", () => logger.info("Redis server connected"))

redis.on("error", (error) => logger.error("Redis server error",error))

