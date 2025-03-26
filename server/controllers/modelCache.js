import * as tf from "@tensorflow/tfjs";
import path from "path";
import { fileURLToPath } from "url";

let model = null; // Cached model

export const loadModel = async () => {
  if (model) return model;

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const modelAbsolutePath = "http://localhost:5000/model/model.json";

    // If it's a Graph Model, do loadGraphModel
    // If it's a Layers Model, do loadLayersModel
    model = await tf.loadLayersModel(modelAbsolutePath);
    console.log("✅ Model loaded successfully (pure JS).");
    return model;
  } catch (err) {
    console.error("❌ Error loading model:", err);
    throw err;
  }
};
