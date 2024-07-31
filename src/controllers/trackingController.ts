import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Pickup from "../model/pickup";
import { v2 as cloudinary } from "cloudinary";
import util from "util";
import fs from "fs";
export const getPickup = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const existingPickup = await Pickup.findById(id)
      .populate("sellIntent")
      .populate("partnerId")
      .populate("buyIntent")
      .lean()
      .exec();
    if (!existingPickup)
      return res.status(404).json({ message: `Tracking not found ${id}` });
    return res.status(200).json({ ...existingPickup });
  }
);

export const getPickups = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const pickups = await Pickup.find({})
      .populate("sellIntent")
      .populate("partnerId")
      .populate("buyIntent")
      .lean()
      .exec();
    return res.status(200).json([...pickups]);
  }
);

export const changePickupState = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { status } = req.body;
    if (!["onroute", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Bad status of pickup" });
    }
    const pickup = await Pickup.findById(id).exec();
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    if (status == "delivered") {
      // require them to upload an image for proof
      if (!req.file) {
        return res.status(400).json({ message: "Submit proof file" });
      }
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      });

      const unlinkFile = util.promisify(fs.unlink);
      cloudinary.uploader.upload(req.file.path).then(async (result) => {
        // Delete the temporary file after upload
        unlinkFile(req.file!.path);
        // update the details of the pickup here
        const imageData = {
          url: result.secure_url,
          id: result.public_id,
        };
        console.log(imageData);
        pickup.image = imageData;
        await pickup.save();
      });
    }
    pickup.status = status;
    await pickup.save();
    return res
      .status(200)
      .json({ message: `Pickup ${id} status changed to ${status}` });
  }
);
