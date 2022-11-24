const db = require("../config/connection");
const collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");
const { order } = require("./users-helper");
var ObjectID = require("mongodb").ObjectId;
module.exports = {
  getData: () => {
    return new Promise(async (resolve, reject) => {
      let data = await db
        .get()
        .collection(collections.USER_COLLECTIONS)
        .find()
        .toArray();
      resolve(data);
    });
  },
  createcategory: (item) => {
    let replace = item.category.trim()
    item.discount = parseInt(item.discount);
    return new Promise(async (resolve, reject) => {
      let check = await db
        .get()
        .collection(collections.PRODUCT_CATEGORY)
        .findOne({ category:replace})
      if (check) {
        reject();
      } else {
        db.get()
          .collection(collections.PRODUCT_CATEGORY)
          .insertOne(item)
          .then((response) => {
            db.get()
              .collection(collections.PRODUCT_CATEGORY)
              .findOne({ _id: ObjectID(response.insertedId) })
              .then((response) => {
                let val = 1 - response.discount / 100;
                db.get()
                  .collection(collections.PRODUCT)
                  .updateMany(
                    { category: response.category },
                    [{
                      $project: {
                        brand: 1,
                        product: 1,
                        description: 1,
                        category: 1,
                        price:1,
                        imagefileName: 1,
                        offerprice: {$round: [{ $multiply: ["$price", val] }, 0]  },
                      },
                    },
                    { $set: { offerprice: "$offerprice" } }]
                  )
                  .then((response) => {
                    console.log(response);
                    resolve(response);
                  });
              });
          });
      }
    });
  },

  getcategory: () => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collections.PRODUCT_CATEGORY)
        .find()
        .toArray();
      resolve(category);
    });
  },
  Deletecategory: (data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_CATEGORY)
        .deleteOne({ _id: ObjectID(data) })
        .then(() => {
          resolve();
        });
    });
  },
  blockuser: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTIONS)
        .updateOne({ _id: ObjectID(id) }, { $set: { status: true } })
        .then(() => {
          resolve();
        });
    });
  },
  unblockuser: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTIONS)
        .updateOne({ _id: ObjectID(id) }, { $set: { status: false } })
        .then(() => {
          resolve();
        });
    });
  },
  addproduct: (product) => {
    return new Promise((resolve, reject) => {
      product.stock = parseInt(product.stock)
      product.offerprice = parseInt(product.offerprice);
      product.price = parseInt(product.price);
      db.get()
        .collection(collections.PRODUCT)
        .insertOne(product)
        .then(() => {
          resolve();
        });
    });
  },
  getproduct: () => {
    return new Promise((resolve, reject) => {
      let data = db.get().collection(collections.PRODUCT).find().toArray();
      resolve(data);
    });
  },
  Deleteproduct: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT)
        .deleteOne({ _id: ObjectID(id) })
        .then(() => {
          resolve();
        });
    });
  },
  editcatagory: (param, value) => {
    return new Promise(async (resolve, reject) => {
      db.get()
          .collection(collections.PRODUCT_CATEGORY)
          .updateOne({ _id: ObjectID(param) }, { $set: { category: value.category ,discount:value.discount} })
          .then(() => {
            db.get()
              .collection(collections.PRODUCT_CATEGORY)
              .findOne({ _id: ObjectID(param) })
              .then((response) => {
                let val = 1 - response.discount / 100;
                db.get()
                  .collection(collections.PRODUCT)
                  .updateMany(
                    { category: response.category },
                    [{
                      $project: {
                        brand: 1,
                        product: 1,
                        description: 1,
                        category: 1,
                        price:1,
                        imagefileName: 1,
                        offerprice: {$round: [{ $multiply: ["$price", val] }, 0]  },
                      },
                    },
                    { $set: { offerprice: "$offerprice" } }]
                  )
                  .then((response) => {
                    console.log(response);
                    resolve();
                  });
              });
            
          });
      
    });
  },
  getidcategory: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT_CATEGORY)
        .findOne({ _id: ObjectID(id) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  getidproduct: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT)
        .findOne({ _id: ObjectID(id) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  updateproduct: (id, data) => {
    data.stock=parseInt(data.stock)
    data.offerprice = parseInt(data.offerprice);
    data.price = parseInt(data.price);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCT)
        .replaceOne({ _id: ObjectID(id) }, data)
        .then((response) => {
          resolve(response);
        });
    });
  },
  findorder: () => {
    return new Promise(async (resolve, reject) => {
      let order = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          { $match: {} },
          {
            $project: {
              orderdate: {
                $dateToString: { format: "%Y-%m-%d", date: "$orderdate" },
              },
              ordertime: 1,
              deliverydetails: 1,
              paymentmethod: 1,
              total: 1,
            },
          },
          { $sort: { orderdate: -1 } },
        ])
        .toArray();
      resolve(order);
    });
  },
  acancelorder: (data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER)
        .updateOne(
          { _id: ObjectID(data.order), "products.proid": ObjectID(data.proid) },
          { $set: { "products.$.status": data.status } }
        )
        .then(() => {
          resolve();
        });
    });
  },
  getsalesreport: () => {
    return new Promise(async (resolve, reject) => {
      let orders = await db.get().collection(collections.ORDER).aggregate([
        {
          $match: {},
        }
       ,
        {
          $unwind:"$products"
        },
        {
          $group:{_id: "$products.proid",quantity: {$sum: "$products.quantity"} }
        },
        {
          $lookup:{
            from: collection.PRODUCT,
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },{
          $project: {
            quantity: 1,
            product: { $arrayElemAt : ["$productDetails",0]},
          },      
        },
        {
          $addFields:{
            total : {$multiply: ["$quantity","$product.price"]}
          }   
        }
      ]).toArray()

    console.log(orders);
      resolve(orders);
    });
  },
  getdailysales: (dateData) => {
    return new Promise(async (resolve, reject) => {
      let orders = await db.get().collection(collections.ORDER).aggregate([
        {
          $project: {
            _id: 0,
            products:1,
            paymentmethod: 1,
            status:1,
            date: { $dateToString: { format: "%Y-%m-%d", date: "$orderdate" } },
          },
        },
        {
          $match: { date: dateData , status: "order placed"},
        }
       ,
        {
          $unwind:"$products"
        },
        {
          $group:{_id: "$products.proid",quantity: {$sum: "$products.quantity"} }
        },
        {
          $lookup:{
            from: collection.PRODUCT,
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },{
          $project: {
            quantity: 1,
            product: { $arrayElemAt : ["$productDetails",0]},
          },      
        },
        {
          $addFields:{
            total : {$multiply: ["$quantity","$product.price"]}
          }   
        }
      ]).toArray()

    console.log(orders);
      resolve(orders);
    });
  },
  getmonthlysales: (dateData) => {
    return new Promise(async (resolve, reject) => {
      let report = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          {
            $project: {
              _id: 0,
              products:1,
              paymentmethod: 1,
              status:1,
              total: 1,
              date: { $dateToString: { format: "%d-%m-%Y", date: "$orderdate" } },
              month: { $dateToString: { format: "%Y-%m", date: "$orderdate" } }
            },
          },
          {
            $match: { month: dateData ,status: "order placed"},
          },
          {
            $unwind:"$products"
          },
          {
            $group:{_id:"$date" , quantity: {$sum: "$products.quantity"},total: {$sum: "$total"} }
          },
        ])
        .toArray();
    resolve(report)
     
    });
  },
  getyearlysales: (dateData) => {
    return new Promise(async (resolve, reject) => {
      let report = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          {
            $project: {
              _id: 0,
              status:1,
              paymentmethod: 1,
              products:1,
              total: 1,
              year: { $dateToString: { format: "%Y", date: "$orderdate" } },
              month: { $dateToString: { format: "%Y-%m", date: "$orderdate" } },
            },
          },
          {
            $match: { year: dateData , status: "order placed"},
          },
          {
            $unwind:"$products"
          },
          {
            $group:{_id:"$month" , quantity: {$sum: "$products.quantity"},total: {$sum: "$total"} }
          },
        ])
        .toArray();
       

      resolve(report);
    });
  },
  getuserproduct: (orderid) => {
    return new Promise(async (resolve, reject) => {
      let product = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          { $match: { _id: ObjectID(orderid) } },
          { $unwind: "$products" },
          {
            $project: {
              userid:1,
              pid: "$products.proid",
              qty: "$products.quantity",
              stotal: "$products.total",
              status: "$products.status",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCT,
              localField: "pid",
              foreignField: "_id",
              as: "orderdetails",
            },
          },
          {
            $project: {
              userid:1,
              pid: 1,
              qty: 1,
              stotal: 1,
              status: 1,
              orderdetails: { $arrayElemAt: ["$orderdetails", 0] },
            },
          },
        ])
        .toArray();
      resolve(product);
    });
  },
  bannersubmit: (data) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.BANNER).insertOne(data).then(() => {
        resolve()
      })
    })
   
  },
  getallbanner: () => {
    return new Promise(async(resolve, reject) => {
      let variable = await db.get().collection(collections.BANNER).find().toArray()
      resolve(variable)
    })
  },
  deletebanner: (id) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.BANNER).deleteOne({ _id: ObjectID(id) }).then(() => {
        resolve()
      })
    })
  },
  refund: (price,id,data) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.WALLET).updateOne({ userid: ObjectID(id) }, { $inc: { walletAmt: price },$push:{'history':data} }).then(() => {
        resolve()
      })
    })
  },
  changestatus: (pid, oid,price) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.ORDER).updateOne({ _id: ObjectID(oid), 'products.proid': ObjectID(pid) }, { $set: { 'products.$.status': 'cancelled' }, $inc: { total: -price } }).then(() => {
        resolve()
      })
    })
  },
  changestatus1: (pid, oid,price) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.ORDER).updateOne({ _id: ObjectID(oid), 'products.proid': ObjectID(pid) }, { $set: { 'products.$.status': 'refund approved' }, $inc: { total: -price } }).then(() => {
        resolve()
      })
    })
  },
  editbanner: (bannerid) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.BANNER).findOne({ _id: ObjectID(bannerid) }).then((response) => {
        resolve(response)
      })
    })
  },
  editbannerwithout: (banner) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.BANNER).updateOne({ _id: ObjectID(banner.id) }, { $set: { title: banner.title, description: banner.description } }).then((response) => {
        resolve(response)
      })
    })
  },
  updateoneimg: (banner, img) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.BANNER).updateOne({ _id: ObjectID(banner.id) }, { $set: {title: banner.title, description: banner.description, 'imagefile.0' : img } }).then((response) => {
        resolve(response)
      })
    })
  },
  updatetwoimg: (banner, img) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.BANNER).updateOne({ _id: ObjectID(banner.id) }, { $set: {title: banner.title, description: banner.description, 'imagefile.0' : img[0],'imagefile.1' : img[1] } }).then((response) => {
        resolve(response)
      })
    })
  },
  updateallimg: (banner, img) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.BANNER).updateOne({ _id: ObjectID(banner.id) }, { $set: {title: banner.title, description: banner.description, 'imagefile':img } }).then((response) => {
        resolve(response)
      })
    })
  }
};
