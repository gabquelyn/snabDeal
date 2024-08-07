import { Router } from "express";
import { body } from "express-validator";
import {
  createBuyerIntent,
  confirmBuyerPaymentIntent,
  getBuyerIntent,
  getUnscheduledPickups,
  patchBuyerIntentController,
  getSellIntentForBuyer,
} from "../controllers/buyerIntentController";
import {
  createSellerIntent,
  getSellerIntent,
  patchSellerIntentController,
} from "../controllers/sellerIntentController";
const intentRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Intents
 *     description: Operations about buyer and seller intents
 */

/**
 * @swagger
 * /intent/buyer:
 *   post:
 *     summary: Create a new buyer intent.
 *     tags:
 *       - Intents
 *     description: Create a new buyer intent with the provided information.
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
 *       501:
 *         description: Internal server error
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

/**
 * @swagger
 * /intent/buyer/{id}:
 *   get:
 *     summary: Get the details of a buyer intent.
 *     tags:
 *       - Intents
 *     description: Returns the information of a buyer's intent.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the buyer's intent which details are to be retrieved.
 *     responses:
 *       200:
 *         description: Successful response with buyer's intent details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the buyer intent.
 *                 name:
 *                   type: string
 *                   description: The name of the buyer.
 *                 email:
 *                   type: string
 *                   description: The email of the buyer.
 *                 message:
 *                   type: string
 *                   description: The message of the buyer to the seller.
 *                 phone:
 *                   type: string
 *                   description: The phone number of the buyer.
 *                 address:
 *                   type: object
 *                   description: Location details of the buyer.
 *                   properties:
 *                     location:
 *                       type: string
 *                       description: The Address location of the buyer.
 *                     lng:
 *                       type: number
 *                       format: float
 *                       description: The longitude of the buyer location.
 *                     lat:
 *                       type: number
 *                       format: float
 *                       description: The latitude of the buyer location.
 *                 item:
 *                   type: object
 *                   description: Location details of the buyer.
 *                   properties:
 *                     tag:
 *                       type: string
 *                       description: The name of the item purchasd.
 *                     link:
 *                       type: string
 *                       description: A link to the purchased item.
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: The price of the purchased item.
 *                 acknowledged:
 *                   type: boolean
 *                   description: The state of the intent
 *       400:
 *         description: Bad request, invalid parameters.
 *       404:
 *         description: Buyer intent not found.
 *       500:
 *         description: Internal sever error
 */

/**
 * @swagger
 * /intent/buyer/{id}:
 *   patch:
 *     summary: Edit the details of a buyer intent.
 *     tags:
 *       - Intents
 *     description: Edit the information of a buyer's intent.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the buyer's intent which details are to be edited
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
 *               phone:
 *                 type: string
 *                 description: The buyer's phone number.
 *                 example: +34 434343 4343 4343 4
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
 *     responses:
 *       404:
 *         description: Buyer intent not found
 *       200:
 *         description: Buyer's intent edited successfully
 *       501:
 *         description: Internal server error
 */

/**
 * @swagger
 * /intent/buyer/unscheduled:
 *   get:
 *     summary: Get the details of a unscheduled pickups.
 *     tags:
 *       - Intents
 *     description: Returns unscheduled intent.
 *     parameters:
 *     responses:
 *       200:
 *         description: Successful response with buyer's intent details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: A list of all the unscheduled.
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The partner's name.
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: The partner's email.
 *                     example: john.doe@example.com
 *                   phone:
 *                     type: string
 *                     description: The partner's phone number.
 *                     example: +34 434343 4343 4343 4
 */

intentRoute.route("/buyer/unscheduled").get(getUnscheduledPickups);
intentRoute
  .route("/buyer/:id")
  .get(getBuyerIntent)
  .patch(patchBuyerIntentController);

/**
 * @swagger
 * /intent/buyer/confirm/{buyIntent}:
 *   get:
 *     summary: Get the details of a buyer intent.
 *     tags:
 *       - Intents
 *     description: Returns the information of a buyer's intent.
 *     parameters:
 *       - in: path
 *         name: buyIntent
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the buyer's intent.
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: The id of a partner.
 *     responses:
 *       200:
 *         description: Successful response with buyer's intent details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                trackingId:
 *                   type: string
 *                   description: The tracking id to monitor the pickup
 *       400:
 *         description: Bad request, buyer didn't complete payment or invalid partner in query.
 *       402:
 *         description: Payment not completed.
 *       404:
 *         description: Buyer intent not found.
 *       500:
 *         description: Internal sever error
 *       501:
 *         description: Pickup already scheduled.
 */
