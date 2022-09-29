"use strict";

import { DATA } from "./data.js";

let elItemsContainer = document.getElementById("items-container");

let CART = localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data"))
  : [];

// ***
// on load run
// ***

renderItems();
addClickEventBtns(".item");
renderCartQuantity();

// ***
// Function definition
// ***

function renderItems() {
  elItemsContainer.innerHTML = generateItems();
}

function generateItems() {
  return DATA.map((item) => {
    let { id, name, price, description, img } = item;

    let search = CART.find((item) => item.id === id) || [];

    return `
        <div id=${id} class='item'>
          <img class='item--img' src=${img.src} alt=${img.alt}>
          <div class='item--details'>
            <h3 class='item--title'>${name}</h3>
            <p class='item--description'>${description}</p>
            <div class='buy-container'>
              <div class='price'>$${price}</div>
              <div class='quantity-container'>
                <button id="decrease" class='btn-quantity btn-quantity--remove' type='button'>&nbsp;</button>
                <span id="id-${id}" class='quantity'>
                ${!search.quantity ? 0 : search.quantity}
                </span>
                <button id="increase" class='btn-quantity btn-quantity--add' type='button'>&nbsp;</button>
              </div>
            </div>
          </div>
        </div>
      `;
  }).join("");
}

function addClickEventBtns(elements) {
  document.querySelectorAll(elements).forEach((item) => {
    item.addEventListener("click", (event) => {
      let buttonId = event.target.id;

      if (buttonId === "decrease") decrease(item.id);
      if (buttonId === "increase") increase(item.id);
    });
  });
}

function decrease(selectedItemId) {
  const search = CART.find((el) => el.id === selectedItemId);

  if (search && search.quantity > 0) search.quantity -= 1;

  updateItemQuantity(selectedItemId);

  // Filter only items which quantity !== 0
  CART = CART.filter((item) => item.quantity !== 0);

  localStorage.setItem("data", JSON.stringify(CART));
}

function increase(selectedItemId) {
  const search = CART.find((el) => el.id === selectedItemId);

  if (!search) {
    CART.push({ id: selectedItemId, quantity: 1 });
  } else {
    search.quantity += 1;
  }

  updateItemQuantity(selectedItemId);
  localStorage.setItem("data", JSON.stringify(CART));
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
