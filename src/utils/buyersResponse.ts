import Stripe from "stripe";
import Session from "../model/session";
export default async function buyersResponse(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  idempotencyKey: string,
): Promise<string | null | undefined> {
  // instantiate Stripe
  const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2024-06-20",
    appInfo: { name: "SnabDeal" },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
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
    return session.url;
  } catch (err) {
    console.log(err);
  }
}
