//Логіка сторінки Cart
// iziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getProductById } from './js/products-api.js';
import { getFromLocalStorage } from './js/storage.js';
import { createMarkupProduct, showLoader, hideLoader } from './js/helpers.js';
import { clickCardFoo } from './js/modal.js';
import { ThemeChange, setThemeFromLocalStorage } from './js/theme-switcher.js';
setThemeFromLocalStorage();

renderProductCart();
// modal
const productsList = document.querySelector('.products-cart');
if (productsList) {
  productsList.addEventListener('click', clickCardFoo);
}

export async function renderProductCart() {
  try {
    showLoader();
    const productsList = document.querySelector('.products-cart');
    if (!productsList) return;

    const cards = getFromLocalStorage('Cards');
    if (!cards || cards.lenght === 0) {
      return;
    }
    const productPromise = cards.map(id => getProductById(id));
    const product = await Promise.all(productPromise);

    const navCountCart = document.querySelector('[data-cart-count]');
    const navCountWishlist = document.querySelector('[data-wishlist-count]');
    const savedCartCounter = getFromLocalStorage('cartCounter');
    const savedWishlistCounter = getFromLocalStorage('wishlistCounter');
    const counterItem = document.querySelectorAll('.cart-summary__value');

    if (savedCartCounter) {
      navCountCart.textContent = savedCartCounter;
      if (counterItem.length > 0) {
        counterItem[0].textContent = savedCartCounter;
      }
    }

    if (savedWishlistCounter) {
      navCountWishlist.textContent = savedWishlistCounter;
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
  } finally {
    hideLoader();
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

// theme
const themeBtn = document.querySelector('.theme-btn');
themeBtn.addEventListener('click', ThemeChange);
