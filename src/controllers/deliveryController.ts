import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Delivery from "../model/delivery";
import buyersResponse from "../utils/buyersResponse";
import Session from "../model/session";
import Stripe from "stripe";
import sendTextMessage from "../utils/sendTextMessage";
import { v2 as cloudinary } from "cloudinary";
import util from "util";
import fs from "fs";
export const createDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });
    const { buyer, seller, item } = req.body;
    const newDelivery = await Delivery.create({
      buyer,
      seller,
      item,
    });
    const { buyer: createdBuyerDetails, seller: createdSellerDetails } =
      newDelivery;
    const url = await buyersResponse(
      {
        lat: createdBuyerDetails!.address!.lat,
        lng: createdBuyerDetails!.address!.lng,
      },
      {
        lat: createdSellerDetails!.address!.lat,
        lng: createdSellerDetails!.address!.lng,
      },
      newDelivery.item!.price,
      "SnabDeal delivery",
      newDelivery._id.toHexString()
    );
    return res.status(201).json({ url });
  }
);

export const confirmDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { deliveryId } = req.params;
    const existingDelivery = await Delivery.findById(deliveryId).exec();
    if (!existingDelivery)
      return res.status(404).json({ message: "Existing delivery not found" });
    if (existingDelivery.paid)
      return res.status(502).json({ message: "Payment already made" });
    const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
      apiVersion: "2024-06-20",
      appInfo: { name: "SnabDeal" },
    });
    const buyerPaymentSession = await Session.findOne({ deliveryId });
    if (!buyerPaymentSession)
      return res.status(400).json({ messsage: "Delivery session not found" });

    const _session = await stripe.checkout.sessions.retrieve(
      buyerPaymentSession.sessionId
    );

    if (_session.payment_status === "paid") {
      existingDelivery.paid = true;
      await existingDelivery.save();
    }
    return res.status(200).json({ message: "Payment confirmed", deliveryId });
  }
);

export const getIndividualDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { deliveryId } = req.params;
    const existingDelivery = await Delivery.findById(deliveryId).lean().exec();
    if (!existingDelivery)
      return res.status(404).json({ message: "Existing delivery not found" });
    return res.status(200).json({ ...existingDelivery });
  }
);

export const getAllDeliveries = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const allDeliveries = await Delivery.find({}).lean().exec();
    return res.status(200).json([...allDeliveries]);
  }
);

export const editDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { deliveryId } = req.params;
    const { seller, buyer, item } = req.body;
    const existingDelivery = await Delivery.findById(deliveryId).exec();
    if (!existingDelivery)
      return res.status(404).json({ message: "Existing delivery not found" });
    existingDelivery.seller = seller;
    existingDelivery.buyer = buyer;
    existingDelivery.item = item;
    await existingDelivery.save();
    return res.status(200).json({ message: "Delivery edited successfully!" });
  }
);

export const changeStatus = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { deliveryId } = req.params;
    const { status } = req.body;
    if (!["onroute", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Bad status of pickup" });
    }
    const delivery = await Delivery.findById(deliveryId).exec();
    if (!delivery)
      return res.status(404).json({ message: "Delivery not found" });

    if (status == "delivered") {
      // require them to upload an image for proof
      if (!req.file) {
        return res.status(502).json({ message: "Submit proof file" });
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
        // update the details of the delivery here
        const imageData = {
          url: result.secure_url,
          id: result.public_id,
        };
        console.log(imageData);
        delivery.image = imageData;
        await delivery.save();
        await sendTextMessage(
          `Hi ${
            delivery.buyer!.name
          },\nYour package has been successfully delivered! 🎉📦\tHere's an image of your delivered item: ${
            result.secure_url
          }\nWe hope you're happy with our service! If you have a moment, we'd love for you to leave us a review at the link below ${
            process.env.FRONTEND_URL + "/testimony/" + delivery._id
          } \tThank you for choosing SnabbDeal!
          \tBest, The SnabbDeal Team`,
          delivery.buyer!.phone
        );
      });
    }

    delivery.status = status;
    await delivery.save();
    return res
      .status(200)
      .json({ message: `Delivery ${deliveryId} status changed to ${status}` });
  }
);
