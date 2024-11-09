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
 *     description: Creates a new delivery with the provided buyer, seller, and item details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyer:
 *                 type: object
 *                 required:
 *                   - name
 *                   - email
 *                   - phone
 *                   - address
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The buyer's name.
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: The buyer's email.
 *                     example: john.doe@example.com
 *                   phone:
 *                     type: string
 *                     description: The buyer's phone number.
 *                     example: "+1234567890"
 *                   address:
 *                     type: object
 *                     required:
 *                       - location
 *                       - lng
 *                       - lat
 *                     properties:
 *                       location:
 *                         type: string
 *                         description: The buyer's address location.
 *                         example: "123 Main St, Springfield"
 *                       lng:
 *                         type: number
 *                         description: The longitude of the buyer's address.
 *                         example: -123.12345
 *                       lat:
 *                         type: number
 *                         description: The latitude of the buyer's address.
 *                         example: 45.67890
 *                   comment:
 *                     type: string
 *                     description: Additional comments from the buyer.
 *                     example: "Please deliver between 3-5 PM."
 *               seller:
 *                 type: object
 *                 required:
 *                   - date
 *                   - time
 *                   - phone
 *                   - address
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the sale.
 *                     example: "2024-08-22"
 *                   time:
 *                     type: string
 *                     description: The time of the sale.
 *                     example: "14:30"
 *                   phone:
 *                     type: string
 *                     description: The seller's phone number.
 *                     example: "+9876543210"
 *                   address:
 *                     type: object
 *                     required:
 *                       - location
 *                       - lng
 *                       - lat
 *                     properties:
 *                       location:
 *                         type: string
 *                         description: The seller's address location.
 *                         example: "456 Market St, Springfield"
 *                       lng:
 *                         type: number
 *                         description: The longitude of the seller's address.
 *                         example: -123.54321
 *                       lat:
 *                         type: number
 *                         description: The latitude of the seller's address.
 *                         example: 45.09876
 *                   paymentMethod:
 *                     type: string
 *                     description: The method of payment.
 *                     example: "Credit Card"
 *               item:
 *                 type: object
 *                 required:
 *                   - price
 *                   - link
 *                 properties:
 *                   note:
 *                     type: string
 *                     description: Any notes about the item.
 *                     example: "Handle with care."
 *                   price:
 *                     type: number
 *                     description: The price of the item.
 *                     example: 99.99
 *                   link:
 *                     type: string
 *                     description: A link to the item.
 *                     example: "https://example.com/item/123"
 *               status:
 *                 type: string
 *                 description: The current status of the delivery.
 *                 default: "pending"
 *                 example: "pending"
 *               paid:
 *                 type: boolean
 *                 description: Indicates if the delivery has been paid for.
 *                 default: false
 *                 example: false
 *               image:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     description: URL of the delivery image.
 *                     example: "https://example.com/image.jpg"
 *                   id:
 *                     type: string
 *                     description: ID of the delivery image in storage.
 *                     example: "image123"
 *     responses:
 *       404:
 *         description: Pickup not found.
 *       200:
 *         description: Delivery created successfully.
 */

/**
 * @swagger
 * /delivery:
 *   get:
 *     summary: Retrieves a list of all deliveries.
 *     tags:
 *       - Delivery
 *     description: Fetches details of all deliveries.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of deliveries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The delivery ID.
 *                     example: "64c71b8f8e4eabc123456789"
 *                   buyer:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *                       address:
 *                         type: object
 *                         properties:
 *                           location:
 *                             type: string
 *                             example: "123 Main St, Springfield"
 *                           lng:
 *                             type: number
 *                             example: -123.12345
 *                           lat:
 *                             type: number
 *                             example: 45.67890
 *                   seller:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2024-08-22"
 *                       time:
 *                         type: string
 *                         example: "14:30"
 *                       phone:
 *                         type: string
 *                         example: "+9876543210"
 *                       address:
 *                         type: object
 *                         properties:
 *                           location:
 *                             type: string
 *                             example: "456 Market St, Springfield"
 *                           lng:
 *                             type: number
 *                             example: -123.54321
 *                           lat:
 *                             type: number
 *                             example: 45.09876
 *                   item:
 *                     type: object
 *                     properties:
 *                       note:
 *                         type: string
 *                         example: "Handle with care."
 *                       price:
 *                         type: number
 *                         example: 99.99
 *                       link:
 *                         type: string
 *                         example: "https://example.com/item/123"
 *                   status:
 *                     type: string
 *                     example: "pending"
 *                   paid:
 *                     type: boolean
 *                     example: false
 *                   image:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       id:
 *                         type: string
 *                         example: "image123"
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
 * /delivery/{id}:
 *   get:
 *     summary: Retrieves delivery details.
 *     tags:
 *       - Delivery
 *     description: Fetches details of a specific delivery by its ID.
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
 *         description: Successfully retrieved the delivery details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The delivery ID.
 *                   example: "64c71b8f8e4eabc123456789"
 *                 buyer:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     address:
 *                       type: object
 *                       properties:
 *                         location:
 *                           type: string
 *                           example: "123 Main St, Springfield"
 *                         lng:
 *                           type: number
 *                           example: -123.12345
 *                         lat:
 *                           type: number
 *                           example: 45.67890
 *                 seller:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2024-08-22"
 *                     time:
 *                       type: string
 *                       example: "14:30"
 *                     phone:
 *                       type: string
 *                       example: "+9876543210"
 *                     address:
 *                       type: object
 *                       properties:
 *                         location:
 *                           type: string
 *                           example: "456 Market St, Springfield"
 *                         lng:
 *                           type: number
 *                           example: -123.54321
 *                         lat:
 *                           type: number
 *                           example: 45.09876
 *                 item:
 *                   type: object
 *                   properties:
 *                     note:
 *                       type: string
 *                       example: "Handle with care."
 *                     price:
 *                       type: number
 *                       example: 99.99
 *                     link:
 *                       type: string
 *                       example: "https://example.com/item/123"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *                 paid:
 *                   type: boolean
 *                   example: false
 *                 image:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     id:
 *                       type: string
 *                       example: "image123"
 *       404:
 *         description: Delivery not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /delivery/{id}:
 *   patch:
 *     summary: Edits delivery details.
 *     tags:
 *       - Delivery
 *     description: Edits details of a specific delivery by its ID.
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
 *         description: Successfully edited the deliveries.
 *       404:
 *         description: Delivery with the specified ID not found.
 *       500:
 *         description: Internal server error
 */
deliveryRoutes
  .route("/")
  .get(getAllDeliveries)
  .post(
    [
      body("date").isDate().withMessage("Enter a valid date"),
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
