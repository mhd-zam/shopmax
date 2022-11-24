const db = require("../config/connection");
const collections = require("../config/collections");

module.exports = {
  paymentcount: () => {
    return new Promise(async (resolve, reject) => {
      let count = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          { $group: { _id: "$paymentmethod", sum: { $sum: 1 } } },
          { $project: { _id: 1, sum: 1 } },
        ])
        .toArray();
      console.log(count);

      resolve(count);
    });
  },
  ordercount: () => {
    return new Promise(async (resolve, reject) => {
      let data = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          {
            $project: {
              date: {
                $dateToString: { format: "%Y-%m_%d", date: "$orderdate" },
              },
            },
          },
          { $group: { _id: "$date", sum: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $project: { _id: 1, sum: 1 } },{$skip:10}
        ])
        .toArray();
      console.log(data);
      resolve(data);
    });
  },
  orderdate: () => {
    return new Promise(async (resolve, reject) => {
      let value = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          {
            $project: {
              date: {
                $dateToString: { format: "%Y-%m_%d", date: "$orderdate" },
              },
            },
          },
          { $group: { _id: "$date", sum: { $sum: 1 } } },
          { $sort: { _id: 1 } },
          { $project: { _id: 1, sum: 0 } },
        ])
        .toArray();
      resolve(value);
    });
  },
  totalproduct: () => {
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([
          { $unwind: "$products" },
          { $group: { _id: "products", sum: { $sum: 1 } } },
        ])
        .toArray();

      resolve(total);
    });
  },
  totalprofit: () => {
    return new Promise(async (resolve, reject) => {
      let profit = await db
        .get()
        .collection(collections.ORDER)
        .aggregate([{ $group: { _id: 0, sum: { $sum: "$total" } } }])
        .toArray();
      resolve(profit);
    });
  },
};
