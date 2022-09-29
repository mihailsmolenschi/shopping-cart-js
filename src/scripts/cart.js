"use strict";

import { DATA } from "./data.js";

let CART = localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data"))
  : [];

const elLabel = document.getElementById("label");
const elShoppingCart = document.getElementById("shopping-cart");

// ***
// on load run
// ***

generateCartItemsHtml();
addClickEventBtns(".cart-item");
renderCartQuantity();
totalAmmount();

// ***
// Functions declaration
// ***

function generateCartItemsHtml() {
  if (CART.length) {
    elShoppingCart.innerHTML = CART.map((item) => {
      const { id, quantity } = item;

      let search = DATA.find((item) => item.id === id) || [];

      return `
        <div id="${id}" class="cart-item">
          <img class='cart-item--img' src="${search.img.src}" alt="${
        search.img.alt
      }" />
          <div class='cart-item--details'>
            <div class='title'>${search.name}</div>
            <div class='price-quantity-total'>
                <p class='price'>$${search.price}</p>
                <div class='quantity-container'>
                  <button id="decrease" class='btn-quantity btn-quantity--remove' type='button'>&nbsp;</button>
                  <span id="id-${id}" class='quantity'>
                  ${quantity}
                  </span>
                  <button id="increase" class='btn-quantity btn-quantity--add' type='button'>&nbsp;</button>
              </div>
              <div class="total-price">$${quantity * search.price}</div>
            </div>
          </div>
          <img id="remove" class="cart--remove" src="./img/icons/close-outline.svg" alt="remove item btn"/>
        </div>
      `;
    }).join("");
  } else {
    elShoppingCart.innerHTML = ``;
    elLabel.innerHTML = `
      <h2>Cart is empty</h2>
      <a class="link--home" href="index.html">Back to Shopping</a>
    `;
  }
}

function addClickEventBtns(elements) {
  document.querySelectorAll(elements).forEach((item) => {
    item.addEventListener("click", (event) => {
      let buttonId = event.target.id;

      if (buttonId === "decrease") decrease(item.id);
      if (buttonId === "increase") increase(item.id);
      if (buttonId === "remove") removeItem(item.id);
    });
  });
}

function decrease(selectedItemId) {
  const search = CART.find((el) => el.id === selectedItemId);

  if (search && search.quantity > 0) search.quantity -= 1;

  updateItemQuantity(selectedItemId);

  // Filter only items which quantity !== 0
  CART = CART.filter((item) => item.quantity !== 0);

  // After elements with 0 quantity was not include in the CART generateItems
  generateCartItemsHtml();
  // Add click events to buttons
  addClickEventBtns(".cart-item");

  localStorage.setItem("data", JSON.stringify(CART));

  totalAmmount();
}

function increase(selectedItemId) {
  const search = CART.find((el) => el.id === selectedItemId);

  if (!search) {
    CART.push({ id: selectedItemId, quantity: 1 });
  } else {
    search.quantity += 1;
  }

  updateItemQuantity(selectedItemId);

  generateCartItemsHtml();
  // Add click events to buttons
  addClickEventBtns(".cart-item");
  localStorage.setItem("data", JSON.stringify(CART));

  totalAmmount();
}

function updateItemQuantity(id) {
  let search = CART.find((el) => el.id === id);

  if (!search) return;

  document.getElementById(`id-${id}`).innerHTML = search.quantity;

  renderCartQuantity();
}

function renderCartQuantity() {
  let cartQuantity = 0;

  CART.forEach((item) => (cartQuantity += item.quantity));

  document.getElementById("cart--quantity").innerHTML = cartQuantity;
}

function removeItem(selectedItemId) {
  CART = CART.filter((item) => item.id !== selectedItemId);

  generateCartItemsHtml();
  // Add click events to buttons
  addClickEventBtns(".cart-item");

  renderCartQuantity();
  totalAmmount();

  localStorage.setItem("data", JSON.stringify(CART));
}

function totalAmmount() {
  if (!CART.length) return;

  const total = CART.map((item) => {
    let { quantity, id } = item;

    let search = DATA.find((item) => item.id === id) || [];

    return search.price * item.quantity;
  }).reduce((acc, curr) => acc + curr);

  elLabel.innerHTML = `
    <div class="total"><strong>Total:</strong> $${total}</div>
    <div class="btn-container">
    <button id="checkout" class="btn-checkout" type="button">Checkout</button>
    <button id="remove-all" class="btn-remove-all" type="button">Clear cart</button></div>
  `;

  // Add event listeners
  document
    .getElementById("checkout")
    .addEventListener("click", () => checkout());
  document
    .getElementById("remove-all")
    .addEventListener("click", () => clearCart());
}

function clearCart() {
  CART = [];
  generateCartItemsHtml();
  renderCartQuantity();

  localStorage.setItem("data", JSON.stringify(CART));
}

function checkout() {
  console.log(`checkout()`);
}
