import crypto from "crypto";

const generateHash = () => {
  const rawHash = crypto.randomBytes(32).toString("hex");

  const tokenHash = crypto.createHash("sha256").update(rawHash).digest("hex");

  return {
    rawHash,
    tokenHash,
  };
};

const getHash = (rawToken) => {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  return tokenHash;
};

export { generateHash, getHash };
