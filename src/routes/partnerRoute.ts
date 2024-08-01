import { Router } from "express";
import Multer from "multer";
import { body } from "express-validator";
import {
  getPartners,
  createParterController,
  togglePartnerAccess,
} from "../controllers/partnerControllers";
const upload = Multer({ dest: "/tmp" });
const partnerRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Partner
 *     description: Operations about partners
 */

/**
 * @swagger
 * /partner:
 *   post:
 *     summary: Create a new partner.
 *     tags:
 *       - Partner
 *     description: Create a partner with the provided information and files.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The partner's name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The partner's email.
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 description: The partner's phone number.
 *                 example: +34 434343 4343 4343 4
 *               item_type:
 *                 type: string
 *                 description: The kind of items to be sold by the partner.
 *                 example: Jewlleries
 *               business:
 *                 type: string
 *                 description: The name of the partner's business.
 *                 example: Xolo Jewlleries
 *               location:
 *                 type: string
 *                 description: The address of the partner.
 *                 example: some place on earth
 *               lng:
 *                 type: number
 *                 description: The longitude of the partner's location.
 *                 example: 20.0001
 *               lat:
 *                 type: number
 *                 description: The latitude of the partner's location.
 *                 example: 19.0002
 *               platforms:
 *                 type: array
 *                 description: A list of platforms where sale will be carried out.
 *                 items:
 *                  type: string
 *                  description: A single platform
 *                  example: facebook
 *               from:
 *                 type: string
 *                 format: date
 *                 description: Time of Open.
 *               to:
 *                 type: string
 *                 format: date
 *                 description: Time of Closing.
 *               payment_method:
 *                 type: string
 *                 description: The prefferd payment method to be used by the partner.
 *                 example: vendmo
 *               files:
 *                 type: object
 *                 format: file
 *                 description: The file to upload.
 *     responses:
 *       400:
 *         description: Partner will the same email already exist
 *       201:
 *         description: Partner's created successfully
 *       500:
 *         description: Internal server error
 */

partnerRoute
  .route("/")
  .post(
    upload.array("files"),
    [
      body("name").notEmpty(),
      body("email").isEmail(),
      body("phone").isMobilePhone("any"),
      body("item_type").notEmpty(),
      body("business").notEmpty(),
      body("location").notEmpty(),
      body("lng").notEmpty().isNumeric(),
      body("lat").notEmpty().isNumeric(),
      body("platforms").isArray({ min: 1 }),
      body("from").notEmpty(),
      body("to").notEmpty(),
      body("payment_method").notEmpty(),
    ],
    createParterController
  )
  .get(getPartners);

/**
 * @swagger
 * /partner:
 *   get:
 *     summary: Get all the partners.
 *     tags:
 *       - Partner
 *     description: Returns all the partners.
 *     parameters:
 *        required: false
 *     responses:
 *       500: Internal server error
 *       200:
 *         description: Successful response with partner details.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: A list of all the partners.
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
 *                   item_type:
 *                     type: string
 *                     description: The kind of items to be sold by the partner.
 *                     example: Jewelleries
 *                   business:
 *                     type: string
 *                     description: The name of the partner's business.
 *                     example: Xolo Jewelleries
 *                   location:
 *                     type: string
 *                     description: The address of the partner.
 *                     example: Some place on earth
 *                   lng:
 *                     type: number
 *                     description: The longitude of the partner's location.
 *                     example: 20.0001
 *                   lat:
 *                     type: number
 *                     description: The latitude of the partner's location.
 *                     example: 19.0002
 *                   platforms:
 *                     type: array
 *                     description: A list of platforms where sale will be carried out.
 *                     items:
 *                       type: string
 *                       description: A single platform.
 *                       example: facebook
 *                   from:
 *                     type: string
 *                     format: date
 *                     description: Time of Open.
 *                   to:
 *                     type: string
 *                     format: date
 *                     description: Time of Closing.
 *                   payment_method:
 *                     type: string
 *                     description: The preferred payment method to be used by the partner.
 *                     example: venmo
 *                   documents:
 *                     type: array
 *                     description: Cloudinary secure links to the files.
 *                     items:
 *                       type: string
 *                       format: url
 *                       description: A single link to a file.
 *                       example: https://somelink.com
 */

/**
 * @swagger
 * /partner/action/{id}:
 *   patch:
 *     summary: Approve or Disapprove a partner.
 *     tags:
 *       - Partner
 *     description: Approves a partner to make his link active.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the partner to be activated or deactivated.
 *       - in: query
 *         name: approve
 *         schema:
 *           type: string
 *         required: false
 *         description: The action to approve or disapprove.
 *     responses:
 *      500:
 *        description: Internal Server error
 *      200:
 *        description: Succcess
 */
partnerRoute.route("/action/:id").patch(togglePartnerAccess);
export default partnerRoute;
