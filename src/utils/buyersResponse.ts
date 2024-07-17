import { CreatePaymentLinkRequest, Client, Environment } from "square";
import calculateDistance from "../utils/calculateDistance";
import sendTextMessage from "./sendTextMessage";
export default async function buyersResponse(
  source: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  price: number,
  name: string,
  idempotencyKey: string,
  phone: string,
  tag: string
) {
  const distanceInKm = calculateDistance(source, destination);

  const inMiles = distanceInKm / 1.61;
  const client = new Client({
    accessToken: process.env.SQUARE_AUTH!,
    environment: Environment.Sandbox,
  });
  const body: CreatePaymentLinkRequest = {
    idempotencyKey,
    quickPay: {
      name: "SnabDeal",
      priceMoney: {
        amount: BigInt((price + inMiles) * 100),
        currency: "USD",
      },
      locationId: process.env.SQUARE_LOCATION_ID!,
    },
  };
  try {
    const response = await client.checkoutApi.createPaymentLink(body);
    console.log(response);
    await sendTextMessage(
      `Hi ${name},\tThe seller has successfully scheduled your order for ${tag}! 🎉\nTo complete your purchase and arrange for swift delivery, please follow the link below to view the order summary and make your payment:\t${response.result.paymentLink}\tThank you for using SnabbDeal! If you have any questions, feel free to reach out.\tBest,The SnabbDeal Team`,
      phone
    );
  } catch (err) {
    console.log(err);
  }
}
