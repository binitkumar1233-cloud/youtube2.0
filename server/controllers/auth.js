import user from "../Modals/Auth.js";
import mongoose from "mongoose";

// In-memory fallback for development when MongoDB is unavailable
let devUsers = new Map();

export const login = async (req, res) => {
  const { email, name, image } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  
  try {
    try {
      const existinguser = await user.findOne({ email });
      if (!existinguser) {
        const newuser = await user.create({ email, name, image });
        res.status(200).json({ result: newuser });
      } else {
        res.status(200).json({ result: existinguser });
      }
    } catch (dbError) {
      // Fallback to in-memory storage when DB is unavailable
      console.warn("Using development mode (in-memory storage):", dbError.message);
      
      if (devUsers.has(email)) {
        res.status(200).json({ result: devUsers.get(email) });
      } else {
        const _id = new mongoose.Types.ObjectId().toString();
        const newUser = { _id, email, name, image, createdAt: new Date() };
        devUsers.set(email, newUser);
        res.status(200).json({ result: newUser });
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;
  
  if (!_id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  
  try {
    try {
      // Try MongoDB first
      if (mongoose.Types.ObjectId.isValid(_id)) {
        const updatedata = await user.findByIdAndUpdate(
          _id,
          {
            $set: {
              channelname: channelname,
              description: description,
            },
          },
          { new: true },
        );
        
        if (!updatedata) {
          return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json(updatedata);
      }
    } catch (dbError) {
      // Fallback when DB operation fails
      console.warn("Using development mode (in-memory storage):", dbError.message);
    }
    
    // Fallback to in-memory storage
    if (devUsers.has(_id)) {
      const updated = { ...devUsers.get(_id), channelname, description, updatedAt: new Date() };
      devUsers.set(_id, updated);
      return res.status(200).json(updated);
    } else {
      const newUser = { _id, channelname, description, email: _id, createdAt: new Date() };
      devUsers.set(_id, newUser);
      return res.status(200).json(newUser);
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
