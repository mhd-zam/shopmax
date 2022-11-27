function quantity(cartid, productid,value,pid,price) {
    let quantity = parseInt(document.getElementById(productid).value)
    let minusid=3+productid
    document.getElementById(minusid).disabled = true
    let plusid=2+productid
    document.getElementById(plusid).disabled=true
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
                let id=3+productid
                document.getElementById(id).disabled = true
                let plusid=2+productid
              document.getElementById(plusid).disabled=false
            } else if (response.outofstock) {
                let plusid=2+response.pid
                document.getElementById(plusid).disabled = true
                 let minusid=3+productid
                document.getElementById(minusid).disabled = false
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Out Of Stock!'
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