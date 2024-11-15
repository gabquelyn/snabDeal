import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { v2 as cloudinary } from "cloudinary";
import Sale from "../model/sale";
import fs from "fs";
import util from "util";
export const createSale = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json(error.array());
    // get the necessary files
    const uploadedImages = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!uploadedImages.posterImage || !uploadedImages.itemImages) {
      console.log(uploadedImages);
      return res
        .status(400)
        .json({ message: "Poster or item image of sale missing" });
    }
    // initiate cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    // upload the poster image first.
    const unlinkFile = util.promisify(fs.unlink);
    const result = await cloudinary.uploader.upload(
      uploadedImages.posterImage[0].path
    );
    unlinkFile(uploadedImages.posterImage[0].path);

    const { type, name, phone, address, date, paymentMethod, items, time } = req.body;

    // parse the items array and put the images url in them.
    const parsedItems: [{ name: string; price: number }] = JSON.parse(items);
    const locationAddress: {
      location: string;
      lat: number;
      lng: number;
    } = JSON.parse(address);
    if (
      !locationAddress?.lat ||
      !locationAddress.lng ||
      !locationAddress?.location
    )
      return res.status(400).json({ message: "invalid location address" });
    if (parsedItems.length !== uploadedImages.itemImages.length)
      return res.status(400).json({ message: "Item and images list mismatch" });

    const itemsWithImageUrl = await Promise.all(
      parsedItems.map(async (item, index) => {
        try {
          const result = await cloudinary.uploader.upload(
            uploadedImages.itemImages[index].path
          );
          unlinkFile(uploadedImages.itemImages[index].path); // Awaiting file unlink
          return {
            ...item,
            image: result.secure_url,
          };
        } catch (error) {
          console.error("Error uploading image:", error);
          return {
            ...item,
            image: null,
          };
        }
      })
    );

    await Sale.create({
      type,
      name,
      phone,
      address: locationAddress,
      date,
      paymentMethod,
      posterImage: result.secure_url,
      items: itemsWithImageUrl,
      time
    });

    return res.status(201).json({ message: "Sale created successfully" });
  }
);

export const getSales = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const allSales = await Sale.find({}).lean().exec();
    return res.status(200).json([...allSales]);
  }
);

export const getASale = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const foundSale = await Sale.findById(id).lean().exec();
    if (!foundSale) return res.status(404).json({ message: "Sale not found" });
    return res.status(200).json({ ...foundSale });
  }
);
