var userhelper = require('../helpers/users-helper')
require('dotenv').config()
const ServiceID = process.env.SERVICEID
const accountSID = process.env.ACCOUNTSID
const authToken = process.env.AUTHTOKEN
const client = require('twilio')(accountSID,authToken)


const phonenumberget = (req,res)=>{
    let message=req.session.message
    res.render('user/otp-phone',{message})
  message = ''
  req.session.message=''
} 

const phonenumberpost = (req, res) => {
    req.session.ph=req.body.pname
    userhelper.doOTP(req.body.pname).then((response)=>{
      if(response.status){
        req.session.username = response.fname
        req.session.userdata=response
        client
        .verify
        .services(ServiceID)
        .verifications
        .create({
         to:`+91${req.body.pname}`,
         channel:"sms"
        }).then((data)=>{
         res.redirect('/login-otp')
        })
      }else{
        req.session.message="Mobilenumber Not Found"
        res.redirect('/otp-phone')
      }
    })
    
   
  }

const otppageget = (req, res) => {
    let pname=req.session.ph
    let message=req.session.message
      res.render('user/otp',{pname,message})
      message=''
}

const otppagepost = (req,res)=>{
    var arr= Object.values(req.body)
    var otp= arr.toString().replaceAll(',','');
    console.log(otp)
    client
    .verify
    .services(ServiceID)
    .verificationChecks
    .create({
      to:`+91${req.session.ph}`,
      code:otp
    }).then((data)=>{
      if (data.valid) {
        req.session.log = true
        res.redirect('/')
      }
      else{
        req.session.message="Incorrect OTP"
        res.redirect('/login-otp')
      }
    })
  }

module.exports = {
    phonenumberget,phonenumberpost,otppageget,otppagepost
}