import User from "../models/User.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const updateUserRole = async (req, res) => {
  console.log(req.params.id);

  try {
    const { role } = req.body;
    if (![1, 2, 3].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const id = new ObjectId(req.params.id);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ result: 1, data: null, message: "User not found." });
    }
    res.status(200).json({
      result: 1,
      data: updatedUser,
      message: "User updated successfully.",
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res
      .status(500)
      .json({ result: 1, data: null, message: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  console.log(req.params.id);

  try {
    const id = new ObjectId(req.params.id);
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
};
