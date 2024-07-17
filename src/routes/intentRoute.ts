import { Router } from "express";
import { body } from "express-validator";
import { createBuyerIntent } from "../controllers/buyerIntentController";
import { createSellerIntent } from "../controllers/sellerIntentController";
const intentRoute = Router();

/**
 * @swagger
 * /intent/buyer:
 *   post:
 *     summary: Create a buyer entry.
 *     description: Create an intent from the buyer.
 *     parameters:
 *         schema:
 *           type: string
 *         required: true
 *         description: Employee ID
 *     responses:
 *       '200':
 *         description: Successfully created buyer's intent and link sent
 *       '500':
 *         description: Internal server error missing required parameters
 */
intentRoute
  .route("/buyer")
  .post(
    [
      body("email").isEmail(),
      body("name").notEmpty(),
      body("location").notEmpty(),
      body("lng").notEmpty().isNumeric(),
      body("lat").notEmpty().isNumeric(),
      body("link").notEmpty().isURL(),
      body("price").notEmpty().isNumeric(),
      body("phone").notEmpty().isMobilePhone("any"),
    ],
    createBuyerIntent
  );

intentRoute
  .route("/seller")
  .post(
    [
      body("email").isEmail(),
      body("name").notEmpty(),
      body("phone").notEmpty().isMobilePhone("any"),
      body("lng").notEmpty().isNumeric(),
      body("lat").notEmpty().isNumeric(),
      body("location").notEmpty(),
      body("pickup_time").isDate(),
      body("payment_method").notEmpty(),
      body("buy_intent").notEmpty(),
    ],
    createSellerIntent
  );

export default intentRoute;
