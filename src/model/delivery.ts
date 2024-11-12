import mongoose, { Schema } from "mongoose";
const deliverySchema = new mongoose.Schema(
  {
    store: String,
    platform: String,
    pickup: {
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

    dropOff: {
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

    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    items: [
      {
        type: String,
        required: true,
      },
    ],

    status: {
      required: true,
      default: "pending",
      type: String,
    },

    paid: {
      required: true,
      default: false,
      type: Boolean,
    },

    date: {
      required: true,
      type: Date,
    },

    time: {
      required: true,
      type: String,
    },

    note: {
      required: true,
      type: String,
    },

    image: {
      url: String,
      id: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Delivery", deliverySchema);
