import mongoose from "mongoose";
const stripeSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Delivery",
    unique: true,
  },
});

export default mongoose.model("Session", stripeSessionSchema);
