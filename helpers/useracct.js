var db = require("../config/connection");
const bcrypt = require("bcrypt");
const collections = require("../config/collections");
const { CURSOR_FLAGS } = require("mongodb");
const { response } = require("express");
var ObjectID = require("mongodb").ObjectId;

module.exports = {
  getuser: (userid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTIONS)
        .findOne({ _id: ObjectID(userid) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  updateuser: (user, userid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTIONS)
        .updateOne(
          { _id: ObjectID(userid) },
          { $set: { fname: user.fname, pname: user.pname, email: user.email } }
        )
        .then(() => {
          resolve();
        });
    });
  },
  password: (userid, data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTIONS)
        .findOne({ _id: ObjectID(userid) })
        .then((response) => {
          bcrypt.compare(data.password, response.password).then(async (res) => {
            if (res) {
              console.log(data.newpassword);
              data.newpassword = await bcrypt.hash(data.newpassword, 10);
              console.log("hai");
              console.log(userid);
              console.log(data.newpassword);
              db.get()
                .collection(collections.USER_COLLECTIONS)
                .updateOne(
                  { _id: ObjectID(userid) },
                  { $set: { password: data.newpassword } }
                )
                .then((res) => {
                  console.log(res);

                  resolve();
                });
            } else {
              reject();
            }
          });
        });
    });
  },
  userwallet: (uid) => {
    return new Promise(async (resolve, reject) => {
      console.log(uid);
      let value = await db.get().collection(collections.WALLET).findOne({ userid: ObjectID(uid) })
      resolve(value)
    })
  }
};
