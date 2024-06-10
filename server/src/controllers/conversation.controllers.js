import asyncHandler from "express-async-handler";
import Conversation from "../models/conversation.models.js";
import GroupChat from "../models/groupChat.models.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Chat in group
export const groupchat = asyncHandler(async (req, res) => {
  const { groupid, text, senderid } = req.body;
  try {
    let groupChat = await GroupChat.findOne({ groupid });

    const newMessage = { senderid, text, timestamp: new Date() };

    if (!groupChat) {
      groupChat = await GroupChat.create({
        groupid,
        messages: [newMessage],
      });
    } else {
      groupChat.messages.push(newMessage);
      await groupChat.save();
    }

    // Emit message to all users in the group
    io.to(groupid).emit("receiveGroupMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sent message controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

// Chat with friend in personal room
export const chats = asyncHandler(async (req, res) => {
  const { receiverid, senderid, text } = req.body;
  try {
    let conversation = await Conversation.findOne({
      $or: [
        { receiverid: receiverid, senderid: senderid },
        { receiverid: senderid, senderid: receiverid },
      ],
    });

    const newMessage = { senderid, text, timestamp: new Date() };

    if (!conversation) {
      conversation = await Conversation.create({
        senderid,
        receiverid,
        messages: [newMessage],
      });
    } else {
      conversation.messages.push(newMessage);
      await conversation.save();
    }

    // Emit message to the receiver
    const receiverSocketId = getReceiverSocketId(receiverid);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveDirectMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sent message controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
});

// Retrieve group chat messages
export const gpmessages = asyncHandler(async (req, res) => {
  const { groupid } = req.body;
  try {
    const messages = await GroupChat.findOne({ groupid });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieve friend chat messages
export const chatmessages = asyncHandler(async (req, res) => {
  const { senderid, receiverid } = req.body;
  try {
    const messages = await Conversation.findOne({
      $or: [
        { receiverid: receiverid, senderid: senderid },
        { receiverid: senderid, senderid: receiverid },
      ],
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
