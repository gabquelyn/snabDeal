import express, { Express, Request, Response } from "express";
import logger, { logEvents } from "./middlewares/logger";
import cookierParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import deliveryRoutes from "./routes/deliveryRoute";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import testimonialRoutes from "./routes/testimonialRoute";
import saleRoutes from "./routes/saleRoute";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SnabDeal",
    version: "1.0.0",
    description: "Api endpoints for the SnabDeal",
  },
  servers: [
    {
      url: `http://localhost:3500`,
      description: "Development server",
    },
    {
      url: "https://snabdeal.onrender.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Delivery",
      description: "Operations about buyers delivery",
    },
    {
      name: "Sales",
      description: "Operations about garage or home sales",
    },
    {
      name: "Testimonial",
      description: "Operations about testimonials",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

dotenv.config();
connectDB();
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(cookierParser());

app.use("/delivery", deliveryRoutes);
app.use("/testimonial", testimonialRoutes);
app.use("/sale", saleRoutes);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);
mongoose.connection.on("open", () => {
  console.log("Connected to DB");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErr.log"
  );
});
