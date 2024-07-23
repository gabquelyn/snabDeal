import { Router } from "express";
import { body } from "express-validator";
import {
  createBuyerIntent,
  confirmBuyerPaymentIntent,
  getBuyerIntent,
} from "../controllers/buyerIntentController";
import {
  createSellerIntent,
  getSellerIntent,
} from "../controllers/sellerIntentController";
const intentRoute = Router();
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
intentRoute.route("/buyer/:id").get(getBuyerIntent);
intentRoute.route("/buyer/confirm/:buyIntent").get(confirmBuyerPaymentIntent);

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
intentRoute.route("/seller/:id").get(getSellerIntent);

export default intentRoute;
