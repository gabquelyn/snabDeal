import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Partner from "../model/partner";
import { v2 as cloudinary } from "cloudinary";

export const createParterController = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const result = validationResult(req.body);
    if (!result.isEmpty()) return res.status(500).json(result.array());
    const {
      name,
      email,
      phone,
      item_type,
      business,
      location,
      lng,
      lat,
      platforms,
      from,
      to,
      payment_method,
    } = req.body;

    const exisitingPartner = await Partner.findOne({ email }).lean().exec();
    if (exisitingPartner)
      return res
        .status(400)
        .json({ messsage: "Partner with email already exists" });

    // check and save document to cloudinary
    const filesObj = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (!filesObj.front || !filesObj.back) {
      return res
        .status(400)
        .json({ message: "Missing files, front or back image" });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }
);

export const getPartners = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const partners = await Partner.find({}).lean().exec();
    return res.status(200).json([...partners]);
  }
);

export const togglePartnerAccess = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { approve } = req.query;
    const partner = await Partner.findById(id).exec();
    if (!partner)
      return res.status(404).json({ message: "Partner not found!" });
    if (approve) partner.verified = true;
    else partner.verified = false;
    await partner.save();
    return res.status(200).json({ message: "Approved partner" });
  }
);

