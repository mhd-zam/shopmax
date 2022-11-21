var userhelper = require('../helpers/users-helper')



const signupget = (req, res) => {
    error=req.session.message
    res.render('user/signup',{error})
    req.session.message= null
  }

const signuppost = (req,res)=>{
  userhelper.doSignup(req.body).then(async(response) => {
    if (response.status) {
        let user= await userhelper.finduser(req.body.pname)
        req.session.username = req.body.fname
        req.session.userdata = user
        req.session.log=true
        res.redirect('/')
      }else{
        req.session.message=response.message
        res.redirect('/signup')
      }
      
    }).catch(() => {
      req.session.message = 'referal code does not exsist'
      res.redirect('/signup')
    })
}
  
const loginget = (req, res) => {
    let error=req.session.error
    res.render('user/login', { error })
    req.session.error=null
  }

const loginpost = (req,res)=>{
    userhelper.doLogin(req.body).then((data)=>{
      if (data.status) {
        if (data.message) {
          req.session.error = data.message  
        } else {
          req.session.error="blocked"
        }
        res.redirect('/login')
      }else{
        req.session.log = true
        req.session.userdata=data
        req.session.username = data.fname
        const redirect=req.session.returnToUrl || '/'
          req.session.returnToUrl=null
          res.redirect(redirect)
        // res.redirect('/')
      }
    })
  }

const logout = (req, res) => {
  req.session.returnToUrl=null
    req.session.log = false
    req.session.username = null
    req.session.userdata=null
    res.redirect('/')
  }

module.exports = {
    signuppost,signupget,loginget,loginpost,logout
}