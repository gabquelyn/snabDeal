import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Delivery from "../model/delivery";
import buyersResponse from "../utils/buyersResponse";
import Session from "../model/session";
import Stripe from "stripe";
import sendTextMessage from "../utils/sendTextMessage";
import Sale from "../model/sale";
import { v2 as cloudinary } from "cloudinary";
import util from "util";
import fs from "fs";
import calculateDistance from "../utils/calculateDistance";
import SalesDelivery from "../model/salesDelivery";

interface Position {
  location: string;
  lng: number;
  lat: number;
}

export const createSaleDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });
    const { saleId } = req.params;
    const {
      time,
      address,
      items,
      phone,
      name,
    }: {
      [key: string]: any;
      address: Position;
      items: [{ itemId: string; quantity: number }];
    } = req.body;

    const existingSale = await Sale.findById(saleId).lean().exec();
    if (!existingSale)
      return res.status(404).json({ message: "Sale does not exist" });

    // calculate the distance in miles
    const distance = calculateDistance(
      {
        lat: address.lat,
        lng: address.lng,
      },
      {
        lat: existingSale.address!.lat,
        lng: existingSale.address!.lng,
      }
    );

    let productData: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "SnabbDeal delivery fees",
          },
          unit_amount: Math.round(distance > 10 ? 12 : 5) * 100,
        },
        quantity: 1,
      },
    ];

    // populate the list for stripe
    for (const item of items) {
      const realItem = existingSale.items.find(
        (listedItem) => listedItem._id?.toString() === item.itemId
      );

      if (realItem) {
        productData.push({
          price_data: {
            currency: "usd",
            product_data: { name: realItem.name, images: [realItem.image] },
            unit_amount: +realItem.price * 100,
          },
          quantity: item.quantity,
        });
      }
    }

    // create the delivery instance
    const newSaleDelivery = await SalesDelivery.create({
      saleId,
      address,
      items,
      time,
      phone,
      name,
    });

    const url = await buyersResponse(
      productData,
      newSaleDelivery._id.toHexString()
    );
    return res.status(201).json({ url });
  }
);

export const confirmDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { deliveryId } = req.params;
    const existingDelivery = await Delivery.findById(deliveryId).exec();
    const existingSaleDelivery = await SalesDelivery.findById(
      deliveryId
    ).exec();
    if (!existingDelivery && !existingSaleDelivery)
      return res.status(404).json({ message: "Existing delivery not found" });
    if (existingDelivery?.paid || existingSaleDelivery?.paid)
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
      if (existingDelivery) {
        existingDelivery.paid = true;
        await existingDelivery.save();
      } else if (existingSaleDelivery) {
        existingSaleDelivery.paid = true;
        await existingSaleDelivery.save();
      }

      // await sendTextMessage(
      //   `Hello \nGood news! A buyer has requested delivery for the item you're selling on (e.g., Facebook Marketplace, Craigslist, etc.). \tOrder Details \nItem: ${existingDelivery.item?.note}\n Pick-up Address: ${existingDelivery.seller?.address?.location} \nDelivery Address: $${existingDelivery.buyer?.address?.location}\nScheduled Pick-up Time: ${existingDelivery.seller?.date} ${existingDelivery.seller?.time} If you have any questions or need assistance, feel free to contact our support team.Thank you for using Snabdeal!`,
      //   existingDelivery.seller!.phone
      // );
    }
    return res.status(200).json({ message: "Payment confirmed", deliveryId });
  }
);

