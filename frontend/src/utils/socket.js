import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKNED_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["polling"],
});
