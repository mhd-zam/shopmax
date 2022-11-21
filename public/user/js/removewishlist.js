function remove(pid) {
    $.ajax({
        url:'/removewishlist?id='+pid,
        type:'post',
        success:(response)=>{
            $("#refresh").load(window.location.href + " #refresh");
           
        }
    })
}