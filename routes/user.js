var express = require("express");
var router = express.Router();
var verification = require("../usercontrollers/verification");
var otp = require("../usercontrollers/phoneotp");
var home = require("../usercontrollers/home");
var shop = require("../usercontrollers/shop");
var shopsingle = require("../usercontrollers/shopsingle");
var order = require("../usercontrollers/order");
var payment = require("../usercontrollers/payment");
var userhelper = require("../helpers/users-helper");
var cart = require("../usercontrollers/user-cart");
var check = require("../usercontrollers/checkout");
const session = require("express-session");
const paypal = require("../helpers/paypal");
const profile = require("../usercontrollers/profile");
const couponhelper = require("../helpers/couponhelper");
const userwishlist = require("../helpers/userwishlist");
const useracct = require("../helpers/useracct");
const pagination = require("../usercontrollers/pagination");

/* GET home page. */
let verifyauth = (req, res, next) => {
  if (req.session.log) {
    res.redirect("/");
  } else {
    next();
  }
};

let insideverify = (req, res, next) => {
  req.session.returnToUrl = req.originalUrl;
  if (req.session.log) {
    next();
  } else {
    res.redirect("/login");
  }
};

//signup routes//
router
  .route("/signup")
  .get(verifyauth, verification.signupget)
  .post(verification.signuppost);

//login route//
router
  .route("/login")
  .get(verifyauth, verification.loginget)
  .post(verification.loginpost);

//otp routes//
router
  .route("/otp-phone")
  .get(verifyauth, otp.phonenumberget)
  .post(otp.phonenumberpost);

router
  .route("/login-otp")
  .get(verifyauth, otp.otppageget)
  .post(otp.otppagepost);

/*logout*/
router.route("/logout").get(verification.logout);
/* home route */
router.route("/").get(home.homepage);

/*route shop*/
router.route("/shop").get(shop.shoppage);

router.route("/shop-single").get(shopsingle.shopsingle);

//cart route//

router.route("/addtocart").get(insideverify, cart.addtocart);

/*wishlist*/
router.route("/addwishlist").post((req, res) => {
  userwishlist.addwishlist(req.session.userdata._id, req.query.id);
  res.json({ status: true });
});

router.route("/removewishlist").post((req, res) => {
  userwishlist.removewishlist(req.session.userdata._id, req.query.id);
  res.json({ status: true });
});
router.route("/wishlist").get(insideverify, async (req, res) => {
  let orderdetail = await userwishlist.getwishlist(req.session.userdata._id);

  console.log(orderdetail);
  let user=req.session.username
  res.render("user/wishlist", { orderdetail ,user});
});

//user page//
router.route("/userprofile").get(insideverify, profile.userpage);

router.route("/updateuser").post(profile.updateuser);

router.route("/wallet").get(insideverify, async (req, res) => {
  let userid = req.session.userdata._id;
  let wallet = await useracct.userwallet(userid);
  let user=req.session.username
  res.render("user/wallet", { wallet,user });
});

router.route("/changepassword").post(profile.changepassword);

router
  .route("/cart")
  .get(insideverify, cart.cartpage)
  .post(insideverify, async (req, res) => {
    console.log(req.body);
  });
/*coupon*/
router.route("/checkcoupon").post((req, res) => {
  couponhelper
    .testcoupon(req.body, req.session.userdata._id)
    .then((response) => {
      (response.status = true), res.json(response);
    })
    .catch((response) => {
      res.json({ status: false, message: response.message });
    });
});

router.route("/remove-product").get(cart.removecartproduct);

router.route("/quantitychange").post(cart.quantity);

/*checkout*/

router
  .route("/checkout")
  .get(insideverify, check.checkoutget)
  .post(check.checkoutpost);

router.route("/cartcount").get(cart.cartcount)


router
  .route("/payment")
  .get(insideverify, payment.paymentpage)
  .post(check.checkoutpost);

router.route("/paymentverify").post(payment.paymentverify);

router.route("/paypalsuccess").get(paypal.paypalconfirmation, (req, res) => {
  userhelper.changestatus(req.session.oid).then(() => {
    res.redirect("/success");
  });
});
router.route("/editaddress").get(check.editaddress).post(check.seteditaddress);

router.get("/success", cart.deletecart);

//order routes//

router.route("/cancel").get(order.ordercancel);
router.route("/return").get(order.returnstatus);

router.route("/orderdetails/:id").get(insideverify, order.ordermain);

router.route("/order").get(insideverify, pagination.pagination, order.orders);

router.route("/addaddress").post(order.addaddress);

router.route("/defaultaddress").post(order.defaultaddress);
//error page
router.route("/paymentfailed").get(check.errorpage);

module.exports = router;
