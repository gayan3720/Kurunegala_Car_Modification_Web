import * as tf from "@tensorflow/tfjs";
import { loadImage, createCanvas } from "canvas";
import Vehicle from "../models/Vehicle.js";
import { loadModel } from "./modelCache.js";

const preprocessImage = async (filePath) => {
  // Load the image using node-canvas
  const img = await loadImage(filePath);

  // Create a canvas & draw the image at 224x224 (adjust to your model)
  const canvas = createCanvas(224, 224);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 224, 224);

  // Extract image data & convert to Tensor
  const imageData = ctx.getImageData(0, 0, 224, 224);
  const input = tf.browser.fromPixels(imageData, 3);

  // Normalize & add batch dimension
  const normalized = input.div(255.0);
  return normalized.expandDims(0);
};

export const recognizeVehicle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file received" });
    }

    // Load model from cache
    const model = await loadModel();

    // Preprocess
    const processed = await preprocessImage(req.file.path);

    // Predict
    const prediction = model.predict(processed); // or model.execute(processed)
    const predictionArray = await prediction.array();

    // Suppose your model outputs an array of probabilities
    // We'll pick the max index
    const maxIndex = predictionArray[0].indexOf(
      Math.max(...predictionArray[0])
    );

    // Example classes
    const classes = [
      "Suzuki Swift 2004",
      "Maruti Alto 800",
      "Toyota Corolla",
      "Suzuki Wagon R 2016",
    ];
    const recognizedModel = classes[maxIndex] || "Unknown Model";

    console.log("🔎 Predicted:", recognizedModel);

    // (Optional) Save to DB
    const newVehicle = await Vehicle.create({
      recognizedModel,
      labels: classes, // or something more advanced
      imagePath: req.file.path,
    });

    res.json({
      recognizedModel,
      labels: classes,
      vehicleId: newVehicle._id,
    });
  } catch (error) {
    console.error("❌ Error in recognizeVehicle:", error);
    res.status(500).json({ message: error.message });
  }
};
