import mongoose from "mongoose";

const campSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 40,
    },
    keywords: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalUsers: {
      type: Number,
      min: 1,
      default: 1,
    },
    burnAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

campSchema.index({ burnAt: 1 });

const Camp = mongoose.model("Camp", campSchema);

export default Camp;
