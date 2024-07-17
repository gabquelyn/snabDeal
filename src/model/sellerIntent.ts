import mongoose, { Schema } from "mongoose";
const sellerIntentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      location: {
        type: String,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
    },
    pickup_time: {
      required: true,
      type: Date,
    },
    payment_method: {
      required: true,
      type: String,
    },
    buy_intent: {
      type: Schema.Types.ObjectId,
      ref: "BuyerIntent",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SellerIntent", sellerIntentSchema);
