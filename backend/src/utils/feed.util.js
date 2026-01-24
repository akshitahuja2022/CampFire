import Camp from "../models/camp.model.js";
import Log from "../models/log.model.js";
import cron from "node-cron";

const scoreTrendingCamp = async () => {
  try {
    const scores = await Log.aggregate([
      {
        $match: {
          createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
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
    if (scores.length < 1) return scores;

    for (const score of scores) {
      const calclate =
        score.postCount * 3 + score.userCount * 2 + score.messageCount * 1;
      const minutesAgo =
        (Date.now() - score.lastActivityAt.getTime()) / (1000 * 60);

      const decay = Math.pow(minutesAgo + 1, 0.8);
      score.trendingScore = calclate / decay;
    }

    return scores;
  } catch (error) {
    console.log(error.message);
  }
};

const updateTrendingScores = async () => {
  const scores = await scoreTrendingCamp();
  if (!scores.length) return;

  const bulkOps = scores.map((score) => ({
    updateOne: {
      filter: { _id: score.campId },
      update: {
        $set: {
          trendingScore: score.trendingScore,
        },
      },
    },
  }));

  await Camp.bulkWrite(bulkOps);
};

const updateTrending = () => {
  cron.schedule("0 * * * *", () => {
    console.log("Updating trending camps...");
    updateTrendingScores();
  });
};

export default updateTrending;
