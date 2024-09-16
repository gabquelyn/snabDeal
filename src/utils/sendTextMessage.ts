import twilio from "twilio";
import dotenv from "dotenv";
import * as api from "clicksend/api";
dotenv.config();

export default async function sendTextMessage(body: string, to: string) {
  const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!);
  const smsMessage = new api.SmsMessage();
  smsMessage.from = process.env.CLICKSEND_NUMBER;
  smsMessage.to = to;
  smsMessage.body = body;
  const smsApi = new api.SMSApi(
    process.env.CLICKSEND_USERNAME!,
    process.env.CLICKSEND_API_KEY!
  );

  const smsCollection = new api.SmsMessageCollection();
  smsCollection.messages = [smsMessage];
  smsApi
    .smsSendPost(smsCollection)
    .then((res: Record<string, any>) => {
      console.log(res);
    })
    .catch((err: any) => {
      console.log(err);
    });
}
