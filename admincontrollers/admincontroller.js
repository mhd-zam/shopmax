const express = require("express");
const {
  paymentcount,
  ordercount,
  totalprofit,
  totalproduct,
} = require("../helpers/charthelper");
const {
  getsalesreport,
  getyearlysales,
  getmonthlysales,
  getdailysales,
  getData,
  getcategory,
  Deletecategory,
  blockuser,
  unblockuser,
  getidcategory,
  editcatagory,
  createcategory,
  getallbanner,
  deletebanner,
  editbanner,
  editbannerwithout,
  updateoneimg,
  updatetwoimg,
  updateallimg,
  bannersubmit,
  findorder,
  getuserproduct,
  acancelorder,
  getproduct,
  addproduct,
  refund,
  changestatus1,
  getidproduct,
  updateproduct,
  Deleteproduct
} = require("../helpers/admin-helper");
const { getcoupon,addcoupon,deletecoupon } = require("../helpers/couponhelper");

module.exports = {
  home: async function (req, res, next) {
    let data = await paymentcount();
    value = data.map((value, index, array) => {
      return value.sum;
    });
    let pay = data.map((value, index, array) => {
      return value._id;
    });

    let order = await ordercount();
    let count = order.map((value, index, array) => {
      return value.sum;
    });

    let orderdate = order.map((value, index, array) => {
      return value._id;
    });
    console.log('djnhkfdkjsfdkjhfdkjhdfkjhdfskjhbfdkj');
    console.log(count);
    console.log(orderdate);
    
    let profit = await totalprofit();
    let total = await totalproduct();
    res.render("admin/index", { value, count, orderdate, pay, total, profit });
  },
  login: (req, res) => {
    res.render("admin/login");
  },
  loginpost: (req, res) => {
    
    if (process.env.EMAIL == req.body.email && process.env.PASSWORD == req.body.password) {
      req.session.adminlog = true;
      res.redirect("/admin");
    }
  },
  dailysales: (req, res) => {
    console.log(req.query);
    getdailysales(req.query.daily).then((daily) => {
      res.render("admin/daily", { daily });
    });
  },
  monthlysales: (req, res) => {
    getmonthlysales(req.query.monthly).then((monthly) => {
      res.render("admin/monthly", { monthly });
    });
  },
  yearlysales: (req, res) => {
    console.log(req.query.year);
    getyearlysales(req.query.year).then((year) => {
      res.render("admin/yearly", { year });
    });
  },
  salesreport: (req, res) => {
    getsalesreport().then((daily) => {
      res.render("admin/report", { daily });
    });
  },
  couponpage: async (req, res) => {
    let value = await getcoupon();
    res.render("admin/coupon", { value });
  },
  addcoupon: (req, res) => {
    res.render("admin/addcoupon");
  },

  refund: (req, res) => {
    console.log(req.body);
    let price = parseInt(req.body.offerprice);
    let history = {
      Detail: req.body.productname,
      quantity: req.body.quantity,
      Amount: "+" + price,
      Type: "Refund",
      Date:
        new Date().getDate() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getFullYear(),
    };
    refund(price, req.body.id, history).then(() => {
     changestatus1(req.body.pid, req.body.oid, price).then(() => {
        res.json({ status: true });
      });
    });
  },

  addcouponpost: (req, res) => {
      addcoupon(req.body)
      .then(() => {
        res.json({ status: true });
      })
      .catch((response) => {
        res.json(response);
      });
  },
  product: function (req, res, next) {
    getproduct().then((data) => {
      res.render("admin/product", { data });
    });
  },
  addproduct: function (req, res, next) {
    getcategory().then((data) => {
      let err=req.session.error
      res.render("admin/addproduct", { data, err });
      req.session.error=null
    });
  },

  addproductpost: function (req, res, next) {
    if (req.files.length == 3) {
      var imageName = req.files.map((value, index, array) => {
        return value.filename;
      });

      var productDetails = req.body;
      productDetails.imagefileName = imageName;

     addproduct(productDetails).then((productDetails) => {
        res.redirect("/admin/product");
      });
    } else {
       req.session.error='3 images required'
      res.redirect("/admin/addproduct");
    }
  },

  editproductget: (req, res) => {
    getidproduct(req.query.id).then((value) => {
      getcategory().then((data) => {
        res.render("admin/editproduct", { value, data });
      });
    });
  },

  editproductpost: async (req, res) => {
    if (req.files[0]) {
      var imageName = req.files.map((value, index, array) => {
        return value.filename;
      });
      var productDetails = req.body;
      productDetails.imagefileName = imageName;
    } else {
      let value = await getidproduct(req.body.id);
      var productDetails = req.body;
      productDetails.imagefileName = value.imagefileName;
      console.log(productDetails);
    }
    console.log(productDetails);

   updateproduct(req.body.id, productDetails).then((response) => {
      res.redirect("/admin/product");
    });
  },

  deleteproduct: (req, res) => {
    let id = req.params.id;
    Deleteproduct(id).then(() => {
      res.redirect("/admin/product");
    });
  },

  userlistpage: function (req, res, next) {
    getData().then((data) => {
      res.render("admin/userdetails", { data });
    });
  },

  category: (req, res) => {
    getcategory().then((data) => {
      res.render("admin/category", { data });
    });
  },

  deletecat: (req, res) => {
    let id = req.params.id.toString();
    console.log(id);
    Deletecategory(id).then(() => {
      console.log("hai");
      res.redirect("/admin/category");
    });
  },
  block: (req, res) => {
    let id = req.params.id;
    blockuser(id).then(() => {
      res.redirect("/admin/adminuser");
    });
  },
  unblock: (req, res) => {
    let id = req.params.id;
    unblockuser(id).then(() => {
      res.redirect("/admin/adminuser");
    });
  },
  editcategory: (req, res) => {
    req.session.qid = req.query.id;
    getidcategory(req.session.qid).then((data) => {
      res.render("admin/editcat", { data });
    });
  },
  editcategorypost: (req, res) => {
    editcatagory(req.params.id, req.body).then(() => {
      res.redirect("/admin/category");
    });
  },
  addcategory: (req, res) => {
    let err = req.session.err;
    res.render("admin/categoryadd", { err });
    req.session.err=null
  },
  addcategorypost: (req, res) => {
    createcategory(req.body)
      .then(() => {
        res.redirect("/admin/category");
      })
      .catch(() => {
        req.session.err = "category already exsist";
        res.redirect("/admin/addcategory");
      });
  },
  deletecoupon: (req, res) => {
    deletecoupon(req.query.id, function test(back) {
      res.redirect("/admin/coupon");
    });
  },
  bannerpage: async (req, res) => {
    let banner = await getallbanner();
    console.log(banner);
    res.render("admin/banner", { banner });
  },
  deletebanner: (req, res) => {
    deletebanner(req.query.id).then(() => {
      res.redirect("/admin/banner");
    });
  },
  editbanner: (req, res) => {
    editbanner(req.query.id).then((editdata) => {
      res.render("admin/editbanner", { editdata });
    });
  },
  editbannerpost: (req, res) => {
    if (req.files.length == 0) {
      editbannerwithout(req.body).then((response) => {
        redir();
      });
    } else if (req.files.length == 1) {
      let img = req.files[0].filename;
      updateoneimg(req.body, img).then((re) => {
        redir();
      });
    } else if (req.files.length == 2) {
      let img = req.files.map((value) => {
        return value.filename;
      });

      updatetwoimg(req.body, img).then((re) => {
        redir();
      });
    } else if (req.files.length == 3) {
      let img = req.files.map((value) => {
        return value.filename;
      });

      updateallimg(req.body, img).then((re) => {
        redir();
      });
    }

    function redir() {
      res.redirect("/admin/banner");
    }
  },
  addbanner: (req, res) => {
    let err=req.session.bannererror
    res.render("admin/addbanner",{err});
    req.session.bannererror=null
  },
  addbannerpost: (req, res) => {
    if (req.files.length == 3) {
      let image = req.files.map((value, index, array) => {
        return value.filename;
      });
      req.body.imagefile = image;
      bannersubmit(req.body).then(() => {
        res.redirect("/admin/banner");
      });
    } else {
      req.session.bannererror='3 image required'
      res.redirect('/admin/addbanner')
    }
   
  },
  orderpage: async (req, res) => {
    let variable = await findorder();
    res.render("admin/order", { variable });
  },
  orderdetailpage: async (req, res) => {
    let order = await getuserproduct(req.query.id);
    var delivered;
    let value = order.forEach((order, index) => {
      if (order.status === "cancelled") {
        order.cancelled = true;
      } else if (order.status === "Delivered") {
        order.delivered = true;
      } else if (order.status === "return inititated") {
        order.refund = true;
      } else if (order.status === "refund approved") {
        order.refundapproved = true;
      }
    });
    res.render("admin/orderdetails", { order, delivered });
  },
  ordercancel: (req, res) => {
    console.log(req.body);
    acancelorder(req.body).then(() => {
      res.json({ order: "cancelled" });
    });
  },
  logout: (req, res) => {
    req.session.adminlog = null;
    res.redirect("/admin/login");
  },
};
