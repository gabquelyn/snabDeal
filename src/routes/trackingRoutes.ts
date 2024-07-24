import { Router } from "express";
import {
  getPickup,
  getPickups,
  changePickupState,
} from "../controllers/trackingController";
const trackingRoutes = Router();

/**
 * @swagger
 * /tracking:
 *   get:
 *     summary: Get all the pickups.
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
trackingRoutes.route("/:id").get(getPickup).patch(changePickupState);

export default trackingRoutes;
