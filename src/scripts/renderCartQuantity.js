export let CART = JSON.parse(localStorage.getItem("cartData")) || [];

export const renderCartQuantity = () => {
  let cartAmmount = 0;

  CART.forEach((item) => {
    // console.log(item);
    cartAmmount += item.quantity;
  });

  document.getElementById("cart--ammount").innerHTML = cartAmmount;

  localStorage.setItem("cartData", JSON.stringify(CART));
};
