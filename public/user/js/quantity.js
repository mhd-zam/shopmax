function quantity(cartid, productid,value,pid,price) {
    let quantity = parseInt(document.getElementById(productid).value)
    let currentval = parseInt(document.getElementById(pid).innerHTML)
    document.getElementById('cpbtn').disabled = false;
    document.getElementById('cpbtn').style.opacity=100
    document.getElementById('couponinput').value = null;
    document.getElementById('err').innerHTML=null
    console.log(price);
    $.ajax({
        url: '/quantitychange',
        data: {
            cid: cartid,
            pid: productid,
            count: value,
            quantity:quantity        
        },
        type: "post",
        success: (response) => {
            if (response.removed) {
                swal({
                    title: "Product Removed!",
                    text: "",
                    icon: "success",
                    button: "Ok",
                }).then(() => {
                    location.reload()
                })
                
            } else {
                // document.getElementById(productid).value = parseInt(quantity) + parseInt(value)
                // document.getElementById(pid).innerHTML=parseInt(currentval)+parseInt(price)
                document.getElementById('total').innerHTML = response.total
                document.getElementById('test').innerHTML = response.total
                $("#val2").load(window.location.href + " #val2");
            }
         
        }
    })
   }