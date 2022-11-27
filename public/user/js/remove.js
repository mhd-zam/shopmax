function remove(proid, quantity) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/remove-product?id=" + proid,
        type: "get",
        data: { quantity: quantity },
        success: (response) => {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          $("#val3").load(window.location.href + " #val3");
        },
      });
    } else {
      return false
    }

  });
}
