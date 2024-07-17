import twilio from "twilio";
const client = twilio(process.env.TWILIO_SI, process.env.TWILIO_AUTH);
export default async function sendTextMessage(body: string, to: string) {
  try {
    const res = await client.messages.create({
      body,
      to,
      from: process.env.TWILIO_NUMBER!,
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}
