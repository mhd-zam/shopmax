var express = require("express");
var router = express.Router();
var adminhelper = require("../helpers/admin-helper");
var userhelper = require("../helpers/users-helper");
const upload = require("../helpers/upload");
const charthelper = require("../helpers/charthelper");
const paypal = require("../helpers/paypal");
const couponhelper = require("../helpers/couponhelper");
/* GET users listing. */
const loginverify = (req, res,next) => {
  if (req.session.adminlog) {
    next()
  } else {
    res.redirect('/admin/login')
  }
}
const verify = (req, res,next) => {
  if (req.session.adminlog) {
    res.redirect('/admin/')
  } else {
    res.redirect('/admin/login')
  }
}


router.get("/",loginverify, async function (req, res, next) {
  let data = await charthelper.paymentcount();
  value = data.map((value, index, array) => {
    return value.sum;
  });
  let pay = data.map((value, index, array) => {
    return value._id;
  });
  let order = await charthelper.ordercount();
  let count = order.map((value, index, array) => {
    return value.sum;
  });
  let orderdate = order.map((value, index, array) => {
    return value._id;
  });
  let profit = await charthelper.totalprofit();
  let total = await charthelper.totalproduct();
  res.render("admin/index", { value, count, orderdate, pay, total, profit });
});
router.get("/login", (req, res) => {
  res.render("admin/login");
});

router.get("/dailysales", loginverify, (req, res) => {
  
  console.log(req.query);
  adminhelper.getdailysales(req.query.daily).then((daily) => {
    res.render("admin/daily", { daily });
  });
});

router.get("/monthlysales", loginverify, (req, res) => {
  
  adminhelper.getmonthlysales(req.query.monthly).then((monthly) => {

    res.render("admin/monthly", { monthly });
  });
});
router.get("/yearlysales", loginverify, (req, res) => {
  console.log(req.query.year);
  adminhelper.getyearlysales(req.query.year).then((year) => {
    res.render("admin/yearly", { year });
  });
});
router.get("/salesreport", loginverify, (req, res) => {
  adminhelper.getsalesreport().then((daily) => {
    res.render("admin/report",{daily});
  })
});
router.get("/coupon",loginverify, async(req, res) => {
  let value =await couponhelper.getcoupon()
  res.render("admin/coupon",{value});
});

router.get("/addcoupon",loginverify, (req, res) => {

  res.render("admin/addcoupon");
});
router.post('/refund', (req, res) => {
  console.log(req.body);
  let price = parseInt(req.body.offerprice);
  let history = {
    Detail: req.body.productname,
    quantity: req.body.quantity,
    Amount: '+' + price,
    Type: 'Refund',
    Date:new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear(),
  }
      adminhelper.refund(price,req.body.id,history).then(() => {
        adminhelper.changestatus1(req.body.pid, req.body.oid, price).then(() => {
          res.json({ status: true });
        });
      });
})
router.post("/addcoupon", (req, res) => {
  console.log(req.body)
  couponhelper.addcoupon(req.body).then(() => {
    res.json({status:true})
  }).catch(() => {
    res.json({status:true})
  })
  
});
router.post("/login", (req, res) => {
  const data = { email: "mohammedzamil49@gmail.com", password: "123456" };
  if (data.email == req.body.email && data.password == req.body.password) {
    req.session.adminlog=true
    res.redirect("/admin");
  }
});
router.get("/product",loginverify,  function (req, res, next) {
  adminhelper.getproduct().then((data) => {
    res.render("admin/product", { data });
  });
});
router.get("/addproduct",loginverify, function (req, res, next) {
  adminhelper.getcategory().then((data) => {
    res.render("admin/Addproduct", { data });
  });
});

router.post("/addproduct", upload.multipleUpload, function (req, res, next) {
  if (req.files.length == 3) {
    var imageName = req.files.map((value, index, array) => {
      return value.filename;
    });

    var productDetails = req.body;
    productDetails.imagefileName = imageName;

    adminhelper.addproduct(productDetails).then((productDetails) => {
      res.redirect("/admin/product");
    });
  } else {
    res.redirect("/admin/addproduct");
  }
});

router.get("/editproduct",loginverify, (req, res) => {
  adminhelper.getidproduct(req.query.id).then((value) => {
    adminhelper.getcategory().then((data) => {
      res.render("admin/editproduct", { value, data });
    });
  });
});

