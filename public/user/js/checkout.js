


$("#checkoutform").submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/addaddress',
        type : 'post',
        data: $('#checkoutform').serialize(),
        success: (response) => {
            if (response.status) {
                 location.href='/payment'
             }
        }
    })
})

