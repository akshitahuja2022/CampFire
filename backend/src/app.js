import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";

import authRouter from "./routes/auth.route.js";
import campRoutes from "./routes/camp.route.js";
import postRoutes from "./routes/post.route.js";
import messageRoutes from "./routes/message.route.js";

const app = express();

app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/camp", campRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/message", messageRoutes);

app.use(errorMiddleware);

export default app;
