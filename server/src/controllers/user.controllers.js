import asyncHandler from "express-async-handler";
import User from "../models/user.models.js";


// Retrive all users 
export const getUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add & Remove Friend from friendlist
export const AddRemovefriend = asyncHandler(async (req, res) => {
  const { username, friend, action } = req.body;
  try {
    const user = User.findOne(username);
    if (action === "ADD") {
      user.friendlist.push(friend);
      return res.json({ msg: "Now you are friend" });
    }
    else if (action === "REMOVE") {
      const index = user.friendlist.indexOf(friend);
      user.friendlist.splice(index, 1);
      // await group.save();
      res.json({ msg: "Unfriend Successfully" });
    }
    else {
      res.json({ msg: "Invalid action" });
    }

  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
})









