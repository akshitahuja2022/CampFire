import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["PORT", "MONGODB_URL", "JWT_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URL,
  jwt_secret: process.env.JWT_SECRET,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

export default config;
