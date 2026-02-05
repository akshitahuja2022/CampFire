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
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL,
  CLOUDINARY: {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  REDIS: {
    url: process.env.REDIS_URL,
  },
};

export default config;
