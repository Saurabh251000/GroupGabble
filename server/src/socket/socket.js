import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const userSocketMap = {};

// Function to get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Join a group chat room
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle sending messages to a group chat room
  socket.on("sendMessageToGroup", ({ roomId, message, senderId }) => {
    console.log(`Message from ${senderId} to room ${roomId}: ${message}`);
    io.to(roomId).emit("receiveGroupMessage", { senderId, message });
  });

  // Handle sending messages to a direct chat
  socket.on("sendMessageToUser", ({ receiverId, message, senderId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log(`Message from ${senderId} to user ${receiverId}: ${message}`);
      io.to(receiverSocketId).emit("receiveDirectMessage", { senderId, message });
    }
  });

  // Handle leaving a room
  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
