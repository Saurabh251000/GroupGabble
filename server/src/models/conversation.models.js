import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  senderid: {
    type: String,
    required: true,
  },
  receiverid: {
    type: String,
  },
  message: {
    type: Array,
  }
})

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;