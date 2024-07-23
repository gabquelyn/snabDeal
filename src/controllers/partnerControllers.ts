import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Partner from "../model/partner";
import { v2 as cloudinary } from "cloudinary";
import util from "util";
import fs from "fs";
import sendTextMessage from "../utils/sendTextMessage";

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

    //save document to cloudinary;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    const unlinkFile = util.promisify(fs.unlink);
    const uploadPromises = (req.files as Express.Multer.File[])?.map(
      async (file) => {
        return cloudinary.uploader.upload(file.path).then((result) => {
          // Delete the temporary file after upload
          unlinkFile(file.path);
          return {
            url: result.secure_url,
            id: result.public_id,
          };
        });
      }
    );

    const fileInfos = await Promise.all(uploadPromises);
    const newPartner = await Partner.create({
      email,
      name,
      phone,
      item_type,
      business,
      platforms: JSON.parse(platforms),
      address: {
        location,
        lat,
        lng,
      },
      pickup_time: {
        from,
        to,
      },
      documnent: fileInfos,
      payment_method,
    });
    await sendTextMessage(
      `Hi ${name}, request to join SnabDeal Partners received.\t We will approve your request and your link ${process.env.FRONTEND_URL}?partner=${newPartner._id} will become active`,
      phone
    );
    return res.status(201).json({ partnerId: newPartner._id });
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
