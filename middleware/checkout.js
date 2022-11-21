var userhelper = require("../helpers/users-helper");
var razorpay = require("../helpers/Razorpay");
var usercarthelper = require("../helpers/usercart-helper");
const paypal = require("../helpers/paypal");
const { response } = require("../app");
const couponhelper = require("../helpers/couponhelper");

const checkoutget = async (req, res) => {
  let uid = req.session.userdata._id;
  let check = await usercarthelper.cartexsist(uid);
  if (check.product.length > 0) {
    let checkout = await userhelper.getcheckoutproduct(uid);
    let total = await userhelper.findtotal(uid);
    if (req.query.id) {
      let coupon = await couponhelper.getcouponid(req.query.id);
      req.session.coupon = coupon;
      couponhelper.insertcoupon(uid, coupon);
      for (i = 0; i < checkout.length; i++) {
        checkout[i].gtotal = Math.round(
          checkout[i].gtotal - (checkout[i].gtotal * coupon.Percentage) / 100
        );
      }
      total = total - Math.round((total * coupon.Percentage) / 100);
    } else {
      couponhelper.removecoupon(uid).then(() => {
        console.log("success");
      });
    }

    let address = await userhelper.findaddress(uid);
    let otheradd = await userhelper.otheraddress(uid);
    console.log(otheradd);
    let user = req.session.username;
    res.render("user/checkout1", { checkout, uid, user, total, address, otheradd });
  } else {
    res.redirect("/cart");
  }
};

const checkoutpost = async (req, res) => {
  let orderdetail = req.session.address;
  orderdetail.Typeofpayment = req.body.Typeofpayment;
  orderdetail.userid = req.session.userdata._id;
  orderdetail.total = req.body.total;
  const Total = parseInt(req.body.total) * 100;
  await userhelper.addaddress(req.session.address);
  let userid = req.session.userdata._id;
  let product = await userhelper.getproductid(userid);
  if (req.session.coupon) {
    let coupon = req.session.coupon;
    for (i = 0; i < product.length; i++) {
      product[i].total = Math.round(
        product[i].total - (product[i].total * coupon.Percentage) / 100
      );
    }
  }
  userhelper.checkoutdetail(orderdetail, product).then(async (orderid) => {
    req.session.orderid = orderid;
    console.log("total");
    req.session.oid = orderid;
    if (req.body.Typeofpayment == "COD") {
      res.json({ codsuccess: "true" });
    } else if (req.body.Typeofpayment == "RAZORPAY") {
      razorpay.generateRazorpay(orderid, Total).then((response) => {
        console.log('dskjhgfhdghjdghjsfdghjdfhjdfghjdgjghj');
        
        console.log(response);
        response.razorsuccess = true;
        response.address = req.session.address;
        res.json(response);
      });
    } else if (req.body.Typeofpayment == "PAYPAL") {
      let orderitem = await userhelper.getpaypalproduct(orderid);
      let value = orderitem.reduce(function (accumulator, Value) {
        return accumulator + Value.price * Value.quantity;
      }, 0);
      req.session.total = value;
      paypal.paypalpayment(orderitem, value).then((payment) => {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.json(payment.links[i].href);
          }
        }
      });
    } else if (req.body.Typeofpayment == "WALLET") {
      let amount=Total/100
      let history = {
        Detail:'orderid'+ orderid,
        Amount: '-'+ amount,
        Type: 'Purchase',
        Date:new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear(),
      }
      usercarthelper
        .findwallet(req.session.userdata._id, Total,history)
        .then(() => {
          res.json({ wallet: true });
        })
        .catch(() => {
          res.json({ wallet: true, message: "insufficient balance" });
        });
    }
  });


};

const errorpage=(req, res) => {
  userhelper.removeorder().then(() => {
    res.render("user/paymenterror");
  })
}

const editaddress = (req, res) => {
  console.log(req.query.addid);
  userhelper.editaddress(req.query.addid).then((address) => {
    console.log(address);
    res.json(address)
  })
  
}


const seteditaddress = (req, res) => {
  console.log(req.body);
  userhelper.seteditaddress(req.session.userdata._id,req.body).then(() => {
    res.json({status:true})
  })
}

module.exports = {
  checkoutpost,
  checkoutget,
  errorpage,
  editaddress,
  seteditaddress
};
