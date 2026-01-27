import sendMail from "../services/nodeMailer.service.js";
import Code from "../models/code.model.js";
import ApiError from "../utils/ApiError.util.js";
import { generateHash, getHash } from "./emailToken.util.js";

const authCode = async (rawToken, code) => {
  const tokenHash = getHash(rawToken);
  const record = await Code.findOne({ tokenHash });
  if (!record) {
    throw new ApiError("Invalid OTP", 401);
  }

  if (record.attempts >= 5) {
    await record.deleteOne();
    throw new ApiError("Maximum attempts exceeded", 401);
  }

  if (record.expiresAt <= Date.now()) {
    await record.deleteOne();
    throw new ApiError("OTP has expired", 401);
  }

  if (record.code !== Number(code)) {
    record.attempts += 1;
    await record.save();
    throw new ApiError("Incorrect OTP", 401);
  }

  await record.deleteOne();

  const data = {
    user_id: record.user_id,
    forWhat: record.forWhat,
  };
  return data;
};

const sendCode = async (to, user_id, forWhat = "verify") => {
  const code = Math.floor(100000 + Math.random() * 900000);
  const { rawHash, tokenHash } = generateHash();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  const newCode = new Code({
    code,
    user_id,
    email: to,
    forWhat,
    expiresAt,
    tokenHash,
  });
  await newCode.save();

  try {
    await sendMail(to, code);
  } catch {
    throw new ApiError("Failed to send email", 401);
  }

  return rawHash;
};

export { authCode, sendCode };
