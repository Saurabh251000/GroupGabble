import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  gpname: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
  },
  participants: {
    type: [String],
  },
})

const Group = mongoose.model("Group", groupSchema);
export default Group;