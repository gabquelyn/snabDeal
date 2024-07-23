import express, { Express, Request, Response } from "express";
import logger, { logEvents } from "./middlewares/logger";
import cookierParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./utils/swaggerConfig";
import swaggerJSDoc from "swagger-jsdoc";
import intentRoute from "./routes/intentRoute";
import partnerRoute from "./routes/partnerRoute";
import trackingRoutes from "./routes/trackingRoutes";

dotenv.config();
connectDB();
const app: Express = express();
const port = process.env.PORT || 8080;
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(cookierParser());

app.use((req: Request, res: Response) => {
  return res.status(200).json({ message: "Welcome to server" });
});

app.use("/intent", intentRoute);
app.use("/partner", partnerRoute);
app.use('/tracking', trackingRoutes)

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
