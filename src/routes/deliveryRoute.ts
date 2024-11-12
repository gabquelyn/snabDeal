import { Router } from "express";
import {
  createSaleDelivery,
  createDelivery,
  confirmDelivery,
  getIndividualDelivery,
  getAllDeliveries,
  editDelivery,
  changeStatus,
  getAllSaleDeliveries,
  getIndividualSaleDelivery,
} from "../controllers/deliveryController";
import { body } from "express-validator";
import Multer from "multer";
const upload = Multer({ dest: "/tmp" });

const deliveryRoutes = Router();

/**
 * @swagger
 * /delivery:
 *   post:
 *     summary: Creates a new delivery.
 *     tags:
 *       - Delivery
 *     description: Creates a new delivery with the provided buyer information, pickup, dropOff, and item details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The buyer's name/ store name / platform name.
 *                 example: John Doe
 *               date:
 *                 type: string
 *                 description: The date of the dropOff.
 *                 example: 12-08-2024
 *               time:
 *                 type: string
 *                 description: The date of the dropOff.
 *                 example: 12:08
 *               phone:
 *                 type: string
 *                 description: The buyer's phone number.
 *                 example: "+1234567890"
 *               pickup:
 *                 type: object
 *                 description: Pickup location details.
 *                 required:
 *                   - location
 *                   - lng
 *                   - lat
 *                 properties:
 *                   location:
 *                     type: string
 *                     description: The pickup address location.
 *                     example: "123 Main St, Springfield"
 *                   lng:
 *                     type: number
 *                     description: The longitude of the pickup location.
 *                     example: -123.12345
 *                   lat:
 *                     type: number
 *                     description: The latitude of the pickup location.
 *                     example: 45.67890
 *               dropOff:
 *                 type: object
 *                 description: Drop-off location details.
 *                 required:
 *                   - location
 *                   - lng
 *                   - lat
 *                 properties:
 *                   location:
 *                     type: string
 *                     description: The drop-off address location.
 *                     example: "456 Elm St, Springfield"
 *                   lng:
 *                     type: number
 *                     description: The longitude of the drop-off location.
 *                     example: -123.54321
 *                   lat:
 *                     type: number
 *                     description: The latitude of the drop-off location.
 *                     example: 45.12345
 *               note:
 *                 type: string
 *                 description: Additional comments from the buyer.
 *                 example: "Please deliver between 3-5 PM."
 *               items:
 *                 type: array
 *                 description: List of item names to be delivered.
 *                 items:
 *                   type: string
 *                   example: spoon
 *     responses:
 *       201:
 *         description: Successfully created a delivery and generated a checkout link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Checkout URL for payment.
 *                   example: http://payment_link
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /delivery:
 *   get:
 *     summary: Retrieves all deliveries.
 *     tags:
 *       - Delivery
 *     description: Returns an array of all deliveries, each containing details like buyer information, pickup and drop-off locations, and items.
 *     responses:
 *       200:
 *         description: A list of all deliveries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the delivery.
 *                     example: 5f8d0d55b54764421b7156f1
 *                   buyer:
 *                     type: object
 *                     description: Details about the buyer.
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The buyer's name.
 *                         example: John Doe
 *                       phone:
 *                         type: string
 *                         description: The buyer's phone number.
 *                         example: "+1234567890"
 *                   pickup:
 *                     type: object
 *                     description: Pickup location details.
 *                     properties:
 *                       location:
 *                         type: string
 *                         description: The pickup address location.
 *                         example: "123 Main St, Springfield"
 *                       lng:
 *                         type: number
 *                         description: Longitude of the pickup location.
 *                         example: -123.12345
 *                       lat:
 *                         type: number
 *                         description: Latitude of the pickup location.
 *                         example: 45.67890
 *                   dropOff:
 *                     type: object
 *                     description: Drop-off location details.
 *                     properties:
 *                       location:
 *                         type: string
 *                         description: The drop-off address location.
 *                         example: "456 Elm St, Springfield"
 *                       lng:
 *                         type: number
 *                         description: Longitude of the drop-off location.
 *                         example: -123.54321
 *                       lat:
 *                         type: number
 *                         description: Latitude of the drop-off location.
 *                         example: 45.12345
 *                   note:
 *                     type: string
 *                     description: Additional comments from the buyer.
 *                     example: "Please deliver between 3-5 PM."
 *                   items:
 *                     type: array
 *                     description: List of item names to be delivered.
 *                     items:
 *                       type: string
 *                       example: spoon
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /delivery/{saleId}:
 *   post:
 *     summary: Creates a new delivery for a garage or house sale.
 *     tags:
 *       - Delivery
 *     description: Creates a delivery record for a garage or home sale and generates a payment link for checkout.
 *     parameters:
 *       - in: path
 *         name: saleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the sale
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the buyer.
 *                 example: Xoxo
 *               phone:
 *                 type: string
 *                 description: Phone number of the buyer.
 *                 example: +2349039099172
 *               time:
 *                 type: string
 *                 description: Time of the delivery.
 *                 example: 12:45
 *               address:
 *                 type: object
 *                 properties:
 *                   location:
 *                     type: string
 *                     description: The location of the delivery.
 *                     example: Texas
 *                   lat:
 *                     type: number
 *                     description: The latitude of the delivery location.
 *                     example: -23.0
 *                   lng:
 *                     type: number
 *                     description: The longitude of the delivery location.
 *                     example: -24.0
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                       description: The identifier of the item to be delivered.
 *                       example: 672fe7d09241c7ca4a522867
 *                     quantity:
 *                       type: number
 *                       description: The quantity of the item to be delivered.
 *                       example: 2
 *     responses:
 *       201:
 *         description: Successfully created a delivery and generated a checkout link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: Checkout URL for payment.
 *                   example: http://payment_link
 *       404:
 *         description: Sale not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /delivery/sales:
 *   get:
 *     summary: Retrieves a list of all sale deliveries.
 *     tags:
 *       - Delivery
 *     description: Returns an array of all sale deliveries, with each delivery containing details such as buyer information, delivery time, address, and items.
 *     responses:
 *       200:
 *         description: A list of all sale deliveries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier of the sale.
 *                     example: 5f8d0d55b54764421b7156f1
 *                   name:
 *                     type: string
 *                     description: Name of the buyer.
 *                     example: Xoxo
 *                   phone:
 *                     type: string
 *                     description: Phone number of the buyer.
 *                     example: +2349039099172
 *                   time:
 *                     type: string
 *                     description: Time of the delivery.
 *                     example: 12:45
 *                   address:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         description: The location of the delivery.
 *                         example: Texas
 *                       lat:
 *                         type: number
 *                         description: The latitude of the delivery location.
 *                         example: -23.0
 *                       lng:
 *                         type: number
 *                         description: The longitude of the delivery location.
 *                         example: -24.0
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         itemId:
 *                           type: string
 *                           description: The identifier of the item to be delivered.
 *                           example: 672fe7d09241c7ca4a522867
 *                         quantity:
 *                           type: number
 *                           description: The quantity of the item to be delivered.
 *                           example: 2
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /delivery/sales/{deliveryId}:
 *   get:
 *     summary: Retrieves a sale delivery by its ID.
 *     tags:
 *       - Delivery
 *     description: Returns the details of a specific sale delivery by its ID.
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the delivery
 *     responses:
 *       200:
 *         description: A sale delivery object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the sale.
 *                   example: 5f8d0d55b54764421b7156f1
 *                 name:
 *                   type: string
 *                   description: Name of the buyer.
 *                   example: Xoxo
 *                 phone:
 *                   type: string
 *                   description: Phone number of the buyer.
 *                   example: +2349039099172
 *                 time:
 *                   type: string
 *                   description: Time of the delivery.
 *                   example: 12:45
 *                 address:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: string
 *                       description: The location of the delivery.
 *                       example: Texas
 *                     lat:
 *                       type: number
 *                       description: The latitude of the delivery location.
 *                       example: -23.0
 *                     lng:
 *                       type: number
 *                       description: The longitude of the delivery location.
 *                       example: -24.0
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemId:
 *                         type: string
 *                         description: The identifier of the item to be delivered.
 *                         example: 672fe7d09241c7ca4a522867
 *                       quantity:
 *                         type: number
 *                         description: The quantity of the item to be delivered.
 *                         example: 2
 *       404:
 *         description: Delivery not found.
 *       500:
 *         description: Internal server error.
 */

