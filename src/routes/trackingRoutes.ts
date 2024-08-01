import { Router } from "express";
import {
  getPickup,
  getPickups,
  changePickupState,
} from "../controllers/trackingController";
import Multer from "multer";
const upload = Multer({ dest: "/tmp" });
const trackingRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Pickup
 *     description: Operations about pickup
 */

/**
 * @swagger
 * /tracking:
 *   get:
 *     summary: Get all the pickups.
 *     tags:
 *       - Pickup
 *     description: Returns all the pickups in the database.
 *     parameters:
 *        required: false
 *     responses:
 *       500:
 *         description: Internal server error
 *       200:
 *         description: Successful response with all pickups.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: A list of all the pikups.
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The Id of the pickup
 *                   buyIntent:
 *                     type: string
 *                     description: The Id of the buy intent
 *                   sellIntent:
 *                     type: string
 *                     description: The Id of the sell intent
 *                   status:
 *                     type: string
 *                     description: The status of the pickup
 *
 */
trackingRoutes.route("/").get(getPickups);

/**
 * @swagger
 * /tracking/{id}:
 *   get:
 *     summary: Get a pickup by its Id.
 *     tags:
 *       - Pickup
 *     description: Returns the details of a particular pickup.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the pickup which details are to be retrieved.
 *     responses:
 *       500:
 *         description: Internal server error
 *       200:
 *         description: Successful response with all pickups.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                _id:
 *                  type: string
 *                  description: The Id of the pickup
 *                buyIntent:
 *                  type: string
 *                  description: The Id of the buy intent
 *                sellIntent:
 *                  type: string
 *                  description: The Id of the sell intent
 *                status:
 *                  type: string
 *                  description: The status of the pickup
 *
 */

/**
 * @swagger
 * /tracking/{id}:
 *   patch:
 *     summary: Change the state of a pickup.
 *     tags:
 *       - Pickup
 *     description: Changes the state of the pickup by the id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the pickup whose state is to be changed.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status of the pickup.
 *                 example: enroute
 *               proof:
 *                 type: object
 *                 format: file
 *                 description: The file to upload, image.
 *     responses:
 *       400:
 *         description: Bad status of pickup
 *       404:
 *         description: Pickup not found
 *       502:
 *         description: Submit file proof
 *       200:
 *         description: Successfully changed the state of the pickup.
 *
 */
trackingRoutes
  .route("/:id")
  .get(getPickup)
  .patch(upload.single("proof"), changePickupState);

export default trackingRoutes;
