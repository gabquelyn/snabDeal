import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

export default async function sendTextMessage(body: string, to: string) {
  const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!);
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

sendTextMessage("Hello", "+2349039099172");
