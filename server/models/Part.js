import mongoose from "mongoose";

const partSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brandName: { type: String, required: true },
    // We'll store reference to the shop by ID
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    quantity: { type: Number, default: 0 },
    mfd: { type: String }, // or Date
    createdBy: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Part", partSchema);
