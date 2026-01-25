import {
  addMessage,
  editMessage,
  deleteMessage,
} from "../controllers/message.contoller.js";

const messageHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinPost", (postId) => {
      if (!postId) return;
      if (socket.postId) socket.leave(socket.postId);
      socket.postId = postId;
      socket.join(postId);
    });

    socket.on("message", async ({ campId, postId, text }) => {
      try {
        if (!postId || !text || !campId) {
          return socket.emit("error", {
            message: "postId, campId and text required",
          });
        }

        const message = await addMessage(socket.userId, campId, postId, text);

        if (!message) {
          return socket.emit("error", {
            message: "Failed to send message",
          });
        }

        io.to(postId).emit("message", {
          sender: socket.userId,
          text,
          message,
        });
      } catch (error) {
        socket.emit("error", {
          message: "Internal server error",
        });
      }
    });

    socket.on("edit-message", async ({ messageId, text }) => {
      try {
        if (!messageId || !text) {
          return socket.emit("error", {
            message: "messageId and text required",
          });
        }

        const update = await editMessage(socket.userId, messageId, text);

        if (!update) {
          return socket.emit("error", {
            message: "Failed to update message",
          });
        }

        io.to(socket.postId).emit("edit-message", {
          sender: socket.userId,
          text,
          update,
        });
      } catch (error) {
        socket.emit("error", {
          message: "Internal server error",
        });
      }
    });

    socket.on("delete-message", async ({ messageId }) => {
      try {
        if (!messageId) {
          return socket.emit("error", {
            message: "messageId required",
          });
        }

        const deleted = await deleteMessage(socket.userId, messageId);

        if (!deleted) {
          return socket.emit("error", {
            message: "Failed to delete message",
          });
        }

        io.to(socket.postId).emit("delete-message", {
          sender: socket.userId,
          messageId,
        });
      } catch (error) {
        socket.emit("error", {
          message: "Internal server error",
        });
      }
    });
  });
};

export default messageHandler;
