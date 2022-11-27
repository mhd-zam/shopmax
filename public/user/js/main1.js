




function error(id,message){
    document.getElementById(id).innerHTML=message
}

function validateMobile(){
var pnum=document.getElementById('pnum').value

var regex=/^[7-9][0-9]{9}$/
    if(pnum.trim()==''){
    error("error2","invalid phone number")
    }
   else if(pnum.length==0){
        error("error2","*mobile number not entered")
    }else if(pnum.length !==10){
        error("error2","*mobile number should be 10 digit")
    }
    else if(!regex.test(pnum)){
        console.log(pnum);
        error("error2","*invalid mobile number")
        
    }else{
        error("error2","")
        return true
    }
   

}

function validateEmail(){
var mail=document.getElementById('mail').value
var regex=/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
if(mail.length==0){
    error('error3',"*email not entered")
}
else if(!regex.test(mail)){
    error('error3',"*email not valid")
}else{
    error('error3',"")
    return true
}
}

function validateusername(){
var fname=document.getElementById('name').value
var regex=/[A-Za-z]/
if(fname.length==0){
    error("error1","*username not entered")
}else if(!regex.test(fname)){
    error("error1","*invalid username") 
}else{
    error("error1","")
    return true
}
}

function passwordvalidate(){
    var pass=document.getElementById('pass').value
    var regexWhiteSpace=/^\S*$/
    var regexUpperCase= /^(?=.*[A-Z]).*$/
    var regexLowerCase=/^(?=.*[a-z]).*$/
    var regexNumber = /^(?=.*[0-9]).*$/;
    var regexSymbol =/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
    var regexLength = /^.{7,16}$/;
    if(pass==""){
        error('error4','Password not entered')
    }else if(!regexWhiteSpace.test(pass)){
       error('error4',"Password must not contain Whitespaces.")
    }else if(!regexUpperCase.test(pass)){
       error('error4','Password must have at least one Uppercase Character.')
    }else if(!regexLowerCase.test(pass)){
        error('error4',"Password must have at least one Lowercase Character.")
    }else if(!regexNumber.test(pass)){
       error('error4','Password must contain at least one Digit.')
    }else if(!regexSymbol.test(pass)){
        error('error4','Password must contain at least one Special Symbol.')
    }else if(!regexLength.test(pass)){
        error('error4','Password must be 7-16 Characters Long.')
    }else{
        error('error4','')
        return true
    }
    
    }
    
    function validateRepass(){
        var pass=document.getElementById('pass').value
        var repass=document.getElementById('repass').value
       if(repass==''){
        error('error5','re-password not entered')
        return false
       }else if(pass!=repass){
        error('error5',"Password doesn't match")
        return false
       }else{
        error('error5',"")
        return true
       }
    }

function validate(){
    validateEmail()
    validateMobile()
    validateusername()
    passwordvalidate()
    validateRepass()
    if(validateEmail() && validateMobile() && validateusername() && passwordvalidate() && validateRepass()){
    return true
    }else{
    return false
    }
   
}



