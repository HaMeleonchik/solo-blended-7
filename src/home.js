//Логіка сторінки Home
import {
  getAllCategory,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  getProductByName,
} from './js/products-api.js';

categoryRender();

let categoryName = '';
let currentPage = 0;
let currentMode = 'All';

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

// markupProduct
function createMarkupProduct(product) {
  return product
    .map(
      ({ id, title, category, images, description, brand, price }) =>
        `
  <li class="products__item" data-id="${id}">
    <img class="products__image" src="${images[0]}" alt="${description}"/>
    <p class="products__title">${title}</p>
    <p class="products__brand"><span class="products__brand--bold">Brand: ${brand}</span></p>
    <p class="products__category">Category: ${category}</p>
    <p class="products__price">Price: $${price}</p>
 </li>
  `
    )
    .join('');
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

async function clickCardFoo(event) {
  const card = event.target.closest('.products__item');
  if (!card) {
    return;
  }
  const idCard = card.dataset.id;
  try {
    const getProduct = await getProductById(idCard);
    modalProductDiv.innerHTML = createMarkupModalProduct(getProduct);
    modal.classList.add('modal--is-open');
  } catch (error) {
    console.log(error);
  }
}

// Тут вихід з модалки(виходить коли натиснути на модальне вікно або на любий обєкт в ній)

modal.addEventListener('click', closeModalFoo);
function closeModalFoo() {
  modal.classList.remove('modal--is-open');
}

// createMarkupModalProduct
function createMarkupModalProduct({
  returnPolicy,
  title,
  category,
  images,
  description,
  shippingInformation,
  price,
}) {
  return `
<img class="modal-product__img" src="${images[0]}" alt="" />
      <div class="modal-product__content">
        <p class="modal-product__title">${title}</p>
        <ul class="modal-product__tags">${category}</ul>
        <p class="modal-product__description">${description}</p>
        <p class="modal-product__shipping-information">Shipping:${shippingInformation}</p>
        <p class="modal-product__return-policy">Return Policy:${returnPolicy}</p>
        <p class="modal-product__price">Price:${price}$</p>
        <button class="modal-product__buy-btn" type="button">Buy</button>
      </div>

  `;
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
