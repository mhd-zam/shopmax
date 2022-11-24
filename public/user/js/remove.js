function remove(proid,quantity) {
  swal("Are you sure you want to remove the product", {
    buttons: ["cancel", true],
  }).then((value) => {
      if (value) {
        $.ajax({
            url: "/remove-product?id=" + proid,
          type: "get",
            data:{quantity:quantity},
            success: (response) => {
                $("#val2").load(window.location.href + " #val2");
            },
          });
      } else {
          return false
      }
  
  });
}
