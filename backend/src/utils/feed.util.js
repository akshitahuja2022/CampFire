import Camp from "../models/camp.model.js";
import Log from "../models/log.model.js";
import cron from "node-cron";
import { changeCacheVersion } from "./cache.util.js";

const scoreTrendingCamp = async (query, limit = 500) => {
  try {
    return await Log.aggregate([
      {
        $match: {
          createdAt: query,
        },
      },
      {
        $group: {
          _id: "$campId",
          userCount: {
            $sum: { $cond: [{ $eq: ["$log", "User"] }, 1, 0] },
          },
          postCount: {
            $sum: { $cond: [{ $eq: ["$log", "Post"] }, 1, 0] },
          },
          messageCount: {
            $sum: { $cond: [{ $eq: ["$log", "Message"] }, 1, 0] },
          },
          lastActivityAt: { $max: "$createdAt" },
        },
      },
      {
        $addFields: {
          totalActivity: {
            $add: [
              { $multiply: ["$postCount", 3] },
              { $multiply: ["$userCount", 2] },
              "$messageCount",
            ],
          },
        },
      },
      { $sort: { totalActivity: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          campId: "$_id",
          userCount: 1,
          postCount: 1,
          messageCount: 1,
          lastActivityAt: 1,
        },
      },
    ]);
  } catch (error) {
    console.log(error.message);
    return [];
  }
};
const calculateScore = (score, decayPower, timeDivisor) => {
  const base = score.postCount * 3 + score.userCount * 2 + score.messageCount;

  const age = (Date.now() - score.lastActivityAt.getTime()) / timeDivisor;

  const decay = Math.pow(age + 1, decayPower);
  return base / decay;
};

const updateScores = async ({ query, field, decayPower, timeDivisor }) => {
  try {
    const scores = await scoreTrendingCamp(query);
    if (!scores.length) return;

    const bulkOps = scores.map((score) => ({
      updateOne: {
        filter: { _id: score.campId },
        update: {
          $set: {
            [field]: calculateScore(score, decayPower, timeDivisor),
          },
        },
      },
    }));

    await Camp.bulkWrite(bulkOps);
  } catch (error) {
    console.log(error.message);
  }
};

const updateTrendingScores = () =>
  updateScores({
    query: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    field: "trendingScore",
    decayPower: 0.8,
    timeDivisor: 1000 * 60 * 60,
  });

const updateTopScores = () =>
  updateScores({
    query: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    field: "topScore",
    decayPower: 0.2,
    timeDivisor: 1000 * 60 * 60 * 24,
  });

const updateTrending = async () => {
  try {
    await updateTrendingScores();
    await updateTopScores();
  } catch (error) {
    console.log("Initial update failed:", error.message);
  }

  cron.schedule("0 * * * *", async () => {
    try {
      await updateTrendingScores();
      await changeCacheVersion("trendingCamps");
    } catch (error) {
      console.log("Trending cron failed:", error.message);
    }
  });

  cron.schedule("0 */6 * * *", async () => {
    try {
      await updateTopScores();
      await changeCacheVersion("topCamps");
    } catch (error) {
      console.log("Top cron failed:", error.message);
    }
  });
};

export default updateTrending;
