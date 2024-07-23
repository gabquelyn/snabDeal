import mongoose, { Schema } from "mongoose";
const partnerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    item_type: {
      type: String,
      required: true,
    },
    business: {
      type: String,
      required: true,
    },
    platforms: [{ type: String, required: true }],
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
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
      },
    },
    documnent: [
      {
        url: String,
        id: String,
      },
    ],
    payment_method: {
      required: true,
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Partner", partnerSchema);
