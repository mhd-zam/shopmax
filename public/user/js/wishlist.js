function fav(pid) {
    $.ajax({
        url:'/addwishlist?id='+pid,
        type:'post',
        success:(response)=>{
            $("#refresh").load(window.location.href+" #refresh")
        }
    })
}
function fav1(pid) {
   
    $.ajax({
        url:'/removewishlist?id='+pid,
        type:'post',
        success: (response) => {
            $("#refresh").load(window.location.href+" #refresh")
        }
    })
}