var userhelper = require('../helpers/users-helper')


var shoppage = (req, res) => {
    userhelper.getproduct().then(async(product) => {
      let user = req.session.username
      let banner =await userhelper.getbanner('2')
      res.render('user/shop', {user,product,banner})
      
    })
    
}
  
module.exports = {
    shoppage
}