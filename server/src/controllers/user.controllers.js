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

// Retrive all friends & Group
export const getFriendlist = asyncHandler(async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user?.friendlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrive User Id
export const GetUserId = asyncHandler(async (req, res) => {
  const { username } = req.query;
  try {
    // console.log(username);
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User Not Found" });
    }
    // console.log(user);
    return res.status(200).json(user._id);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
})


// Add & Remove Friend from friendlist
export const AddRemoveFriend = asyncHandler(async (req, res) => {
  const { username, friend, action } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (action === "ADD") {
      if (!user.friendlist.includes(friend)) {
        user.friendlist.push(friend);
        await user.save();
        return res.json({ msg: "Now you are friends" });
      } else {
        return res.json({ msg: "You are already friends" });
      }
    } else if (action === "REMOVE") {
      const index = user.friendlist.indexOf(friend);
      if (index !== -1) {
        user.friendlist.splice(index, 1);
        await user.save();
        return res.json({ msg: "Unfriended successfully" });
      } else {
        return res.json({ msg: "You are not friends" });
      }
    } else {
      return res.json({ msg: "Invalid action" });
    }
  } catch (error) {
    console.error("Error in AddRemoveFriend API:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});









