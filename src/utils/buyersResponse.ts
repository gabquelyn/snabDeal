import calculateDistance from "../utils/calculateDistance";
import sendTextMessage from "./sendTextMessage";
import Stripe from "stripe";
import Session from "../model/session";
export default async function buyersResponse(
  source: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  price: number,
  name: string,
  idempotencyKey: string,
  tag?: string
): Promise<string | null | undefined> {
  // instantiate Stripe
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2024-06-20",
    appInfo: { name: "SnabDeal" },
  });
  const distance = calculateDistance(source, destination);
  console.log(distance);
  const priceDetails = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: name,
          item: tag,
        },
        unit_amount: Math.round(price + (distance > 6 ? 12 : 5)) * 100,
      },
      quantity: 1,
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: priceDetails,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/confirmation/${idempotencyKey}`,
      cancel_url: `${process.env.FRONTEND_URL}/`,
    });
    const previousSession = await Session.findOne({
      deliveryId: idempotencyKey,
    }).exec();
    if (previousSession) await previousSession.deleteOne();
    await Session.create({
      sessionId: session.id,
      deliveryId: idempotencyKey,
    });
    // console.log(session.url);
    // await sendTextMessage(
    //   `Hi ${name},\tThe seller has successfully scheduled your order for ${tag}! 🎉\nTo complete your purchase and arrange for swift delivery, please follow the link below to view the order summary and make your payment:\t${session.url}\tThank you for using SnabbDeal! If you have any questions, feel free to reach out.\tBest,The SnabbDeal Team`,
    //   phone
    // );
    return session.url;
  } catch (err) {
    console.log(err);
  }
}
