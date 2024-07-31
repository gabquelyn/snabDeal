import { Router } from "express";
import { body } from "express-validator";
import {
  getTestimonials,
  createTestimonials,
} from "../controllers/testimonialControllers";
const testimonialRoutes = Router();
testimonialRoutes.route("/").get(getTestimonials);
testimonialRoutes
  .route("/:id")
  .post(
    [
      body("name").notEmpty(),
      body("testimonial").notEmpty(),
      body("email").isEmail(),
      body("feedback").notEmpty(),
    ],
    createTestimonials
  );

export default testimonialRoutes;
