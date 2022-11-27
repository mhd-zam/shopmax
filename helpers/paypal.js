var paypal = require("paypal-rest-sdk");
require('dotenv').config()
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.CLIENT_ID,
  'client_secret':process.env.CLIENT_SECRET
});
module.exports = {
  paypalpayment: (order, totalall) => {
   totalall=parseInt(totalall)
    return new Promise((resolve, reject) => {
      var create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:3000/paypalsuccess",
          cancel_url: "http://localhost:3000/paymentfailed",
        },
        transactions: [
          {
            item_list: {
              items: order,
            },
            amount: {
              currency: "USD",
              total: totalall,
            },
            description: "This is the payment description.",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          console.log(payment);
          resolve(payment);
        }
      });
    });
  },
  paypalconfirmation: (req, res, next) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const total = parseInt(req.session.total) 
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: total,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          next();
        }
      }
    );
  },
};
