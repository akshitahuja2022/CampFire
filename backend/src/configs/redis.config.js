import { createClient } from "redis";
import config from "../configs/env.config.js";

const connectRedis = async () => {
  try {
    const redisClient = createClient({
      url: config.REDIS.url,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.warn("Redis connection failed. Continuing without Redis.");
    redisClient = null;
    return null;
  }
};

export { connectRedis };
