import mongoose, { Schema } from "mongoose";
const buyerIntentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    message: String,
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
    item: {
      tag: { type: String, required: true },
      link: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BuyerIntent", buyerIntentSchema);