deliveryRoutes.route("/sales").get(getAllSaleDeliveries);
deliveryRoutes
  .route("/sales/:deliveryId")
  .get(getIndividualSaleDelivery)
  .patch();

deliveryRoutes
  .route("/:saleId")
  .post(
    [
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
      body("items").isArray().withMessage("Items cannot be empty"),
      body("phone").isMobilePhone("any").withMessage("Invalid buyer number"),
      body("name").notEmpty().withMessage("Sale name is required"),
    ],
    createSaleDelivery
  );

/**
 * @swagger
 * /delivery/confirm/{id}:
 *   patch:
 *     summary: Confirms delivery details.
 *     tags:
 *       - Delivery
 *     description: Confirms details of a specific delivery by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the delivery.
 *         example: "64c71b8f8e4eabc123456789"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of deliveries.
 *       400:
 *         description: Delivery session not foun.
 *       404:
 *         description: Delivery with the specified ID not found.
 *       502:
 *         description: Delivery has already been paid for.
 */

deliveryRoutes.route("/confirm/:deliveryId").get(confirmDelivery);
/**
 * @swagger
 * /delivery/status/{id}:
 *   patch:
 *     summary: Updates the delivery status and uploads a proof file.
 *     tags:
 *       - Delivery
 *     description: Updates the status of a specific delivery and allows for uploading a proof file.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the delivery.
 *         example: "64c71b8f8e4eabc123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               proof:
 *                 type: string
 *                 format: binary
 *                 description: The file containing proof of delivery.
 *                 example: file.pdf
 *               status:
 *                 type: string
 *                 description: The new status of the delivery.
 *                 enum:
 *                   - onroute
 *                   - delivered
 *                 example: "delivered"
 *     responses:
 *       200:
 *         description: Successfully updated the delivery.
 *       400:
 *         description: Bad request, possibly due to invalid file format or missing parameters.
 *       404:
 *         description: Delivery not found.
 *       500:
 *         description: Internal server error.
 */

