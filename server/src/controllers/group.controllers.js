import asyncHandler from "express-async-handler";
import Group from "../models/group.models.js";

// Create Group
export const createGP = asyncHandler(async (req, res) => {
  const { gpname, createdBy, participants } = req.body;
  try {

    // Check Group Name Already exist or not
    const existingGp = await Group.findOne({ gpname: gpname });

    if (existingGp) {
      return res.status(400).json({ msg: "This groupname already exist. Try another!" });
    }

    // CRUD Table 
    const group = await Group.create({
      gpname,
      createdBy,
      participants,
    });

    // await group.save();  // Save data  
    res.json({
      msg: "Group created successfully",
      Status: "Success"
    });
  }
  catch {
    res.status(500).json({ error: 'Internal server error in creating groups' });
  }
});

// Retrive all groups
export const getGroups = asyncHandler(async (req, res) => {
  try {
    const groups = await Group.find();  // Retrieve all groups
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error in retriving groups' });
  }
});

// Updata group table
export const updateGP = asyncHandler(async (req, res) => {
  const {gpname , username , action} = req.body;

  try {
    let group = await Group.findOne({ gpname: gpname }); // Find Group 
    // Update participants based on action
    if (action === "JOIN") {
      group.participants.push(username); // Add username    
      // await group.save();
      res.json({ "msg": "Group Joined Successfully" });
    } else if (action === "EXIT") {
      // Remove username from participants if present
      const index = group.participants.indexOf(username);
      group.participants.splice(index, 1);
      // await group.save();
      res.json({ "msg": "Group Exit Successfully" });
    }
    else if (action === "DELETE") {   // Delete group 
      // Check if the user is the admin and if the user created the group
      const isadminPart = group.participants.filter((username) => username === group.createdBy);
      if (isadminPart && group.createdBy !== username) {
        return res.status(403).json({ "msg": "Not allowed to delete group" });
      }
      // Save the updated group  before update

      // Delete Group
      await Group.findOneAndDelete({ gpname: gpname });
      return res.json({ "msg": "Group Deleted Successfully" });
    } else {
      res.status(400).json({ "msg": "Invalid action" });
    }
    await group.save();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add and Remove Users from Group
export const AddRemoveUser = asyncHandler(async (req, res) => {
  const gpname = req.body.gpname;
  const action = req.body.action; // Add or Remove action field in request body
  const users = req.body.users;
  try {
    let group = await Group.findOne({ gpname: gpname }); // Find Group 

    if (action === "ADD") {
      // Add users to the group
      for (const user of users) {
        if (!group.participants.includes(user)) {
          group.participants.push(user);
        }
      }
      await group.save();
      res.json({ "msg": "Users Added Successfully" });
    } else if (action === "REMOVE") {
      // Remove users from the group
      for (const user of users) {
        const index = group.participants.indexOf(user);
        if (index !== -1) {
          group.participants.splice(index, 1);
        }
      }
      await group.save();
      res.json({ "msg": "Users Removed Successfully" });
    } else {
      res.status(400).json({ "msg": "Invalid action" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

