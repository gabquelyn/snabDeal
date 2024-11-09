import { Router } from "express";
import { createSale, getASale, getSales } from "../controllers/saleController";
import { body } from "express-validator";
const saleRoutes = Router();
saleRoutes
  .route("/")
  .post(
    [
      body("name").notEmpty().withMessage("Sale name is required"),
      body("type").notEmpty().withMessage("Sale type is required"),
      body("paymentMethod")
        .notEmpty()
        .withMessage("Payment method is required"),
      body("phone").isMobilePhone("any").withMessage("Invalid buyer number"),
      body("date").isDate().withMessage("Enter a valid date"),
      body("time")
        .isTime({ mode: "default" })
        .withMessage("Enter a valid time"),
      body("address.location")
        .notEmpty()
        .withMessage("Address location required"),
      body("address.lat")
        .notEmpty()
        .isNumeric()
        .withMessage("Address lat required"),
      body("address.lng")
        .notEmpty()
        .isNumeric()
        .withMessage("Address lng required"),
      body("posterImage").notEmpty().isBase64().withMessage("invalid image string"),
      body("items").isArray().withMessage("Items cannot be empty"),
    ],
    createSale
  )
  .get(getSales);
saleRoutes.route("/:id").get(getASale);

export default saleRoutes;
