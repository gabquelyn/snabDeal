import mongoose, { Schema } from "mongoose";
const pickupSchema = new mongoose.Schema(
  {
    sellIntent: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "SellerIntent",
      unique: true,
    },
    buyIntent: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "BuyerIntent",
      unique: true,
    },
    distance: {
      required: true,
      type: String,
    },
    status: {
      required: true,
      default: "Acknowledged",
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pickup", pickupSchema);
