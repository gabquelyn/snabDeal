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
  phone: string,
  tag: string,
  partnerId?: string
) {
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2024-06-20",
    appInfo: { name: "SnabDeal" },
  });
  const distance = calculateDistance(source, destination);
  const priceDetails = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: tag,
        },
        unit_amount: (price + distance) * 100,
      },
      quantity: 1,
    },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: priceDetails,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/confirmation/${idempotencyKey}${
        partnerId && `?id=${partnerId}`
      }`,
      cancel_url: `${process.env.FRONTEND_URL}/buyer-form${
        partnerId && `?id=${partnerId}`
      }`,
    });
    const previousSession = await Session.findOne({
      buyerIntent: idempotencyKey,
    }).exec();
    if (previousSession) await previousSession.deleteOne();
    await Session.create({
      sessionId: session.id,
      buyerIntent: idempotencyKey,
    });

    await sendTextMessage(
      `Hi ${name},\tThe seller has successfully scheduled your order for ${tag}! 🎉\nTo complete your purchase and arrange for swift delivery, please follow the link below to view the order summary and make your payment:\t${session.url}\tThank you for using SnabbDeal! If you have any questions, feel free to reach out.\tBest,The SnabbDeal Team`,
      phone
    );
  } catch (err) {
    console.log(err);
  }
}
