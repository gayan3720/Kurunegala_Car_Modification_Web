import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    shopCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true, // Enforce unique shop name
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brands: [
      {
        type: String,
      },
    ],
    // Geospatial location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    createdBy: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index for location
shopSchema.index({ location: "2dsphere" });

export default mongoose.model("Shop", shopSchema);
