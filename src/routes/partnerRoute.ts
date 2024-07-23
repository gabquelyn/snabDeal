import { Router } from "express";
import Multer from "multer";
import { body } from "express-validator";
import {
  getPartners,
  createParterController,
  togglePartnerAccess,
} from "../controllers/partnerControllers";
const upload = Multer();
const partnerRoute = Router();

partnerRoute
  .route("/")
  .post(
    upload.fields([
      { name: "front", maxCount: 1 },
      { name: "back", maxCount: 1 },
    ]),
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
    createParterController
  )
  .get(getPartners);
partnerRoute.route("/:id").patch(togglePartnerAccess);
export default partnerRoute;