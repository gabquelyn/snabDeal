import { Router } from "express";
import { body } from "express-validator";
import {
  getTestimonials,
  createTestimonials,
} from "../controllers/testimonialControllers";
const testimonialRoutes = Router();

/**
 * @swagger
 * /testimonial:
 *   get:
 *     summary: Get all the testimonials.
 *     description: Returns all the testimonials in the database.
 *     parameters:
 *        required: false
 *     responses:
 *       500:
 *         description: Internal server error
 *       200:
 *         description: Successful response with all testimonials.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: A list of all the testmonials.
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The Id of the pickup
 *                   pickup:
 *                     type: string
 *                     description: The Id of the pickup responded to
 *                   testimonial:
 *                     type: string
 *                     description: The testimonial of the review
 *                   feedback:
 *                     type: string
 *                     description: The feedback of the testimonial
 *                   name:
 *                     type: string
 *                     description: The name of the testimonial
 *                   email:
 *                     type: string
 *                     description: The email of the responder to the testimonial
 *
 */
testimonialRoutes.route("/").get(getTestimonials);

/**
 * @swagger
 * /testimonial/{pickupId}:
 *   post:
 *     summary: Create a new testimonial for a pickup.
 *     description: Create a new buyer intent with the provided information.
 *     parameters:
 *       - in: path
 *         name: pickupId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The buyer's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The buyer's email.
 *                 example: john.doe@example.com
 *               feedback:
 *                 type: string
 *                 description: The buyer's feedback.
 *                 example: All is good.
 *               testimonial:
 *                 type: string
 *                 description: The buyer's testimonial.
 *                 example: some message
 *     responses:
 *       404:
 *         description: Pickup not found.
 *       200:
 *         description: Review submitted successfully
 */
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
