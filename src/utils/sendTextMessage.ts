import dotenv from "dotenv";
import * as api from "clicksend";
dotenv.config();

export default async function sendTextMessage(body: string, to: string) {
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
    .then((data) => {
      console.log("Success", data);
    })
    .catch((err) => {
      console.log(err);
    });
}
