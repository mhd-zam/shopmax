const Razorpay = require("../helpers/Razorpay");
const userhelper = require("../helpers/users-helper");

module.exports = {
  paymentpage: async (req, res) => {
    let address = req.session.address;
    let uid = req.session.userdata._id;
        let checkout = await userhelper.getcheckoutproduct(uid);
        let total = await userhelper.findtotal(uid);
    if (checkout[0].coupon) {
      for (i = 0; i < checkout.length; i++) {
        checkout[i].gtotal = checkout[i].gtotal-Math.round((checkout[i].gtotal * checkout[i].coupon.Percentage) / 100)
        }
        total=total- Math.round((total*checkout[0].coupon.Percentage)/100)  
    }
    let user = req.session.username;
    res.render("user/payment", { checkout, total, address, user });
  },

  paymentverify: (req, res) => {
    console.log(req.body);
    Razorpay.evaluatepayment(req.body)
      .then(() => {
        userhelper.changestatus(req.body["order[receipt]"]).then(() => {
          res.json({ status: true });
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false });
      });
  },
};
