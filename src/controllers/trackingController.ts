import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Pickup from "../model/pickup";
export const getPickup = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const existingPickup = await Pickup.findById(id).lean().exec();
    if (!existingPickup)
      return res.status(404).json({ message: `Tracking not found ${id}` });
    return res.status(200).json({ ...existingPickup });
  }
);

export const getPickups = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const pickups = await Pickup.find({})
      .populate("sellIntent")
      .populate("parterId")
      .populate("buyIntent")
      .lean()
      .exec();

    return res.status(200).json([...pickups]);
  }
);
