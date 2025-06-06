require("dotenv").config();
const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

async function sendSMS(toPhoneNumber, message) {
  const from = "Skipli";
  await vonage.sms
    .send({ to: toPhoneNumber, from, text: message })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
}

module.exports = { sendSMS };
