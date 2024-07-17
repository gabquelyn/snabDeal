import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import BuyerIntent from "../model/buyerIntent";
import Partner from "../model/partner";
import calculateDistance from "../utils/calculateDistance";
import { CreatePaymentLinkRequest, Client, Environment } from "square";
import sendTextMessage from "../utils/sendTextMessage";
import buyersResponse from "../utils/buyersResponse";
export const createBuyerIntent = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const result = validationResult(req.body);
    if (!result.isEmpty()) return res.status(500).json(result.array());
    const {
      email,
      name,
      phone,
      message,
      location,
      lng,
      lat,
      price,
      tag,
      link,
      partnerId,
    } = req.body;

    if (partnerId) {
      const exisitingPartner = await Partner.findById(partnerId).lean().exec();
      if (!exisitingPartner)
        return res.status(404).json({ message: `invalid parter ${partnerId}` });

      // inform the partner that there is a new pickup after a successful payment
      const newBuyerIntenet = await BuyerIntent.create({
        email,
        name,
        message,
        price,
        phone,
        acknowledged: true,
        address: {
          location,
          lng,
          lat,
        },
        item: {
          tag,
          link,
          price,
        },
      });

      await buyersResponse(
        {
          lat: exisitingPartner.address!.lat,
          lng: exisitingPartner.address!.lng,
        },
        { lat, lng },
        price,
        name,
        newBuyerIntenet._id.toString(),
        phone,
        tag
      );

      return res
        .status(200)
        .json({
          message: "Intent created for partner and paymnet link sent to buyer",
        });
    }

    // create product and send the seller link to the buyer
    const newBuyerIntenet = await BuyerIntent.create({
      email,
      name,
      message,
      price,
      phone,
      address: {
        location,
        lng,
        lat,
      },
      item: {
        tag,
        link,
        price,
      },
    });

    return res.status(200).json({ buyerId: newBuyerIntenet._id });
  }
);
