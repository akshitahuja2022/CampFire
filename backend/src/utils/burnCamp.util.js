import cron from "node-cron";
import Camp from "../models/camp.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Message from "../models/message.model.js";

const burnCamps = async () => {
  try {
    const now = new Date();

    const result = await Camp.updateMany(
      { burnAt: { $lte: now }, status: { $ne: "expired" } },
      { $set: { status: "expired" } },
    );
    if (!result.modifiedCount) return;

    const expiredCamps = await Camp.find({ status: "expired" });
    if (!expiredCamps.length) return;

    const ids = expiredCamps.map((camp) => camp._id);

    await Promise.all([
      User.updateMany(
        { camps: { $in: ids } },
        { $pull: { camps: { $in: ids } } },
      ),
      Post.deleteMany({ campId: { $in: ids } }),
      Message.deleteMany({ campId: { $in: ids } }),
      Camp.deleteMany({ _id: { $in: ids } }),
    ]);
  } catch (error) {
    console.log(error.message);
  }
};

const startBurning = () => {
  cron.schedule("*/5 * * * *", burnCamps);
};

export default startBurning;
