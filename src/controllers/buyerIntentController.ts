import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import BuyerIntent from "../model/buyerIntent";
import Partner from "../model/partner";
import buyersResponse from "../utils/buyersResponse";
import Session from "../model/session";
import Stripe from "stripe";
import Pickup from "../model/pickup";
import SellerIntent from "../model/sellerIntent";

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
      if (!exisitingPartner.verified)
        return res.status(400).json({ messsge: "Partner is not verified" });

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
        tag,
        partnerId
      );

      return res.status(200).json({
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

export const getBuyerIntent = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const existingBuyerIntent = await BuyerIntent.findById(id).lean().exec();
    if (!existingBuyerIntent)
      return res
        .status(404)
        .json({ message: "Intent not found, invalid link!" });
    if (existingBuyerIntent.acknowledged) {
      return res.status(400).json({ message: "Bad request, invalid link" });
    }
  }
);

export const confirmBuyerPaymentIntent = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
      apiVersion: "2024-06-20",
      appInfo: { name: "SnabDeal" },
    });

    const { buyIntent } = req.params;
    const { id } = req.query;
    const exisitingBuyIntent = await BuyerIntent.findById(buyIntent)
      .lean()
      .exec();
    if (!exisitingBuyIntent)
      return res.status(404).json({ message: "Buyer intent not found!" });
    const scheduledPickup = await Pickup.findOne({
      buyIntent,
    })
      .lean()
      .exec();
    if (scheduledPickup)
      return res.status(400).json({ message: "Pickup already scheduled" });

    const buyerPaymentSession = await Session.findOne({
      buyerIntent: buyIntent,
    })
      .lean()
      .exec();

    if (!buyerPaymentSession)
      return res
        .status(400)
        .json({ message: "Buyer didn't complete the payment" });

    // check for the partner name in the query parameters
    const partner = await Partner.findById(id).lean().exec();
    if (id && !partner)
      return res.status(400).json({ message: `Invalid partner Id, ${id}` });

    const sellIntent = await SellerIntent.findOne({ buyIntent }).lean().exec();
    if (!sellIntent)
      res.status(400).json({
        message: `Seller hasn't responded to buyer's intent, ${buyIntent}. Not sure how you got here`,
      });

    // check the status of the payment and if successfull create a pickup for admin to see

    const _session = await stripe.checkout.sessions.retrieve(
      buyerPaymentSession.sessionId
    );

    if (_session.payment_status === "paid") {
      const scheduledPickup = await Pickup.create({
        sellIntent: sellIntent?._id,
        parterId: id,
        buyIntent,
      });
      res.status(200).json({ trackingId: scheduledPickup._id });
    } else {
      res.status(400).json({ messsage: "Payment not successfull" });
    }
  }
);