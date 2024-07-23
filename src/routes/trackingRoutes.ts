import { Router } from "express";
import { getPickup, getPickups } from "../controllers/trackingController";
const trackingRoutes = Router();
trackingRoutes.route("/").get(getPickups);
trackingRoutes.route("/:id").get(getPickup);

export default trackingRoutes;
