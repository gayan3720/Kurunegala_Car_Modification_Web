import express from "express";
import {
  createPart,
  getPartsByShopOwner,
  updatePart,
  deletePart,
} from "../controllers/partController.js";

const router = express.Router();

// GET parts (and shops) for the current user
router.get("/", getPartsByShopOwner);

// CREATE part
router.post("/", createPart);

// UPDATE part
router.patch("/:id", updatePart);

// DELETE part
router.delete("/:id", deletePart);

export default router;
