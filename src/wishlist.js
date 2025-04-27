//Логіка сторінки Wishlist
import { getFromLocalStorage } from './js/storage.js';
import { getProductById } from './js/products-api.js';
import { createMarkupProduct, showLoader, hideLoader } from './js/helpers.js';
import { clickCardFoo } from './js/modal.js';
import { ThemeChange, setThemeFromLocalStorage } from './js/theme-switcher.js';
setThemeFromLocalStorage();

// modal
const productsList = document.querySelector('.products-wishlist');
if (productsList) {
  productsList.addEventListener('click', clickCardFoo);
}

renderProductWishlist();
export async function renderProductWishlist() {
  try {
    showLoader();
    const productsList = document.querySelector('.products-wishlist');
    if (!productsList) return;

    const cards = getFromLocalStorage('Wishlist');
    if (!cards || cards.lenght === 0) {
      return;
    }
    const productPromise = cards.map(id => getProductById(id));
    const product = await Promise.all(productPromise);

    // counters
    const navCountCart = document.querySelector('[data-cart-count]');
    const navCountWishlist = document.querySelector('[data-wishlist-count]');
    const savedCartCounter = getFromLocalStorage('cartCounter');
    const savedWishlistCounter = getFromLocalStorage('wishlistCounter');
    if (savedCartCounter) {
      navCountCart.textContent = savedCartCounter;
    }
    if (savedWishlistCounter) {
      navCountWishlist.textContent = savedWishlistCounter;
    }

    productsList.innerHTML = createMarkupProduct(product);
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
}

// theme
const themeBtn = document.querySelector('.theme-btn');
themeBtn.addEventListener('click', ThemeChange);
