import mongoose from "mongoose";
const salesDelivery = new mongoose.Schema({
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sales",
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
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  time: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    required: true,
    default: "pending",
    type: String,
  },
  paid: {
    required: true,
    type: Boolean,
    default: false,
  },
  image: {
    url: String,
    id: String,
  },
});

export default mongoose.model("SalesDelivery", salesDelivery);
