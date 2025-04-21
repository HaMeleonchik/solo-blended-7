//Логіка сторінки Home
import {
  getAllCategory,
  getAllProducts,
  getProductsByCategory,
  getProductByName,
} from './js/products-api.js';


import { getFromLocalStorage } from './js/storage.js';
import {
  createMarkupProduct,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/helpers.js';

import { clickCardFoo } from './js/modal.js';

categoryRender();

let categoryName = '';
let currentPage = 0;
let currentMode = 'All';
let idCard = 0;

const productList = document.querySelector('ul.products');
const CategorieList = document.querySelector('ul.categories');
const divNotFound = document.querySelector('div.not-found');

// categoryRender
function categoryRender() {
  getAllCategory()
    .then(res => {
      res.unshift('All');
      const categoriesItem = res
        .map(
          category => `
    <li class="categories__item">
   <button class="categories__btn" type="button">${category}</button>
 </li>
    `
        )
        .join('');
      CategorieList.insertAdjacentHTML('beforeend', categoriesItem);
      CategorieList.addEventListener('click', renderProduct);
    })
    .catch(rej => console.log(rej));
}

// renderProduct
async function renderProduct(event) {
  if (event.target.nodeName !== 'BUTTON') {
    return;
  }
  productHaveCheckNoneActive();
  categoryName = event.target.textContent;

  if (categoryName === 'All') {
    currentMode = 'All';
  } else {
    currentMode = 'category';
  }

  const allBtn = CategorieList.querySelectorAll('button');
  allBtn.forEach(btn => btn.classList.remove('categories__btn--active'));

  const clickButton = event.target.closest('button');
  clickButton.classList.add('categories__btn--active');

  currentPage = 1;
  try {
    if (categoryName === 'All') {
      const allProducts = await getAllProducts(currentPage);
      productList.innerHTML = createMarkupProduct(allProducts.products);
      if (allProducts.products.length >= 12) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
      }
      return;
    }

    const res = await getProductsByCategory(categoryName, currentPage);

    if (res.products.length >= 12) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }

    productList.innerHTML = createMarkupProduct(res.products);
  } catch (error) {
    console.log(error);
  }
}

// modal
productList.addEventListener('click', clickCardFoo);

// add-and-Remove-To-Cart
const navCountCart = document.querySelector('[data-cart-count]');
let cartCounter = 0;
// savedCartCounter
const savedCartCounter = getFromLocalStorage('cartCounter');
if (savedCartCounter) {
  cartCounter = savedCartCounter;
  navCountCart.textContent = cartCounter;
}

// add-and-Remove-To-wishlist
const navCountWishlist = document.querySelector('[data-wishlist-count]');
let wishlistCounter = 0;
// savedWishlistCounter
const savedWishlistCounter = getFromLocalStorage('wishlistCounter');
if (savedWishlistCounter) {
  wishlistCounter = savedWishlistCounter;
  navCountWishlist.textContent = wishlistCounter;
}

// form
const form = document.querySelector('.search-form');
const inputSearch = form.querySelector('.search-form__input');
let inpValue = '';
form.addEventListener('submit', searchFormFoo);

async function searchFormFoo(event) {
  event.preventDefault();
  currentPage = 1;
  currentMode = 'search';
  productHaveCheckNoneActive();

  try {
    inpValue = inputSearch.value.trim();
    if (inpValue === '') {
      return;
    }
    const getProducts = await getProductByName(inpValue, currentPage);

    if (getProducts.products.length >= 12) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
    if (getProducts.products.length === 0) {
      productList.innerHTML = '';
      divNotFound.classList.add('not-found--visible');
    }
    productList.innerHTML = createMarkupProduct(getProducts.products);
  } catch (error) {
    console.log(error);
  }
}
// btn-clear
const clearBtn = document.querySelector('.search-form__btn-clear');
clearBtn.addEventListener('click', clearBtnFoo);

async function clearBtnFoo() {
  inputSearch.value = '';
  currentMode = 'All';
  productHaveCheckNoneActive();

  const allProducts = await getAllProducts(currentPage);
  productList.innerHTML = createMarkupProduct(allProducts.products);
  if (allProducts.products.length >= 12) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
  }
  return;
}

// LoadMoreBtn
const LoadMoreBtn = document.querySelector('.load-more-btn');
LoadMoreBtn.addEventListener('click', loadMoreFoo);

async function loadMoreFoo() {
  currentPage += 1;
  try {
    if (currentMode === 'All') {
      const { products } = await getAllProducts(currentPage);

      productHaveCheckActive(products);

      productList.insertAdjacentHTML(
        'beforeend',
        createMarkupProduct(products)
      );
    } else if (currentMode === 'category') {
      const { products } = await getProductsByCategory(
        categoryName,
        currentPage
      );
      productHaveCheckActive(products);
      productList.insertAdjacentHTML(
        'beforeend',
        createMarkupProduct(products)
      );
    } else if (currentMode === 'search') {
      const { products } = await getProductByName(inpValue, currentPage);
      productHaveCheckActive(products);
      productList.insertAdjacentHTML(
        'beforeend',
        createMarkupProduct(products)
      );
    }
  } catch (error) {
    console.log(error);
  }
}
// products.length === 0
function productHaveCheckActive(products) {
  if (products.length === 0) {
    divNotFound.classList.add('not-found--visible');
    hideLoadMoreButton();
  }
}

function productHaveCheckNoneActive() {
  if (divNotFound.classList.contains('not-found--visible'))
    divNotFound.classList.remove('not-found--visible');
}
