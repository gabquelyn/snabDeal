import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Sale from "../model/sale";
export const createSale = expressAsyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(400).json(error.array());
    const {
      type,
      name,
      phone,
      address,
      date,
      paymentMethod,
      posterImage,
      items,
    } = req.body;
    await Sale.create({
      type,
      name,
      phone,
      address,
      date,
      paymentMethod,
      posterImage,
      items,
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
