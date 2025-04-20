//Логіка сторінки Cart
// iziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getProductById } from './js/products-api.js';
import { getFromLocalStorage } from './js/storage.js';
import { createMarkupProduct } from './js/helpers.js';
import { clickCardFoo } from './js/modal.js';
renderProduct();
// modal
const productsList = document.querySelector('.products-cart');
if (productsList) {
  productsList.addEventListener('click', clickCardFoo);
}

export async function renderProduct() {
  try {
    const productsList = document.querySelector('.products-cart');
    if (!productsList) return;

    const cards = getFromLocalStorage('Cards');
    if (!cards || cards.lenght === 0) {
      return;
    }
    const productPromise = cards.map(id => getProductById(id));
    const product = await Promise.all(productPromise);

    const navCount = document.querySelector('.nav__count');
    const counterItem = document.querySelectorAll('.cart-summary__value');

    const savedCartCounter = getFromLocalStorage('cartCounter');
    if (savedCartCounter) {
      navCount.textContent = savedCartCounter;
      if (counterItem.length > 0) {
        counterItem[0].textContent = savedCartCounter;
      }
    }

    const prices = product.map(price => price.price);
    const totalPrices = prices.reduce((sum, price) => sum + price, 0);
    const rounding = Math.round(totalPrices * 100) / 100;
    if (counterItem.length > 1) {
      counterItem[1].textContent = `$${rounding}`;
    }

    productsList.innerHTML = createMarkupProduct(product);
  } catch (error) {
    console.log(error);
  }
}
const buyBtn = document.querySelector('.cart-summary__btn');

// перевірка одного слухача(щоб повідомлення не дублювалося)
if (buyBtn && !buyBtn.dataset.listenerAdded) {
  buyBtn.addEventListener('click', buyProducts);
  buyBtn.dataset.listenerAdded = 'true';
}

function buyProducts() {
  iziToast.show({
    backgroundColor: 'green',
    message: 'Successful buy product',
    messageColor: 'white',
    position: 'topRight',
    close: false,
    iconUrl: 'icon/success.svg',
  });
}
