import { Router } from "express";
import {
  getPickup,
  getPickups,
  changePickupState,
} from "../controllers/trackingController";
const trackingRoutes = Router();
trackingRoutes.route("/").get(getPickups);
trackingRoutes.route("/:id").get(getPickup).patch(changePickupState);

export default trackingRoutes;
