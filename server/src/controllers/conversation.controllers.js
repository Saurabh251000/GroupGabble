import asyncHandler from "express-async-handler";
import Conversation from "../models/conversation.models.js";
import GroupChat from "../models/groupChat.models.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Chat in group
export const groupchat = asyncHandler(async (req, res) => {

  const { message } = req.body;
  // console.log("GP Message : ", message);
  try {
    let groupChat = await GroupChat.findOne({ groupid: message.groupid });

    // const newMessage = { senderid, text, timestamp: new Date() };

    // console.log(groupChat, "Yanha Tak Sahi Hai Bro");
    if (!groupChat) {
      groupChat = await GroupChat.create({
        groupid: message.groupid,
        messages: [],
      });
    }
    groupChat.messages.push(message);
    await groupChat.save();


    // Emit message to all users in the group
    io.to(message.groupid).emit("receiveGroupMessage", message);

    return res.status(201).json(message);
  } catch (error) {
    console.log("error in sent message controller", error.message);
    return res.status(500).json({ error: "internal server error" });
  }
});

// Chat with friend in personal room
export const chats = asyncHandler(async (req, res) => {
  const { message } = req.body;
  try {
    let conversation = await Conversation.findOne({
      $or: [
        { receiverid: message.receiverid, senderid: message.senderid },
        { receiverid: message.senderid, senderid: message.receiverid },
      ],
    });

    // const newMessage = { senderid, text, timestamp: new Date() };

    if (!conversation) {
      conversation = await Conversation.create({
        senderid: message.senderid,
        receiverid: message.receiverid,
        messages: [],
      });
    }
    conversation.messages.push(message);
    await conversation.save();


    // Emit message to the receiver
    const receiverSocketId = getReceiverSocketId(message.receiverid);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveDirectMessage", message);
    }

    return res.status(201).json(message);
  } catch (error) {
    console.log("error in sent message controller", error.message);
    return res.status(500).json({ error: "internal server error" });
  }
});

// Retrieve group chat messages
export const gpmessages = asyncHandler(async (req, res) => {
  const { groupid } = req.body;
  try {
    const messages = await GroupChat.findOne({ groupid });
    return res.json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
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
    return res.json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
