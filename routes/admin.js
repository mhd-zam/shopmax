var express = require("express");
var router = express.Router();
const upload = require("../helpers/upload");
const {
  home,
  login,
  dailysales,
  monthlysales,
  yearlysales,
  salesreport,
  couponpage,
  addcoupon,
  refund,
  addcouponpost,
  loginpost,
  product,
  addproduct,
  addproductpost,
  editproductget,
  editproductpost,
  deleteproduct,
  userlistpage,
  deletecat,
  category,
  block,
  unblock,
  editcategory,
  editcategorypost,
  addcategory,
  addcategorypost,
  deletecoupon,
  bannerpage,
  deletebanner,
  editbannerpost,
  addbanner,
  addbannerpost,
  orderpage,
  orderdetailpage,
  ordercancel,
  logout,
  editbanner,
} = require("../admincontrollers/admincontroller");
/* GET users listing. */

const loginverify = (req, res, next) => {
  if (req.session.adminlog) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};
const verify = (req, res, next) => {
  if (req.session.adminlog) {
    res.redirect("/admin/");
  } else {
    res.redirect("/admin/login");
  }
};

router.get("/", loginverify, home);

router.route("/login").get(login).post(loginpost);

router.get("/dailysales", loginverify, dailysales);

router.get("/monthlysales", loginverify, monthlysales);

router.get("/yearlysales", loginverify, yearlysales);

router.get("/salesreport", loginverify, salesreport);

router.get("/coupon", loginverify, couponpage);

router.route("/addcoupon").get(loginverify, addcoupon).post(addcouponpost);

router.post("/refund", refund);

router.get("/product", loginverify, product);


router.route('/addproduct').get(loginverify,addproduct).post(upload.multipleUpload, addproductpost);

router.route('/editproduct').get(loginverify,editproductget).post(upload.multipleUpload,editproductpost)

router.get("/deleteproduct/:id",loginverify,deleteproduct);

router.get("/adminuser", loginverify, userlistpage);

router.get("/category", loginverify,category);

router.get("/delete/:id",loginverify,deletecat);

router.get("/block/:id",loginverify,block);

router.get("/unblock/:id", loginverify,unblock);

router.get("/editcategory", loginverify,editcategory);
router.post("/editcategory/:id", editcategorypost);

router.get("/addcategory", loginverify, addcategory);

router.post("/addcategory",addcategorypost);

router.get("/deletecoupon", loginverify,deletecoupon);

router.get("/banner", loginverify, bannerpage);

router.get("/deletebanner", deletebanner);

router.get("/editbanner", loginverify,editbanner);

router.post("/editbanner", upload.multipleUpload,editbannerpost);

router.get("/addbanner", loginverify, addbanner);

router.post("/addbanner",upload.multipleUpload,addbannerpost);

router.get("/order", loginverify, orderpage);

router.get("/orderdetails", loginverify, orderdetailpage);

router.post("/acancel", ordercancel);

router.get('/logout', logout)

module.exports = router;
