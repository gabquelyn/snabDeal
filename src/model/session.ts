import mongoose from "mongoose";
const stripeSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  buyerIntent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "BuyerIntent",
    unique: true,
  },
});

export default mongoose.model("Session", stripeSessionSchema);
