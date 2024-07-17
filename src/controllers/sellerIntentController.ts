import expressAsyncHandler from "express-async-handler";
import BuyerIntent from "../model/buyerIntent";
import SellerIntent from "../model/sellerIntent";
import { Request, Response } from "express";
import buyersResponse from "../utils/buyersResponse";
export const createSellerIntent = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
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

    const existingBuyIntent = await BuyerIntent.findById(buy_intent)
      .lean()
      .exec();
    if (!existingBuyIntent) {
      return res
        .status(404)
        .json({ messsage: "invalid link, buyer intent not found" });
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
      buy_intent,
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

    return res.status(201).json({
      message: `Seller intent R${sellerIntent._id} created successfully`,
    });
  }
);
