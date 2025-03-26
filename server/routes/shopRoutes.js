import express from "express";
import {
  createShop,
  updateShop,
  getNearbyShops, // new
} from "../controllers/shopController.js";

const router = express.Router();

// // GET shops for current user
// router.get("/", getShopsByUser);

// GET nearby shops (with geoNear)
router.get("/nearby", getNearbyShops);

// CREATE shop
router.post("/", createShop);

// UPDATE shop
router.patch("/:id", updateShop);

// // DELETE shop
// router.delete("/:id", deleteShop);

export default router;