router.post("/editproduct", upload.multipleUpload, async(req, res) => {
  if (req.files[0]) {
    var imageName = req.files.map((value, index, array) => {
      return value.filename;
    });
    var productDetails = req.body;
    productDetails.imagefileName = imageName;
  } else {
    let value =await adminhelper.getidproduct(req.body.id)
    var productDetails = req.body;
      productDetails.imagefileName = value.imagefileName;
      console.log(productDetails);
  }
console.log(productDetails);

  adminhelper.updateproduct(req.body.id, productDetails).then((response) => {
    res.redirect("/admin/product");
  });
});

router.get("/deleteproduct/:id",loginverify, (req, res) => {
  let id = req.params.id;
  adminhelper.Deleteproduct(id).then(() => {
    res.redirect("/admin/product");
  });
});

router.get("/adminuser",loginverify, function (req, res, next) {
  adminhelper.getData().then((data) => {
    res.render("admin/userdetails", { data });
  });
});
router.get("/category",loginverify, (req, res) => {
  adminhelper.getcategory().then((data) => {
    res.render("admin/category", { data });
  });
});

router.get("/delete/:id",loginverify, (req, res) => {
  let id = req.params.id.toString();
  console.log(id);
  adminhelper.Deletecategory(id).then(() => {
    console.log("hai");
    res.redirect("/admin/category");
  });
});

router.get("/block/:id",loginverify, (req, res) => {
  let id = req.params.id;
  adminhelper.blockuser(id).then(() => {
    res.redirect("/admin/adminuser");
  });
});
router.get("/unblock/:id",loginverify, (req, res) => {
  let id = req.params.id;
  adminhelper.unblockuser(id).then(() => {
    res.redirect("/admin/adminuser");
  });
});

router.get("/editcategory",loginverify, (req, res) => {
 req.session.qid = req.query.id;
  adminhelper.getidcategory(req.session.qid).then((data) => {
    res.render("admin/editcat", { data});
  });
});
router.post("/editcategory/:id", (req, res) => {
  adminhelper.editcatagory(req.params.id, req.body).then(() => {
    res.redirect("/admin/category");
  })
});

router.get("/addcategory", loginverify, (req, res) => {
  let err=req.session.err
  res.render("admin/categoryadd",{err});
});
router.post("/addcategory", (req, res) => {
  adminhelper.createcategory(req.body).then(() => {
    res.redirect("/admin/category");
  }).catch(() => {
    req.session.err = 'category already exsist'
    res.redirect('/admin/addcategory')
  })
});

router.get('/deletecoupon',loginverify, (req, res) => {
  couponhelper.deletecoupon(req.query.id, function test(back) {
    res.redirect('/admin/coupon')
  })
})

router.get('/banner', async(req, res) => {
  let banner = await adminhelper.getallbanner()
  console.log(banner);
  
  res.render('admin/banner',{banner})
})
router.get('/deletebanner', (req, res) => {
  adminhelper.deletebanner(req.query.id).then(() => {
    res.redirect('/admin/banner')
  })
})
router.get('/addbanner', (req, res) => {
  res.render('admin/addbanner')
})
router.post('/addbanner', upload.multipleUpload, (req, res) => {
  console.log(req.files);
  req.body.imagefile=req.files[0].filename
  adminhelper.bannersubmit(req.body).then(() => {
    res.redirect('/admin/banner')
  })
})

router.get("/order",loginverify, async (req, res) => {
  let variable = await adminhelper.findorder();
  res.render("admin/order", { variable });
});

router.get('/orderdetails',loginverify,async (req, res) => {
  let order = await adminhelper.getuserproduct(req.query.id)
  var delivered
 let value=order.forEach((order,index) => {
    if (order.status === 'cancelled') {
      order.cancelled=true
    } else if (order.status === 'Delivered') {
      order.delivered=true
    }else if(order.status==='return inititated'){
      order.refund=true
    }else if(order.status==='refund approved'){
      order.refundapproved=true
    }
  });  
res.render('admin/orderdetails',{order,delivered})
})


router.post("/acancel", (req, res) => {
  console.log(req.body);
  adminhelper.acancelorder(req.body).then(() => {
    res.json({ order: "cancelled" });
  });
});


module.exports = router;
