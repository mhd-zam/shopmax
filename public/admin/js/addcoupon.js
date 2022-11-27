$('#coupon').submit((e)=>{
    e.preventDefault()
    $.ajax({
        url:'/admin/addcoupon',
        type:'post',
        data:$('#coupon').serialize(),
        success: (response) => {
            if (response.message) {
                document.getElementById('err').innerHTML=response.message
            } else {
                location.href='/admin/coupon'
            }
           
        }
    })
})