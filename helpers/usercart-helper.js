const collections = require("../config/collections");
const db = require("../config/connection");

const ObjectID = require("mongodb").ObjectId;

module.exports = {
  cartexsist: (uid) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collections.CART)
          .findOne({ user: ObjectID(uid) })
          .then((response) => {
            resolve(response);
          });
      } catch (err) {
        console.log(err);
      }
    });
  },
  findwallet: (uid, total,data) => {
   let  Total=total/100
    return new Promise((resolve, reject) => {
      try {
        db.get().collection(collections.WALLET).findOne({ userid: ObjectID(uid) }).then((response) => {
          if (response.walletAmt >= Total) {
            db.get().collection(collections.WALLET).updateOne({ userid: ObjectID(uid) }, { $inc: { walletAmt: -Total },$push:{'history':data} }).then(() => {
              resolve()
            })
          } else {
            reject()
          }
        })
      } catch (err) {
        console.log(err)
      }
    })
  }
};
