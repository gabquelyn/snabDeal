import { Router } from "express";
import { createSale, getASale, getSales } from "../controllers/saleController";
import { body } from "express-validator";
import Multer from "multer";
const upload = Multer({ dest: "/tmp" });
const saleRoutes = Router();

/**
 * @swagger
 * /sale:
 *   post:
 *     summary: Creates a new garage or house sale.
 *     tags:
 *       - Sales
 *     description: Operations about garage or home sales.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the sale.
 *                 example: Xolo garage sales
 *               type:
 *                 type: string
 *                 description: Type of sale.
 *                 example: Garage
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method required for sale.
 *                 example: cashApp
 *               phone:
 *                 type: string
 *                 description: Phone number of the sale owner.
 *                 example: +2349039099172
 *               date:
 *                 type: string
 *                 description: Date of the sale.
 *                 example: 12-04-2024
 *               time:
 *                 type: string
 *                 description: Time of the sale.
 *                 example: 12:45
 *               address:
 *                 type: object
 *                 properties:
 *                   location:
 *                     type: string
 *                     description: Location of the sales location.
 *                     example: Texas
 *                   lat:
 *                     type: number
 *                     description: Latitude of the sales location.
 *                     example: -23.0
 *                   lng:
 *                     type: number
 *                     description: Longitude of the sales location.
 *                     example: -24.0
 *               posterImage:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the poster.
 *               itemImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of item image files.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Name of the item to be sold.
 *                       example: spoon
 *                     price:
 *                       type: number
 *                       description: Price of the item to be sold in USD.
 *                       example: 23
 *     responses:
 *       201:
 *         description: Successfully created a sale.
 *       400:
 *         description: Bad request.
 *       422:
 *         description: Unprocessable entity.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /sale:
 *   get:
 *     summary: Retrieves a list of garage or house sales.
 *     tags:
 *       - Sales
 *     description: Returns an array of sales, each containing details of individual garage or home sales.
 *     responses:
 *       200:
 *         description: A list of sales.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the sale.
 *                     example: Xolo garage sales
 *                   type:
 *                     type: string
 *                     description: Type of sale.
 *                     example: Garage
 *                   paymentMethod:
 *                     type: string
 *                     description: Payment method required for sale.
 *                     example: cashApp
 *                   phone:
 *                     type: string
 *                     description: Phone number of the sale owner.
 *                     example: +2349039099172
 *                   date:
 *                     type: string
 *                     description: Date of the sale.
 *                     example: 12-04-2024
 *                   time:
 *                     type: string
 *                     description: Time of the sale.
 *                     example: 12:45
 *                   address:
 *                     type: object
 *                     properties:
 *                       location:
 *                         type: string
 *                         description: The location of the sales location.
 *                         example: Texas
 *                       lat:
 *                         type: number
 *                         description: The latitude of the sales location.
 *                         example: -23.0
 *                       lng:
 *                         type: number
 *                         description: The longitude of the sales location.
 *                         example: -24.0
 *                   posterImage:
 *                     type: string
 *                     format: base64
 *                     description: The base64 URL of the image file.
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The name of the item to be sold.
 *                           example: spoon
 *                         price:
 *                           type: number
 *                           description: The price of the item to be sold in USD.
 *                           example: 23
 *                         image:
 *                           type: string
 *                           format: base64
 *                           description: The base64 of the image of the item to be sold.
 *                           example: reeAAAAA
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /sale/{id}:
 *   get:
 *     summary: Retrieves a sale by its ID.
 *     tags:
 *       - Sales
 *     description: Returns the details of a specific garage or home sale by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the sale
 *     responses:
 *       200:
 *         description: A sale object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of the sale.
 *                   example: Xolo garage sales
 *                 type:
 *                   type: string
 *                   description: Type of sale.
 *                   example: Garage
 *                 paymentMethod:
 *                   type: string
 *                   description: Payment method required for sale.
 *                   example: cashApp
 *                 phone:
 *                   type: string
 *                   description: Phone number of the sale owner.
 *                   example: +2349039099172
 *                 date:
 *                   type: string
 *                   description: Date of the sale.
 *                   example: 12-04-2024
 *                 time:
 *                   type: string
 *                   description: Time of the sale.
 *                   example: 12:45
 *                 address:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: string
 *                       description: The location of the sales location.
 *                       example: Texas
 *                     lat:
 *                       type: number
 *                       description: The latitude of the sales location.
 *                       example: -23.0
 *                     lng:
 *                       type: number
 *                       description: The longitude of the sales location.
 *                       example: -24.0
 *                 posterImage:
 *                   type: string
 *                   format: base64
 *                   description: The base64 URL of the image file.
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: The name of the item to be sold.
 *                         example: spoon
 *                       price:
 *                         type: number
 *                         description: The price of the item to be sold in USD.
 *                         example: 23
 *                       image:
 *                         type: string
 *                         format: base64
 *                         description: The base64 of the image of the item to be sold.
 *                         example: reeAAAAA
 *       404:
 *         description: Sale not found.
 *       500:
 *         description: Internal server error.
 */

saleRoutes
  .route("/")
  .post(
    [
      upload.fields([
        { name: "posterImage", maxCount: 1 },
        { name: "itemImages" },
      ]),

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
    ],
    createSale
  )
  .get(getSales);
saleRoutes.route("/:id").get(getASale);

export default saleRoutes;
