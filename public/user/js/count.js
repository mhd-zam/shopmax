
function cartnum(){
  $.ajax({
    url:'/cartcount',
    method:'get',
    success:(response)=>{
      document.getElementById('cartnum').innerHTML = response
      
    }

  })
}

window.onload=cartnum()
