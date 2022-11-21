const adminHelper = require("../helpers/admin-helper");
var userhelper = require("../helpers/users-helper");

module.exports = {
  ordercancel: (req, res) => {
    console.log(req.query);
    if (req.query.paymentmethod === "COD") {
      userhelper.cancelorder(req.query.orderid, req.query.proid,req.query.change).then(() => {
        res.json({ order: "cancelled" });
      });
    } else {
      let price = parseInt(req.query.total);
      let history = {
        Detail: req.query.productname,
        quantity: req.query.quantity,
        Amount: '+'+price,
        Type: 'Refund',
        Date:new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear(),
      }
      adminHelper.refund(price, req.session.userdata._id,history).then(() => {
        adminHelper.changestatus(req.query.proid, req.query.orderid, price).then(() => {
          res.json({ status: true });
        });
      });
    }
  },
  returnstatus: (req, res) => {
    userhelper.cancelorder(req.query.orderid, req.query.proid,req.query.change).then(() => {
      res.json({ order: "returned" });
    });
  },

  orders: async (req, res) => {
    let uid = req.session.userdata._id;
    let order = await userhelper.order(uid);
    let user = req.session.username;
    res.render("user/ordertest", { order, user });
  },

  ordermain: async (req, res) => {
    let user = req.session.username;
    let id = req.params.id;
    let orderdetail = await userhelper.getorderproduct(id);
    orderdetail.forEach((orderdetail) => {
      if (orderdetail.status === "cancelled") {
        orderdetail.cancelled = true;
      }
      if (orderdetail.status === "Delivered") {
        orderdetail.delivered = true;
      }
      if (orderdetail.status === "refund approved") {
        orderdetail.refund = true;
      }if (orderdetail.status === "return inititated") {
        orderdetail.return = true;
      }
    });
    console.log(orderdetail);
    res.render("user/orderdetail", { orderdetail, user });
  },

  addaddress: (req, res) => {
    req.session.address = req.body;
    res.json({ status: true });
  },

  defaultaddress: async (req, res) => {
    console.log(req.body.id);
    console.log("hao");
    req.session.address = await userhelper.oneaddress(req.body.id);

    res.json({ status: true });
  },
};
