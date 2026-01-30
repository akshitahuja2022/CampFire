import dbConnect from "./configs/db.config.js";
import { connectRedis } from "./configs/redis.config.js";
import app from "./app.js";
import config from "./configs/env.config.js";
import initSocket from "./socket/init.socket.js";
import http from "http";
import startBurning from "./utils/burnCamp.util.js";
import updateTrending from "./utils/feed.util.js";

const startServer = async () => {
  try {
    await dbConnect();
    await connectRedis();
    const server = http.createServer(app);

    initSocket(server);
    startBurning();
    updateTrending();

    server.listen(config.port, () => {
      console.log(`Server is running at http://localhost:${config.port}/`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

startServer();
