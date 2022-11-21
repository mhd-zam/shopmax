const db = require("../config/connection");
const collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");
var ObjectID = require("mongodb").ObjectId;

module.exports = {
  addwishlist: (id, productid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.WISHLIST)
        .updateOne(
          { userid: ObjectID(id) },
          { $addToSet: { item: ObjectID(productid) } }
        )
        .then(() => {
          resolve();
        });
    });
  },
  removewishlist: (id, productid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.WISHLIST)
        .updateOne(
          { userid: ObjectID(id) },
          { $pull: { item: ObjectID(productid) } }
        )
        .then(() => {
          resolve();
        });
    });
  },
  getwishlist: (id) => {
    return new Promise(async (resolve, reject) => {
      let product = await db
        .get()
        .collection(collections.WISHLIST)
        .aggregate([
          { $match: { userid: ObjectID(id) } },
          { $unwind: "$item" },
          {
            $lookup: {
              from: collections.PRODUCT,
              localField: "item",
              foreignField: "_id",
              as: "wishlist",
            },
          },
          {
            $project: { wishlist: { $arrayElemAt: ["$wishlist", 0] }, _id: 0 }
          },
        ])
        .toArray();
      resolve(product)
    });
  },
  verifyitem: (id, userid) => {
    return new Promise(async(resolve, reject) => {
      let check = await db.get().collection(collections.WISHLIST).findOne({ userid: ObjectID(userid), item: ObjectID(id) })
      resolve(check)
    })
  }
};
