const Razorpay = require("razorpay");
require('dotenv').config()
var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret:process.env.KEY_SECRET
});

module.exports = {
  generateRazorpay: (orderid, total) => {
    return new Promise((resolve, reject) => {
      var options = {
        amount: total, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderid,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log("erris" + err);
        } else {
          console.log(order);
          resolve(order);
        }
      });
    });
  },
  evaluatepayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      const hmac = crypto
        .createHmac("sha256", "cOt8exaGaVIkVafYE42cublP")
        .update(
          details["payment[razorpay_order_id]"] +
            "|" +
            details["payment[razorpay_payment_id]"]
        )
        .digest("hex");
      if (hmac == details["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject('payment failed');
      }
    });
  },
};
