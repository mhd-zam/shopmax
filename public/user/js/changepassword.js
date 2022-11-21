$('#changepassword').submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/changepassword',
        data: $('#changepassword').serialize(),
        type: 'post',
        success: (response) => {
            if (response.status) {
                swal("password changed").then(() => {
                    location.reload()
                })
            } else {
                swal("incorrect password!!");
            }
        }
    })
})