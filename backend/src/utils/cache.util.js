import { getRedisClient } from "../configs/redis.config.js";

const CACHE_TTL = {
  trendingCamps: 30 * 60,
  topCamps: 6 * 60 * 60,
};

const getCache = async (field, keyId) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) return null;

    const version = (await redisClient.get(`${field}:version`)) ?? 1;
    const cacheKey = `${field}:v${version}:keyId=${keyId ?? "none"}`;

    const cached = await redisClient.get(cacheKey);
    if (!cached) return null;

    return JSON.parse(cached);
  } catch (error) {
    console.error("Redis getCache error:", error.message);
    return null;
  }
};

const setCache = async (field, camps, cursor, keyId) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) return;

    const version = (await redisClient.get(`${field}:version`)) ?? 1;
    const cacheKey = `${field}:v${version}:keyId=${keyId ?? "none"}`;

    const ttl = CACHE_TTL[field] ?? 30 * 60;

    await redisClient.set(cacheKey, JSON.stringify({ camps, cursor }), {
      EX: ttl,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const changeCacheVersion = async (field) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) return;
    await redisClient.incr(`${field}:version`);
  } catch (error) {
    console.log(error.message);
  }
};

export { getCache, setCache, changeCacheVersion };
