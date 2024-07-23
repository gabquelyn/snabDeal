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

/**
 * @swagger
 * /intent/buyer:
 *   post:
 *     summary: Create a new buyer intent.
 *     description: Create a new buyer intent with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *                 email
 *                 phone
 *                 message
 *                 location
 *                 lng
 *                 lat
 *                 price
 *                 tag
 *             properties:
 *               name:
 *                 type: string
 *                 description: The buyer's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The buyer's email.
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 description: The buyer's phone number.
 *                 example: +34 434343 4343 4343 4
 *               message:
 *                 type: string
 *                 description: The buyer's message to a seller.
 *                 example: some message
 *               location:
 *                 type: string
 *                 description: The address of the buyer.
 *                 example: some place on earth
 *               lng:
 *                 type: number
 *                 description: The longitude of the buyer's location.
 *                 example: 20.0001
 *               lat:
 *                 type: number
 *                 description: The latitude of the buyer's location.
 *                 example: 19.0002
 *               price:
 *                 type: number
 *                 description: The cost of the item to be purchased in USD.
 *                 example: 19
 *               tag:
 *                 type: string
 *                 description: The item tag name.
 *                 example: Male Jewellry
 *               link:
 *                 type: string
 *                 description: The link to the item to be bought.
 *                 example: https//link/.somewhere
 *               partnerId:
 *                 type: string
 *                 description: The id of a partner in the link.
 *                 example: 669fb73978366f305b4b515b
 *                 nullable: true
 *     responses:
 *       404:
 *         description: Partner not found
 *       400:
 *         description: Partner not verified yet
 *       201:
 *         description: Buyer's intent created successfully
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
