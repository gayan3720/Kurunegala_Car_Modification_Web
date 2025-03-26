import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  // The recognized model from your image recognition step
  recognizedModel: {
    type: String,
    default: "Unknown Model",
  },

  // All labels returned by the recognition API (e.g., Google Vision)
  labels: {
    type: [String],
    default: [],
  },

  // Path or URL to the uploaded image
  imagePath: {
    type: String,
    required: true,
  },

  // (Optional) Link to the user who uploaded the vehicle image
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // (Optional) Timestamp of when this record was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Vehicle", vehicleSchema);
