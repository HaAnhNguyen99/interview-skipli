require("dotenv").config();
const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

/**
 * Hàm gửi SMS (text) tới số điện thoại
 * @param {string} toPhoneNumber - số điện thoại đích (định dạng quốc tế, ví dụ: 849xxxxxxxx cho Việt Nam)
 * @param {string} message - nội dung tin nhắn
 */
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
  //   return new Promise((resolve, reject) => {
  //     vonage.sms.send(
  //       { to: toPhoneNumber, from, text: message },
  //       (err, responseData) => {
  //         if (err) {
  //           console.error("Vonage Error:", err);
  //           reject(err);
  //         } else if (responseData.messages[0].status !== "0") {
  //           console.error(
  //             "Vonage Status Error:",
  //             responseData.messages[0]["error-text"]
  //           );
  //           reject(responseData.messages[0]["error-text"]);
  //         } else {
  //           console.log("Vonage SMS Sent:", responseData);
  //           resolve(responseData);
  //         }
  //       }
  //     );
  //   });
}

module.exports = { sendSMS };
