import { Server } from "socket.io";

let io;

export const initSocket = (server, options = {}) => {
  if (io) return io;
  io = new Server(server, {
    cors: {
      origin: options.corsOrigin || "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinVideo", (videoId) => {
      try {
        socket.join(String(videoId));
      } catch (e) {
        /* ignore */
      }
    });

    socket.on("disconnect", () => {
      // console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIo = () => io;