export const changeStatus = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    type acceptedStatus = "onroute" | "delivered" | "arrived" | "picked";
    const { deliveryId } = req.params;
    const { status }: { status: acceptedStatus } = req.body;
    const statusArray: acceptedStatus[] = [
      "onroute",
      "delivered",
      "picked",
      "arrived",
    ];
    if (!statusArray.includes(status)) {
      return res.status(400).json({ message: "Invalid status of pickup" });
    }
    const delivery = await Delivery.findById(deliveryId).exec();
    const saleDelivery = await SalesDelivery.findById(deliveryId).exec();
    if (!delivery && !saleDelivery)
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

        if (delivery) {
          delivery.image = imageData;
          delivery.status = status;
          await delivery.save();
        }

        if (saleDelivery) {
          saleDelivery.image = imageData;
          saleDelivery.status = status;
          await saleDelivery.save();

          await sendTextMessage(
            `Hi ${
              saleDelivery.name
            },\nYour package has been successfully delivered! 🎉📦\tHere's an image of your delivered item: ${
              result.secure_url
            }\nWe hope you're happy with our service! If you have a moment, we'd love for you to leave us a review at the link below ${
              process.env.FRONTEND_URL + "/testimony/" + saleDelivery._id
            } \tThank you for choosing SnabbDeal!
            \tBest, The SnabbDeal Team`,
            saleDelivery.phone
          );
        }
      });
    }

    // send text messages based on respective roles
    if (status === "onroute") {
      if (saleDelivery) {
        await sendTextMessage(
          `Hi,\tGreat news! Your SnabbDeal pickup driver is on the way to collect your item. You'll receive payment via your chosen method once the item is picked up. \nThank you for using SnabbDeal!`,
          saleDelivery.phone
        );
      }
    }

    if (status === "arrived") {
      if (saleDelivery) {
        const saleOwner = await Sale.findById(saleDelivery.saleId)
          .lean()
          .exec();
        await sendTextMessage(
          `Hi, \tYour SnabbDeal driver has arrived to pick up your item. Please be ready with the item for a smooth handover. Payment will be processed shortly after pickup. \nThank you for using SnabbDeal!`,
          saleOwner!.phone
        );
      }
    }

    if (status === "picked") {
      if (saleDelivery) {
        await sendTextMessage(
          `Hi ${saleDelivery.name}, \tYour package has been picked up successfully by the SnabbDeal driver. You can now track its here: https://www.snabbdeal.com/track with tracking Id ${saleDelivery._id}. \nThank you for choosing SnabbDeal for your delivery!`,
          saleDelivery.phone
        );
      }
    }

    return res.status(200).json({
      message: `Delivery ${
        deliveryId || saleDelivery
      } status changed to ${status}`,
    });
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

export const getIndividualSaleDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { deliveryId } = req.params;
    const existingSaleDelivery = await SalesDelivery.findById(deliveryId)
      .lean()
      .exec();
    if (!existingSaleDelivery)
      return res.status(404).json({ message: "Existing delivery not found" });
    return res.status(200).json({ ...existingSaleDelivery });
  }
);

export const getAllDeliveries = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const allDeliveries = await Delivery.find({}).lean().exec();
    return res.status(200).json([...allDeliveries]);
  }
);

export const getAllSaleDeliveries = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const allSaleDeliveries = await SalesDelivery.find({}).lean().exec();
    return res.status(200).json([...allSaleDeliveries]);
  }
);

export const editDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ message: "Delivery edited successfully!" });
  }
);

export const createDelivery = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });
    const {
      store,
      platform,
      pickup,
      dropOff,
      name,
      phone,
      items,
      date,
      note,
      time,
    }: { [key: string]: any; pickup: Position; dropOff: Position } = req.body;
    const distance = calculateDistance(pickup, dropOff);
    let productData: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "SnabbDeal delivery fees",
          },
          unit_amount: Math.round(distance > 10 ? 12 : 5) * 100,
        },
        quantity: 1,
      },
    ];

    const newDelivery = await Delivery.create({
      store,
      platform,
      name,
      phone,
      items,
      date,
      note,
      pickup,
      time,
      dropOff,
    });

    const url = await buyersResponse(
      productData,
      newDelivery._id.toHexString()
    );
    return res.status(201).json({ url });
  }
);
