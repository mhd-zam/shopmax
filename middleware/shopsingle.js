
var userhelper = require('../helpers/users-helper')
const userwishlist = require('../helpers/userwishlist')



var shopsingle = async (req, res) => {
  let id = req.query.id
  req.session.returnToUrl = req.originalUrl
  let check = null
  let wishlistcheck = null
    if (req.session.userdata) {
      let userid = req.session.userdata._id
      check = await userhelper.verify(id, userid)
      wishlistcheck=await userwishlist.verifyitem(id,userid)
    }
    let user=req.session.username
    userhelper.getidProduct(id).then((data) => {
      res.render('user/product-detail', { user, data ,check,wishlistcheck})
     
   })
    
}
  

module.exports = {
    shopsingle
}