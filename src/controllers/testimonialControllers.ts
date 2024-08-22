import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Testimonial from "../model/testimonial";
import Delivery from "../model/delivery";

export const getTestimonials = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const testimonials = await Testimonial.find({}).lean().exec();
    return res.status(200).json([...testimonials]);
  }
);

export const createTestimonials = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const result = validationResult(req.body);
    if (!result.isEmpty()) return res.status(500).json(result.array());
    const { name, testimonial, email, feedback } = req.body;
    const { deliveryId } = req.params;
    const existingDelivery = await Delivery.findById(deliveryId).lean().exec();
    if (!existingDelivery)
      return res.status(404).json({ message: "Delivery not found" });
    await Testimonial.create({
      name,
      testimonial,
      email,
      feedback,
    });
    return res.status(200).json({ message: "Submitted review" });
  }
);
