//Логіка сторінки Home
import {
  getAllCategory,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getProductByName,
} from './js/products-api.js';

import { addToLocalStorage, getFromLocalStorage } from './js/storage.js';
import { createMarkupProduct, createMarkupModalProduct } from './js/helpers.js';

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

//  hide/show LoadMoreButton
function showLoadMoreButton() {
  if (LoadMoreBtn) {
    LoadMoreBtn.style.display = 'block';
  }
}
function hideLoadMoreButton() {
  if (LoadMoreBtn) {
    LoadMoreBtn.style.display = 'none';
  }
}
// modal
productList.addEventListener('click', clickCardFoo);

const modalProductDiv = document.querySelector('.modal-product');
const modal = modalProductDiv.closest('.modal');

const modalCloseBtn = modal.querySelector('.modal__close-btn');

async function clickCardFoo(event) {
  const card = event.target.closest('.products__item');
  if (!card) {
    return;
  }
  idCard = card.dataset.id;
  try {
    const getProduct = await getProductById(idCard);
    modalProductDiv.innerHTML = createMarkupModalProduct(getProduct);
    modal.classList.add('modal--is-open');

    // check
    const modalProductCartBtn = modal.querySelector(
      '.modal-product__btn--cart'
    );
    const cards = getFromLocalStorage('Cards') || [];
    const productCheck = cards.find(card => card === idCard);
    if (productCheck) {
      modalProductCartBtn.textContent = 'Remove from Cart';
    } else {
      modalProductCartBtn.textContent = 'Add to cart';
    }

    //card listener
    modalProductCartBtn.addEventListener('click', modalProductCartFoo);
  } catch (error) {
    console.log(error);
  }
}

// Вихід з модалки
modalCloseBtn.addEventListener('click', closeModalFoo);
function closeModalFoo() {
  modal.classList.remove('modal--is-open');
}
// add-and-Remove-To-Cart
const navCount = document.querySelector('.nav__count');
let counter = 0;
// savedCartCounter
const savedCartCounter = getFromLocalStorage('cartCounter');
if (savedCartCounter) {
  counter = savedCartCounter;
  navCount.textContent = counter;
}

function modalProductCartFoo(event) {
  if (event.target.textContent === 'Remove from Cart') {
    const cards = getFromLocalStorage('Cards') || [];
    const removeCardsForStorage = cards.filter(id => id !== idCard);
    addToLocalStorage('Cards', removeCardsForStorage);
    counter = navCount.textContent = removeCardsForStorage.length;
    addToLocalStorage('cartCounter', counter);

    event.target.textContent = 'Add to cart';
    return;
  }
  event.target.textContent = 'Remove from Cart';
  const cards = getFromLocalStorage('Cards') || [];
  cards.push(idCard);
  addToLocalStorage('Cards', cards);
  counter = navCount.textContent = [...cards].length;
  addToLocalStorage('cartCounter', counter);
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
