


$('#paymentmode').submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/payment',
        type: 'post',
        data: $('#paymentmode').serialize(),
        success: (response) => {
           
            if (response.codsuccess) {
                location.href='/success'
            } else if (response.razorsuccess) {
                razorpayment(response);
                
            } else if (response.wallet) {
                if (response.message) {
                    document.getElementById('err').innerHTML=response.message
                } else {
                    location.href='/success'
                }
            }else if(response) {
                location.href=response
            }
            
        }
    })
})

function razorpayment(order) {
    var options = {
        "key": "rzp_test_XtTDgvD1tgQiz2", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Shopmax",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id":order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            verifypayment(response,order)
        },
        "prefill": {
            "name": order.address.fname,
            "email": "mohmmedzamil@gmail.com",
            "contact":order.address.phonenumber
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', function (response){
        location.href='/paymentfailed'
       
});
    rzp1.open();
}
function verifypayment(payment, order) {
    alert(order)
    $.ajax({
        url: '/paymentverify',
        data: {
            payment,order
        },
        type: 'post',
        success: (response) => {
            location.href='/success'
        }
    })
    
}