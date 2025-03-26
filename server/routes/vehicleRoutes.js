import express from "express";
import { recognizeVehicle } from "../controllers/vehicleController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/recognize", upload.single("vehicleImage"), recognizeVehicle);

export default router;