intentRoute.route("/buyer/confirm/:buyIntent").get(confirmBuyerPaymentIntent);

/**
 * @swagger
 * /intent/seller:
 *   post:
 *     summary: Create a new seller intent as, a response to a buyer intent.
 *     tags:
 *       - Intents
 *     description: Create a new seller intent with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The seller's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The seller's email.
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 description: The seller's phone number.
 *                 example: +34 434343 4343 4343 4
 *               location:
 *                 type: string
 *                 description: The address of the seller.
 *                 example: some place on earth
 *               lng:
 *                 type: number
 *                 description: The longitude of the seller's location.
 *                 example: 20.0001
 *               lat:
 *                 type: number
 *                 description: The latitude of the seller's location.
 *                 example: 19.0002
 *               pickup_time:
 *                 type: string
 *                 format: date
 *                 description: The time scheduled for pickup.
 *                 example:
 *               payment_method:
 *                 type: string
 *                 description: The preffered payment method of the seller.
 *                 example: Cashapp
 *               buy_intent:
 *                 type: string
 *                 description: The id of a buyer intent the seller is responding to.
 *                 example: 669fb73978366f305b4b515b
 *     responses:
 *       404:
 *         description: Buyer's intent not found
 *       400:
 *         description: Bad request.
 *       201:
 *         description: Seller's intent has been created successfully
 *       501:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /intent/seller/{id}:
 *   get:
 *     summary: Get the details of a seller intent.
 *     tags:
 *       - Intents
 *     description: Returns the information of a seller's intent.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller's intent which details are to be retrieved.
 *     responses:
 *       200:
 *         description: Successful response with seller's intent details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the seller intent.
 *                 name:
 *                   type: string
 *                   description: The name of the seller.
 *                 email:
 *                   type: string
 *                   description: The email of the seller.
 *                 phone:
 *                   type: string
 *                   description: The phone number of the seller.
 *                 address:
 *                   type: object
 *                   description: Location details of the seller.
 *                   properties:
 *                     location:
 *                       type: string
 *                       description: The Address location of the seller.
 *                     lng:
 *                       type: number
 *                       format: float
 *                       description: The longitude of the seller location.
 *                     lat:
 *                       type: number
 *                       format: float
 *                       description: The latitude of the seller location.
 *                 pickup_time:
 *                   type: string
 *                   format: date
 *                   description: The date scheduled for the pickup.
 *                 payment_method:
 *                   type: string
 *                   description: The payment preffered by the seller.
 *                 buyIntent:
 *                   type: string
 *                   description: The Id of the buyer's intent that the seller responded to.
 *       404:
 *         description: Seller intent not found.
 *       500:
 *         description: Internal sever error
 */
/**
 * @swagger
 * /intent/seller/{id}:
 *   patch:
 *     summary: Edit the details of a seller intent.
 *     tags:
 *       - Intents
 *     description: Edit the information of a seller's intent.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the seller's intent which details are to be edited
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The seller's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The seller's email.
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 description: The seller's phone number.
 *                 example: +34 434343 4343 4343 4
 *               location:
 *                 type: string
 *                 description: The address of the seller.
 *                 example: some place on earth
 *               lng:
 *                 type: number
 *                 description: The longitude of the seller's location.
 *                 example: 20.0001
 *               lat:
 *                 type: number
 *                 description: The latitude of the seller's location.
 *                 example: 19.0002
 *     responses:
 *       404:
 *         description: Seller intent not found
 *       200:
 *         description: Seller's intent edited successfully
 *       501:
 *         description: Internal server error
 */
intentRoute
  .route("/seller/:id")
  .get(getSellerIntent)
  .patch(patchSellerIntentController);




/**
 * @swagger
 * /intent/seller/buyer/{id}:
 *   get:
 *     summary: Get the details of a seller intent using the buyer's Id.
 *     tags:
 *       - Intents
 *     description: Edit the information of a seller's intent.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the buyer's intent which details are to be edited
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The seller's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The seller's email.
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 description: The seller's phone number.
 *                 example: +34 434343 4343 4343 4
 *               location:
 *                 type: string
 *                 description: The address of the seller.
 *                 example: some place on earth
 *               lng:
 *                 type: number
 *                 description: The longitude of the seller's location.
 *                 example: 20.0001
 *               lat:
 *                 type: number
 *                 description: The latitude of the seller's location.
 *                 example: 19.0002
 *     responses:
 *       404:
 *         description: Seller intent not found
 *       200:
 *         description: Seller's intent edited successfully
 *       501:
 *         description: Internal server error
 */
intentRoute.route("/seller/buyer/:id").get(getSellIntentForBuyer);
export default intentRoute;
