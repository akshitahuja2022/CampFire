import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true },
);

const Code = mongoose.model("Code", codeSchema);

export default Code;
