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
  if (confirm("Do you want to cancel the order")) {
    $.ajax({
      url: "/cancel",
      type: "get",
      data: { orderid, proid, total, status, paymentmethod, change,productname,quantity },
      success: (response) => {
        location.reload();
      },
    });
  } else {
    return false;
  }
}
function payreturn(orderid, proid) {
  if (confirm("Do you want to return the order")) {
    let change = "return inititated";
    $.ajax({
      url: "/return",
      type: "get",
      data: { orderid, proid, change },
      success: (response) => {
        location.reload();
      },
    });
  } else {
    return false;
  }
}
