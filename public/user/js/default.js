$('#default').submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/defaultaddress',
        type: 'post',
        data: $('#default').serialize(),
        success: (response) => {
            location.href="/payment"
        }
        
    })
})