import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import partRoutes from "./routes/partRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// For ES modules:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve "uploads" folder statically if you want to access images via URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/model",
  express.static(path.join(__dirname, "controllers", "car_model"))
);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB Connected.!"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/parts", partRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Car Modification API Running.!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}.!`));
