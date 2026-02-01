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

    const data = JSON.parse(cached);
    const campsData = data.camps;
    const cursor = data.cursor;

    const userCountKeys = campsData.map((camp) => `camp:userCount:${camp._id}`);
    const counts = await redisClient.mGet(userCountKeys);

    const camps = campsData.map((camp, index) => ({
      ...camp,
      totalUsers: Number(counts[index]) || 0,
    }));

    return { camps, cursor };
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

    await Promise.all(
      camps.map((camp) => {
        return adjustUserCount(camp._id, camp.totalUsers || 0, 0);
      }),
    );
  } catch (error) {
    console.log(error.message);
  }
};

const adjustUserCount = async (campId, initialCount, delta = 1) => {
  const redisClient = getRedisClient();
  const key = `camp:userCount:${campId}`;

  const lua = `
    if redis.call("EXISTS", KEYS[1]) == 0 then
      redis.call("SET", KEYS[1], ARGV[1])
      redis.call("EXPIRE", KEYS[1], ARGV[3])
      return ARGV[1]
    else
      if ARGV[2] == "-1" then
        local val = redis.call("DECR", KEYS[1])
        if val < 0 then
          redis.call("SET", KEYS[1], 0)
          return 0
        end
        return val
      elseif ARGV[2] == "0" then
        return redis.call("GET", KEYS[1])
      else
        return redis.call("INCR", KEYS[1])
      end
    end
  `;

  return await redisClient.eval(lua, {
    keys: [key],
    arguments: [initialCount.toString(), delta.toString(), "1800"],
  });
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

const flushAll = async () => {
  const redisClient = getRedisClient();
  if (!redisClient) return;
  await redisClient.flushAll();
};

export { getCache, setCache, changeCacheVersion, adjustUserCount, flushAll };
