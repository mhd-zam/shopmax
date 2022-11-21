var db = require('../config/connection')
var ObjectID = require('mongodb').ObjectId
const collections = require('../config/collections');
var userhelper = require('../helpers/users-helper');
const usercartHelper = require('../helpers/usercart-helper');
const couponhelper = require('../helpers/couponhelper');

 
const deletecart = async(req, res, next) => {
   let id = req.session.userdata._id
   let user = req.session.username
   coupon=req.session.coupon
   if (coupon) {
      console.log(req.session.orderid);
      console.log(coupon);
      await couponhelper.insertcoupon2(req.session.orderid, coupon)
      await couponhelper.usercoupon(req.session.userdata._id,coupon.Couponcode)
   }
    db.get().collection(collections.CART).deleteOne({ user: ObjectID(id) }).then(() => {
        res.render('user/thankyou',{user})
   })
     
}

const addtocart = (req, res) => {
   let id = req.query.id
   let userdata = req.session.userdata._id
   userhelper.testaddtocart(id, userdata)
   res.json({status:true})
}
 
const cartpage = async(req, res) => {
   let product = await userhelper.testgetcartproduct(req.session.userdata._id)
   let total;
   if (product.check) {
      product.empty=true
      total = await userhelper.findtotal(req.session.userdata._id)
      
   }
   let user=req.session.username
   res.render('user/cart',{product,user,total})
 }
 
 const removecartproduct = (req, res) => {
   console.log('reached');
    let proid = req.query.id
    console.log(proid);
    let userid = req.session.userdata._id
    console.log(userid);
    
   userhelper.removeproduct(proid,userid).then(() => {
     res.json({status:true})
   
 })
}

const quantity = (req, res) => {
   userhelper.changequantity(req.body).then(async (response) => {
      if (response.removed) {
         res.json(response)
      } else {
         response.total= await userhelper.findtotal(req.session.userdata._id)
         res.json(response)
      }
      
    })
}


module.exports = {
   deletecart,addtocart,cartpage,removecartproduct,quantity
}

