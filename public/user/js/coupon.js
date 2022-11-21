$('#couponapply').submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/checkcoupon',
        type: 'post',
        data: $('#couponapply').serialize(),
        success: (response) => {
            if (response.status) {
                let total = parseInt(document.getElementById('total').innerHTML) 
                if (total >= response.MinimumAmt && response.MaximumAmt>total) {
                    document.getElementById('err').innerHTML=null
                    document.getElementById('cpbtn').disabled = true;
                    document.getElementById('cpbtn').style.opacity=0
                    document.getElementById('total').innerHTML = total-Math.round((total * response.Percentage) / 100)
                    const single = document.querySelectorAll('.stotal')
                    for (i = 0; i < single.length; i++){
                        let stotal = single[i].innerHTML
                        single[i].innerHTML= stotal-Math.round((stotal*response.Percentage)/100)
                    }
                    document.getElementById('atag').href = `/checkout?id=${response._id}`
                    swal("Congrats", "Coupon added", "success");
                } else {
                    document.getElementById('err').innerHTML=`Coupon valid only on ₹${response.MinimumAmt}-₹${response.MaximumAmt}`
                }
            } else {
                document.getElementById('err').innerHTML=response.message
            }
            
        }
    })
})



