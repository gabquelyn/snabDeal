import mongoose, { Schema } from "mongoose";
const pickupSchema = new mongoose.Schema(
  {
    // either a sell intent or the partenr's id.
    sellIntent: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "SellerIntent",
      unique: true,
    },
    partnerId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Partner",
    },
    buyIntent: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "BuyerIntent",
      unique: true,
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
