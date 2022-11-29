const db = require("../config/connection");
const bcrypt = require("bcrypt");
const collections = require("../config/collections");
const ObjectID = require("mongodb").ObjectId;
let referralCodeGenerator = require("referral-code-generator");

module.exports = {
  doSignup: (userdata) => {
    let quary = {};
    return new Promise(async (resolve, reject) => {
      userdata.password = await bcrypt.hash(userdata.password, 10);
      db.get()
        .collection(collections.USER_COLLECTIONS)
        .findOne({ email: userdata.email })
        .then((response) => {
          if (response) {
            quary.message = "Email already exsist";
            quary.status = false;
            resolve(quary);
          } else {
            db.get()
              .collection(collections.USER_COLLECTIONS)
              .findOne({ pname: userdata.pname })
              .then((back) => {
                if (back) {
                  quary.message = "Phonenumber already exsist";
                  quary.status = false;
                  resolve(quary);
                } else {
                  if (userdata.referaluse) {
                    /*referal used*/
                    db.get()
                      .collection(collections.USER_COLLECTIONS)
                      .findOne({ referal: userdata.referaluse })
                      .then((response) => {
                        let otheruser = response;
                        console.log(otheruser);

                        if (response) {
                          /*if referal exsist*/
                          userdata.referal = referralCodeGenerator.alpha(
                            "uppercase",
                            7
                          );
                          db.get()
                            .collection(collections.USER_COLLECTIONS)
                            .insertOne(userdata)
                            .then((response) => {
                              let wallet = {
                                userid: ObjectID(response.insertedId),
                                walletAmt: 500,
                                history: [
                                  {
                                    Type: "Referal",
                                    Date:
                                      new Date().getDate() +
                                      "-" +
                                      (new Date().getMonth() + 1) +
                                      "-" +
                                      new Date().getFullYear(),
                                    Amount: "+" + "500",
                                    Detail: otheruser.referal,
                                  },
                                ],
                                date: new Date(),
                              };
                              db.get()
                                .collection(collections.WALLET)
                                .insertOne(wallet)
                                .then(() => {
                                  console.log("hai");
                                  console.log(otheruser._id);
                                  let data = {
                                    Type: "Referal",
                                    Date:
                                      new Date().getDate() +
                                      "-" +
                                      (new Date().getMonth() + 1) +
                                      "-" +
                                      new Date().getFullYear(),
                                    Amount: "+" + "1000",
                                    Detail: userdata.fname,
                                  };
                                  db.get()
                                    .collection(collections.WALLET)
                                    .updateOne(
                                      { userid: otheruser._id },
                                      {
                                        $inc: { walletAmt: 1000 },
                                        $push: { history: data },
                                      }
                                    );
                                  db.get()
                                    .collection(collections.WISHLIST)
                                    .insertOne({
                                      userid: ObjectID(response.insertedId),
                                      item: [],
                                    })
                                    .then(() => {
                                      quary.status = true;
                                      quary.message = "";
                                      resolve(quary);
                                    });
                                });
                            });
                        } else {
                          /*if referal wrong*/
                          reject();
                        }
                      });
                  } else {
                    /*if referal not used*/
                    userdata.referal = referralCodeGenerator.alpha(
                      "uppercase",
                      7
                    );
                    db.get()
                      .collection(collections.USER_COLLECTIONS)
                      .insertOne(userdata)
                      .then((response) => {
                        let wallet = {
                          userid: ObjectID(response.insertedId),
                          walletAmt: 0,
                          history: [],
                          date: new Date(),
                        };
                        db.get()
                          .collection(collections.WALLET)
                          .insertOne(wallet);
                        db.get()
                          .collection(collections.WISHLIST)
                          .insertOne({
                            userid: ObjectID(response.insertedId),
                            item: [],
                          })
                          .then(() => {
                            quary.status = true;
                            quary.message = "";
                            resolve(quary);
                          });
                      });
                  }
                }
              });
          }
        });
    });
  },
  finduser: (phone) => {
    return new Promise(async (resolve, reject) => {
      let value = await db
        .get()
        .collection(collections.USER_COLLECTIONS)
        .findOne({ pname: phone });
      resolve(value);
    });
  },

  doLogin: (userData) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTIONS)
        .findOne({ pname: userData.pname })
        .then((user) => {
          if (user) {
            bcrypt.compare(userData.password, user.password).then((data) => {
              if (data) {
                resolve(user);
              } else {
                user.status = true;
                user.message = "incorrect password";
                resolve(user);
              }
            });
          } else {
            let response = {};
            response.message = "Phonenumber not found";
            response.status = true;
            resolve(response);
          }
        });
    });
  },
  doOTP: (phnum) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let userNum = await db
        .get()
        .collection(collections.USER_COLLECTIONS)
        .findOne({ pname: phnum });
      if (userNum) {
        response = userNum;
        response.status = true;
        console.log(response);
        resolve(response);
      } else {
        response.status = false;
        resolve(response);
      }
    });
  },
  getproduct: () => {
    return new Promise((resolve, reject) => {
      let product = db.get().collection(collections.PRODUCT).find().toArray();
      resolve(product);
    });
  },
  getidProduct: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT)
        .findOne({ _id: ObjectID(id) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  testaddtocart: (id, userdata) => {
    let cpro = {
      proid: ObjectID(id),
      quantity: 1,
      time: new Date().getTime(),
    };
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collections.CART)
        .findOne({ user: ObjectID(userdata) });
      if (user) {
        let proexist = user.product.findIndex((produt) => produt.proid == id);
        if (proexist == -1) {
          db.get()
            .collection(collections.CART)
            .updateOne(
              { user: ObjectID(userdata) },
              { $push: { product: cpro } }
            )
            .then(() => {
              db.get().collection(collections.PRODUCT).updateOne({ _id: ObjectID(id) }, { $inc: { stock: -1 } }).then(() => {
                resolve();
              })
            });
        } else {
          resolve();
        }
      } else {
        let cartdata = {
          user: ObjectID(userdata),
          product: [cpro],
        };

        db.get()
          .collection(collections.CART)
          .insertOne(cartdata)
          .then((response) => {
            resolve();
          });
      }
    });
  },
  removeproduct: (id, userid,qty) => {
    return new Promise(async (resolve, reject) => {
      qty=parseInt(qty)
      db.get()
        .collection(collections.CART)
        .updateOne(
          { user: ObjectID(userid) },
          { $pull: { product: { proid: ObjectID(id) } } }
        )
        .then((response) => {
          db.get().collection(collections.PRODUCT).updateOne({ _id: ObjectID(id) }, { $inc: { stock: qty } }).then(() => {
            resolve();
          })
        });
    });
  },

  // testgetcartproduct: (userid) => {
  //   let response={}
  //   return new Promise(async (resolve, reject) => {
  //     let user = await db.get().collection(collections.CART).findOne({ user: ObjectID(userid) })
  //     if (user) {
  //       let usercart = await db.get().collection(collections.CART).aggregate([{ $match: { user: ObjectID(userid) } },
  //         { $unwind: '$product' },
  //         { $project: { proid: '$product.proid', quantity: '$product.quantity', time: '$product.time' } },
  //         { $lookup: { from: collections.PRODUCT, localField: 'proid', foreignField: '_id', as: 'cartitem' } },
  //         { $project: { proid: 1, quantity: 1, time: 1, product: { $arrayElemAt: ['$cartitem', 0] } } }, { $sort: { time: -1 } }]).toArray()
  //       // console.log(usercart)
  //      resolve(usercart)
  //     } else {
  //      response.empty=true
  //      resolve(response)
  //       }

  //   })
  // },
  testgetcartproduct: (userid) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collections.CART)
        .findOne({ user: ObjectID(userid) });
      if (user) {
        if (user.product.length > 0) {
          let usercart = await db
            .get()
            .collection(collections.CART)
            .aggregate([
              { $match: { user: ObjectID(userid) } },
              { $unwind: "$product" },
              {
                $project: {
                  proid: "$product.proid",
                  quantity: "$product.quantity",
                  time: "$product.time",
                },
              },
              {
                $lookup: {
                  from: collections.PRODUCT,
                  localField: "proid",
                  foreignField: "_id",
                  as: "cartitem",
                },
              },
              {
                $project: {
                  proid: 1,
                  quantity: 1,
                  time: 1,
                  product: { $arrayElemAt: ["$cartitem", 0] },
                },
              },
              {
                $project: {
                  proid: 1,
                  quantity: 1,
                  time: 1,
                  product: 1,
                  gtotal: {
                    $sum: { $multiply: ["$quantity", "$product.offerprice"] },
                  },
                },
              },
            ])
            .toArray();

          usercart.check = true;
          resolve(usercart);
        } else {
          response.empty = false;
          response.check = false;
          resolve(response);
        }
      } else {
        response.empty = false;
        response.check = false;
        resolve(response);
      }
    });
  },

  getcheckoutproduct: (userid) => {
    return new Promise(async (resolve, reject) => {
      let checkout = await db
        .get()
        .collection(collections.CART)
        .aggregate([
          { $match: { user: ObjectID(userid) } },
          { $unwind: "$product" },
          {
            $project: {
              coupon: 1,
              proid: "$product.proid",
              quantity: "$product.quantity",
              time: "$product.time",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCT,
              localField: "proid",
              foreignField: "_id",
              as: "cartitem",
            },
          },
          {
            $project: {
              coupon: 1,
              proid: 1,
              quantity: 1,
              time: 1,
              product: { $arrayElemAt: ["$cartitem", 0] },
            },
          },
          {
            $project: {
              coupon: 1,
              proid: 1,
              quantity: 1,
              time: 1,
              product: 1,
              gtotal: {
                $sum: { $multiply: ["$quantity", "$product.offerprice"] },
              },
            },
          },
        ])
        .toArray();
      console.log(checkout);
      resolve(checkout);
    });
  },
  getproductid: (userid) => {
    return new Promise(async (resolve, reject) => {
      let proid1 = await db
        .get()
        .collection(collections.CART)
        .aggregate([
          { $match: { user: ObjectID(userid) } },
          { $unwind: "$product" },
          {
            $lookup: {
              from: collections.PRODUCT,
              localField: "product.proid",
              foreignField: "_id",
              as: "orderitem",
            },
          },
          {
            $project: {
              coupon: 1,
              proid: "$product.proid",
              quantity: "$product.quantity",
              time: "$product.time",
              orderlist: { $arrayElemAt: ["$orderitem", 0] },
            },
          },
          {
            $project: {
              _id: 0,
              coupon: 1,
              proid: 1,
              quantity: 1,
              time: 1,
              orderlist: 1,
              total: {
                $toInt: {
                  $sum: { $multiply: ["$quantity", "$orderlist.offerprice"] },
                },
              },
            },
          },
          { $project: { proid: 1, coupon: 1, quantity: 1, time: 1, total: 1 } },
        ])
        .toArray();

      // console.log(proid1);

      resolve(proid1);
    });
  },
  checkoutdetail: (order, proid) => {
    console.log(order.Typeofpayment);
    
    order.total = parseInt(order.total);
    proid.forEach((value) => {
      value.status = "order placed";
    });
    console.log(proid);

    return new Promise((resolve, reject) => {
     let paymentstatus = order.Typeofpayment == "COD" ? "order placed" : "pending";
      let orderdetail = {
        userid: ObjectID(order.userid),
        deliverydetails: {
          name: order.fname,
          address: order.address,
          state: order.state,
          pincode: order.postalzip,
          phonenumber: order.phonenumber,
        },
        total: order.total,
        email: order.email,
        products: proid,
        paymentmethod: order.Typeofpayment,
        status: paymentstatus,
        ordertime: new Date().getTime(),
        orderdate: new Date(),
      };
      db.get()
        .collection(collections.ORDER)
        .insertOne(orderdetail)
        .then((response) => {
          resolve(response.insertedId);
        });
    });
  },

  getorderproduct: (uid) => {
    return new Promise(async (resolve, reject) => {
      let orderdetails = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          { $match: { _id: ObjectID(uid) } },
          { $unwind: "$products" },
          {
            $project: {
              paymentmethod: 1,
              pid: "$products.proid",
              qty: "$products.quantity",
              address: "$deliverydetails",
              total: "$products.total",
              status: "$products.status",
              ordert: "$ordertime",
              orderd: {
                $dateToString: { format: "%d-%m-%Y", date: "$orderdate" },
              },
            },
          },
          {
            $lookup: {
              from: collections.PRODUCT,
              localField: "pid",
              foreignField: "_id",
              as: "prolist",
            },
          },
          {
            $project: {
              paymentmethod: 1,
              pid: 1,
              qty: 1,
              total: 1,
              status: 1,
              address: 1,
              ordert: 1,
              orderd: 1,
              prolist: { $arrayElemAt: ["$prolist", 0] },
            },
          },
          { $sort: { ordert: -1 } },
        ])
        .toArray();
      console.log(orderdetails);

      resolve(orderdetails);
    });
  },
  cancelorder: (orderid, proid, status) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER)
        .updateOne(
          { _id: ObjectID(orderid), "products.proid": ObjectID(proid) },
          { $set: { "products.$.status": status } }
        )
        .then(() => {
          resolve();
        });
    });
  },
  orderhistory: (id) => {
    return new Promise(async (resolve, reject) => {
      let value = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          {
            $match: {
              $and: [{ userid: ObjectID(id) }, { status: "order cancelled" }],
            },
          },
          { $unwind: "$products" },
          {
            $project: {
              pid: "$products.proid",
              address: "$deliverydetails",
              status: "$status",
              ordert: "$ordertime",
              orderd: "$orderdate",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCT,
              localField: "pid",
              foreignField: "_id",
              as: "prolist",
            },
          },
          { $sort: { ordert: -1 } },
        ])
        .toArray();
      resolve(value);
    });
  },
  verify: (id, userdata) => {
    return new Promise(async (resolve, reject) => {
      let validate = {};
      let user = await db
        .get()
        .collection(collections.CART)
        .findOne({ user: ObjectID(userdata) });
      console.log(user);
      if (user) {
        let proexist = user.product.findIndex((produt) => produt.proid == id);
        if (proexist == -1) {
          validate.value = true;
          resolve(validate.value);
        } else {
          validate.value = false;
          resolve(validate.value);
        }
      } else {
        validate.value = true;
        resolve(validate.value);
      }
    });
  },
  changequantity:  ({ cid, pid, count, quantity }) => {
    console.log(quantity);
    console.log(count);
    quantity = parseInt(quantity)
    count=parseInt(count)
    return new Promise(async(resolve, reject) => {
    let product = await db.get().collection(collections.PRODUCT).findOne({ _id: ObjectID(pid) })
    let stockcount = product.stock
    let increment = -(count)
      
      if (quantity == 1 && count == -1) {
        
        resolve({ removed: true })
      } else {
        if (stockcount <= 0 && count==1) {
          let obj={pid:product._id,outofstock:true}
          reject(obj)
        } else {
        db.get().collection(collections.PRODUCT).updateOne({_id: ObjectID(pid)},{$inc:{stock:increment}})
          db.get()
          .collection(collections.CART)
          .updateOne(
            { _id: ObjectID(cid), "product.proid": ObjectID(pid) },
            { $inc: { "product.$.quantity": count } }
          )
          .then((response) => {
            console.log(response);
            resolve(response);
          });
        }
      }
    
    });
  },
  order: (uid,firstindex,last) => {
    return new Promise(async (resolve, reject) => {
      let value = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          { $match: { userid: ObjectID(uid) } },
          {
            $project: {
              orderdate: {
                $dateToString: { format: "%d-%m-%Y", date: "$orderdate" },
              },
              ordertime: 1,
              deliverydetails: 1,
              total: 1,
              paymentmethod: 1,
              status: 1,
              coupon: 1,
            },
          },
          { $sort: { ordertime: -1 } },{$skip:firstindex},{$limit:last}
        ])
        .toArray();
      resolve(value);
      // console.log(value);
    });
  },
  ordercount: (uid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.ORDER).find({ userid: ObjectID(uid) }).count().then((response) => {
        resolve(response)
        
      })
    })
    
  },
  findtotal: (userid) => {
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collections.CART)
        .aggregate([
          { $match: { user: ObjectID(userid) } },
          { $unwind: "$product" },
          {
            $project: {
              proid: "$product.proid",
              quantity: "$product.quantity",
              time: "$product.time",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCT,
              localField: "proid",
              foreignField: "_id",
              as: "cartitem",
            },
          },
          {
            $project: {
              proid: 1,
              quantity: 1,
              time: 1,
              product: { $arrayElemAt: ["$cartitem", 0] },
            },
          },
          {
            $group: {
              _id: null,
              gtotal: {
                $sum: { $multiply: ["$quantity", "$product.offerprice"] },
              },
            },
          },
        ])
        .toArray();
      console.log(total);
      resolve(total[0].gtotal);
    });
  },
  addaddress: (data) => {
    return new Promise(async (resolve, reject) => {
      let value = {
        _id: ObjectID(),
        fname: data.fname,
        address: data.address,
        state: data.state,
        postalzip: data.postalzip,
        phonenumber: data.phonenumber,
        date: new Date().getTime(),
      };
      let check = await db
        .get()
        .collection(collections.ADDRESS)
        .findOne({ userid: ObjectID(data.userid) });
      if (check) {
        db.get()
          .collection(collections.ADDRESS)
          .findOne({
            userid: ObjectID(data.userid),
            $and: [
              {
                "address.phonenumber": value.phonenumber,
                "address.fname": value.fname,
                "address.address": value.address,
                "address.postalzip": value.postalzip,
                "address.state": value.state,
              },
            ],
          })
          .then((response) => {
            if (response) {
              resolve();
            } else {
              db.get()
                .collection(collections.ADDRESS)
                .updateOne(
                  { userid: ObjectID(data.userid) },
                  { $push: { address: value } }
                );
              resolve();
            }
          });
      } else {
        console.log("hai");
        let details = {
          userid: ObjectID(data.userid),
          address: [value],
        };
        db.get()
          .collection(collections.ADDRESS)
          .insertOne(details)
          .then(() => {
            resolve();
          });
      }
    });
  },
  findaddress: (uid) => {
    return new Promise(async (resolve, reject) => {
      let check = await db
        .get()
        .collection(collections.ADDRESS)
        .findOne({ userid: ObjectID(uid) });
      if (check) {
        let address = await db
          .get()
          .collection(collections.ADDRESS)
          .aggregate([
            { $match: { userid: ObjectID(uid) } },
            { $project: { address: 1, _id: 0 } },
            { $unwind: "$address" },
            { $sort: { "address.date": -1 } },
            { $limit: 1 },
          ])
          .toArray();
        resolve(address);
      } else {
        resolve();
      }
    });
  },
  otheraddress: (uid) => {
    return new Promise(async (resolve, reject) => {
      let check = await db
        .get()
        .collection(collections.ADDRESS)
        .findOne({ userid: ObjectID(uid) });
      if (check) {
        let address = await db
          .get()
          .collection(collections.ADDRESS)
          .aggregate([
            { $match: { userid: ObjectID(uid) } },
            { $project: { address: 1, _id: 0 } },
            { $unwind: "$address" },
            { $sort: { "address.date": -1 } },
            { $skip: 1 }
          ])
          .toArray();
        resolve(address);
      } else {
        resolve();
      }
    });
  },
  oneaddress: (id) => {
    return new Promise(async (resolve, reject) => {
      let uaddress = await db
        .get()
        .collection(collections.ADDRESS)
        .aggregate([
          { $unwind: "$address" },
          { $match: { "address._id": ObjectID(id) } },
          { $project: { _id: 0, address: 1 } },
        ])
        .toArray();
      resolve(uaddress[0].address);
    });
  },
  changestatus: (oid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER)
        .updateOne({ _id: ObjectID(oid) }, { $set: { status: "order placed" } })
        .then(() => {
          resolve();
        });
    });
  },
  getpaypalproduct: (orderid) => {
    return new Promise(async (resolve, reject) => {
      let proid1 = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          { $match: { _id: ObjectID(orderid) } },
          { $unwind: "$products" },
          {
            $lookup: {
              from: collections.PRODUCT,
              localField: "products.proid",
              foreignField: "_id",
              as: "orderitem",
            },
          },
          {
            $project: {
              proid: "$products.proid",
              quantity: "$products.quantity",
              time: "$products.time",
              orderlist: { $arrayElemAt: ["$orderitem", 0] },
            },
          },
          {
            $project: { _id: 0, proid: 1, quantity: 1, time: 1, orderlist: 1 },
          },
          {
            $project: {
              name: "$orderlist.product",
              total: "$orderlist.offerprice",
              quantity: 1,
            },
          },
          {
            $project: {
              name: 1,
              quantity: 1,
              sku: "item",
              currency: "USD",
              price: { $round: [{ $multiply: ["$total", 0.012] }, 0] },
            },
          },
        ])
        .toArray();

      console.log(proid1);

      resolve(proid1);
    });
  },
  getproductbyid: (proid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT)
        .findOne({ _id: ObjectID(proid) })
        .then((product) => {
          resolve(product);
        });
    });
  },
  getbanner: (digit) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.BANNER)
        .findOne({ page: digit })
        .then((res) => {
          resolve(res);
        });
    });
  },
  removeorder: (uid) => {
    return new Promise((resolve, reject) => {
      try {
        db.get().collection(collections.ORDER).deleteMany({userid:ObjectID(uid),status: "pending"}).then((response) => {
         resolve()
        })
        
      } catch (err){
        console.log(err);
        
      }
     
    });
  },
  editaddress: (id) => {
    return new Promise(async(resolve, reject) => {
      try {
        let address = await db.get().collection(collections.ADDRESS).aggregate([{ $unwind: '$address' }, { $match: { 'address._id': ObjectID(id) } }]).toArray()
        resolve(address[0].address)
      } catch(err) {
        console.log(err);
        
      }
    })
  },
  seteditaddress: (uid,address) => {
    return new Promise((resolve, reject) => {
      let editaddress = {
        _id:ObjectID(address.addid),
        fname: address.fname,
        address: address.address,
        state: address.state,
        postalzip: address.postalzip,
        phonenumber: address.phonenumber,
        date: new Date()
     }
      db.get().collection(collections.ADDRESS).updateOne({ userid:ObjectID(uid),'address._id': ObjectID(address.addid)}, { $set: { 'address.$': editaddress } }).then(() => {
      resolve()
      })
    })
  },
  cartcount: (uid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.CART).findOne({ user: ObjectID(uid) }).then((item) => {
        if (item) {
          let count = item.product.length
          resolve(count)
        } else {
          resolve(0)
        }
       
    })
  })
}
  
};
