const db = require("../config/connection");
const collections = require("../config/collections");
const { response } = require("../app");
const { Code } = require("mongodb");
var ObjectID = require("mongodb").ObjectId;

module.exports = {
  addcoupon: (data) => {
    data.Expirydate = new Date(data.Expirydate);
    data.Percentage = parseInt(data.Percentage);

    return new Promise(async (resolve, reject) => {
      let check = await db
        .get()
        .collection(collections.COUPON)
        .findOne({ Couponcode: data.Couponcode });
      if (check) {
        reject({message:'coupon already exsist'});
      } else {
        db.get()
          .collection(collections.COUPON)
          .insertOne(data)
          .then(() => {
            resolve();
          });
      }
    });
  },
  getcoupon: () => {
    return new Promise(async (resolve, reject) => {
      let coupon = await db
        .get()
        .collection(collections.COUPON)
        .find()
        .toArray();
      resolve(coupon);
    });
  },
  testcoupon: (data, id) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      let value = await db
        .get()
        .collection(collections.COUPON)
        .findOne({ Couponcode: data.coupon });
      if (value) {
        db.get()
          .collection(collections.USER_COLLECTIONS)
          .findOne({ _id: ObjectID(id),coupon: data.coupon})
          .then((used) => {
            if (used) {
              reject({message:'coupon already used'});
            } else {
              if (value.Expirydate > new Date()) {
                resolve(value);
              } else {
                reject({message:'coupon Expired'});
              }
            }
          });
      } else {
        reject({message:'coupon does not exsist'});
      }
    });
  },
  getcouponid: (id) => {
    return new Promise(async (resolve, reject) => {
      let value = await db
        .get()
        .collection(collections.COUPON)
        .findOne({ _id: ObjectID(id) });
      resolve(value);
    });
  },
  insertcoupon: (id, data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.CART)
        .updateOne({ user: ObjectID(id) }, { $set: { coupon: data } })
        .then(() => {
          resolve();
        });
    });
  },
  removecoupon: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.CART)
        .updateOne({ user: ObjectID(id) }, { $unset: { coupon: 1 } })
        .then(() => {
          resolve();
        });
    });
  },
  insertcoupon2: (oid, value) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER)
        .updateOne({ _id: ObjectID(oid) }, { $set: { coupon: value } })
        .then(() => {
          resolve();
        });
    });
  },
  usercoupon: (id, code) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTIONS)
        .updateOne({ _id: ObjectID(id) }, { $addToSet: { coupon: code } })
        .then(() => {
          resolve();
        });
    });
  },
  deletecoupon: (id,test) => {
    db.get().collection(collections.COUPON).deleteOne({ _id: ObjectID(id) }).then((response) => {
      test(response)
    })
  },

};
