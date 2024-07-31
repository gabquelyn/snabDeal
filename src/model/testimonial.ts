import mongoose, { Schema } from "mongoose";
const testimonialSchema = new mongoose.Schema(
  {
    pickup: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Pickup",
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    testimonial: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Testimonial", testimonialSchema);
