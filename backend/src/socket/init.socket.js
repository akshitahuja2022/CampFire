import { Server } from "socket.io";
import messageHandler from "./message.socket.js";
import authSocket from "../socket/auth.socket.js";
import config from "../configs/env.config.js";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: `${config.FRONTEND_URL}`,
      credentials: true,
      methods: ["GET", "POST"],
    },
    transports: ["polling", "websocket"],
  });

  io.use(authSocket);
  messageHandler(io);

  return io;
};

export default initSocket;
