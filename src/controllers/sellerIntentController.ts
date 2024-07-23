import expressAsyncHandler from "express-async-handler";
import BuyerIntent from "../model/buyerIntent";
import SellerIntent from "../model/sellerIntent";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import buyersResponse from "../utils/buyersResponse";
export const createSellerIntent = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const result = validationResult(req.body);
    if (!result.isEmpty()) return res.status(500).json(result.array());
    const {
      email,
      name,
      phone,
      lng,
      lat,
      location,
      pickup_time,
      payment_method,
      buy_intent,
    } = req.body;

    const existingBuyIntent = await BuyerIntent.findById(buy_intent).exec();
    if (!existingBuyIntent) {
      return res
        .status(404)
        .json({ messsage: "Invalid link, buyer intent not found" });
    }

    if (existingBuyIntent.acknowledged) {
      return res.status(400).json({
        message: "Invalid link, buyer intent already acknowledged",
      });
    }

    const sellerIntent = await SellerIntent.create({
      email,
      name,
      phone,
      address: {
        location,
        lng,
        lat,
      },
      pickup_time,
      payment_method,
      buyIntent: existingBuyIntent._id
    });

    // calcualte distance, generate and send payment link to the buyer
    await buyersResponse(
      {
        lat: existingBuyIntent.address!.lat,
        lng: existingBuyIntent.address!.lng,
      },
      { lat, lng },
      existingBuyIntent.item!.price,
      name,
      buy_intent,
      phone,
      existingBuyIntent.item!.tag
    );

    existingBuyIntent.acknowledged = true;
    await existingBuyIntent.save();

    return res.status(201).json({
      message: `Seller intent ${sellerIntent._id} created successfully`,
    });
  }
);

export const getSellerIntent = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const existingSellIntent = await SellerIntent.findById(id)
      .lean()
      .exec();
    if (!existingSellIntent)
      return res.status(404).json({ message: "Seller Intent not found!" });
    return res.status(200).json({ ...existingSellIntent });
  }
);
