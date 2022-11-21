var userhelper = require("../helpers/users-helper");

var homepage =  function (req, res, next) {

  userhelper.getproduct().then(async(product) => {
    let user = req.session.username;
    let banner =await userhelper.getbanner('1')
    console.log(banner);
    res.render("user/index", { user, product,banner});
  });
};

module.exports = {
  homepage,
};
