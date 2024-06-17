import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  senderid: {
    type: String,
    required: true,
  },
  receiverid: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
  }
})

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;