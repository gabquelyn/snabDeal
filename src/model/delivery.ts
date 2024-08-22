import mongoose, { Schema } from "mongoose";
const deliverySchema = new mongoose.Schema(
  {
    // the buyers details
    buyer: {
      name: {
        type: String,
        required: true,
      },
      email: {
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
      comment: {
        type: String,
        required: false,
      },
    },

    // the seller details
    seller: {
      date: {
        type: Date,
        required: true,
      },
      time: {
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
      paymentMethod: {
        type: String,
        required: false,
      },
    },

    // items details
    item: {
      note: {
        type: String,
        required: false,
      },
      price: {
        type: Number,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },

    // the delivery details
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
