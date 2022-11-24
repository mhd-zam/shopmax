function cart(proid) {
    $.ajax({
        url: '/addtocart?id='+ proid,
        get: 'get',
        success: (response) => {
            swal({
                title: "Added to the cart!",
                icon: "success",
            }).then(() => {
                cartnum()
                $('#reload').load(window.location.href=' #reload')
              })
        }
    })
    
}
