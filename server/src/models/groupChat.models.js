import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema({
  groupid: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
    required: true,
  }
});

const GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat;