deliveryRoutes
  .route("/status/:deliveryId")
  .patch(upload.single("proof"), changeStatus);

/**
 * @swagger
 * /delivery/{deliveryId}:
 *   get:
 *     summary: Retrieves a specific delivery by its ID.
 *     tags:
 *       - Delivery
 *     description: Returns details of a specific delivery based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the delivery
 *     responses:
 *       200:
 *         description: A delivery object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique identifier for the delivery.
 *                   example: 5f8d0d55b54764421b7156f1
 *                 buyer:
 *                   type: object
 *                   description: Details about the buyer.
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The buyer's name.
 *                       example: John Doe
 *                     phone:
 *                       type: string
 *                       description: The buyer's phone number.
 *                       example: "+1234567890"
 *                 pickup:
 *                   type: object
 *                   description: Pickup location details.
 *                   properties:
 *                     location:
 *                       type: string
 *                       description: The pickup address location.
 *                       example: "123 Main St, Springfield"
 *                     lng:
 *                       type: number
 *                       description: Longitude of the pickup location.
 *                       example: -123.12345
 *                     lat:
 *                       type: number
 *                       description: Latitude of the pickup location.
 *                       example: 45.67890
 *                 dropOff:
 *                   type: object
 *                   description: Drop-off location details.
 *                   properties:
 *                     location:
 *                       type: string
 *                       description: The drop-off address location.
 *                       example: "456 Elm St, Springfield"
 *                     lng:
 *                       type: number
 *                       description: Longitude of the drop-off location.
 *                       example: -123.54321
 *                     lat:
 *                       type: number
 *                       description: Latitude of the drop-off location.
 *                       example: 45.12345
 *                 note:
 *                   type: string
 *                   description: Additional comments from the buyer.
 *                   example: "Please deliver between 3-5 PM."
 *                 items:
 *                   type: array
 *                   description: List of item names to be delivered.
 *                   items:
 *                     type: string
 *                     example: spoon
 *       404:
 *         description: Delivery not found.
 *       500:
 *         description: Internal server error.
 */

deliveryRoutes
  .route("/")
  .get(getAllDeliveries)
  .post(
    [
      body("date").isDate().withMessage("Enter a valid date"),
      body("time").isTime({mode: "default"}).withMessage("Enter a valid time"),
      body("pickup.location")
        .notEmpty()
        .withMessage("Pickup location required"),
      body("pickup.lat")
        .notEmpty()
        .isNumeric()
        .withMessage("Pickup lat required"),
      body("pickup.lng")
        .notEmpty()
        .isNumeric()
        .withMessage("Pickup lng required"),
      body("dropOff.location")
        .notEmpty()
        .withMessage("DropOff location required"),
      body("dropOff.lat")
        .notEmpty()
        .isNumeric()
        .withMessage("DropOff lat required"),
      body("dropOff.lng")
        .notEmpty()
        .isNumeric()
        .withMessage("DropOff lng required"),
      body("items").isArray().withMessage("Items cannot be empty"),
      body("phone").isMobilePhone("any").withMessage("Invalid buyer number"),
      body("name").notEmpty().withMessage("Sale name is required"),
    ],
    createDelivery
  );
deliveryRoutes.route("/:deliveryId").get(getIndividualDelivery).patch();

export default deliveryRoutes;
