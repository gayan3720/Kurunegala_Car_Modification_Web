import express from "express";
import {
  deleteUser,
  getUsers,
  updateUserRole,
} from "../controllers/userController.js";

const router = express.Router();

// Route to fetch all users
router.get("/", getUsers);

// Route to update a user's role
router.put("/:id", updateUserRole);

// Route to delete a user
router.delete("/delete/:id", deleteUser);

export default router;
