function showconfirm(
  orderid,
  proid,
  total,
  paymentmethod,
  status,
  change,
  productname,
  quantity
) {

  Swal.fire({
    title: "Do you want to cancel the order?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, cancel order!",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "/cancel",
        type: "get",
        data: { orderid, proid, total, status, paymentmethod, change,productname,quantity },
        success: (response) => {
          Swal.fire("cancelled!", "The order is cancelled", "success").then(() => {
            location.reload();
          })
        },
      });
    } else {
      return false
    }

  });
  return false;
}

function payreturn(orderid, proid) {

  
  Swal.fire({
    title: "Do you want to return the product?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, return it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let change = "return inititated";
      $.ajax({
        url: "/return",
        type: "get",
        data: { orderid, proid, change },
        success: (response) => {
          Swal.fire("returned!", "The product will be collected shortly", "success").then(() => {
            location.reload();
          })
        },
      })
    } else {
      return false
    }

  });
  return false;

}
