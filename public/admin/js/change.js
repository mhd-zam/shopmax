
function change(id, action,productid) {
    $.ajax({
       url:'/admin/acancel',
        type: 'post',
        data: {
            order:id,
            status: action,
            proid:productid
        },
       success:(res)=>{
           location.reload()
       }
    })
}
 

