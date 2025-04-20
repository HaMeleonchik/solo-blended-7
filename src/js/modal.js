//Описана робота модалки - відкриття закриття і все що з модалкою повʼязано
import { createMarkupModalProduct } from './helpers.js';
import { addToLocalStorage, getFromLocalStorage } from './storage.js';
import { getProductById } from './products-api.js';
import { renderProduct } from '/cart.js';
let idCard = 0;

const modalProductDiv = document.querySelector('.modal-product');
const modal = modalProductDiv.closest('.modal');

const modalCloseBtn = modal.querySelector('.modal__close-btn');

export async function clickCardFoo(event) {
  const card = event.target.closest('.products__item');
  if (!card) {
    return;
  }
  idCard = card.dataset.id;
  try {
    const getProduct = await getProductById(idCard);
    modalProductDiv.innerHTML = createMarkupModalProduct(getProduct);
    modal.classList.add('modal--is-open');

    // check Cart
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
    //   close Modal
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('modal--is-open');
    });
  } catch (error) {
    console.log(error);
  }
}

// add-and-Remove-To-Cart
const navCount = document.querySelector('.nav__count');
let counter = 0;

function modalProductCartFoo(event) {
  if (event.target.textContent === 'Remove from Cart') {
    const cards = getFromLocalStorage('Cards') || [];
    const removeCardsForStorage = cards.filter(id => id !== idCard);
    addToLocalStorage('Cards', removeCardsForStorage);
    counter = navCount.textContent = removeCardsForStorage.length;
    addToLocalStorage('cartCounter', counter);
    event.target.textContent = 'Add to cart';

    cartRenderFoo();
    return;
  }
  event.target.textContent = 'Remove from Cart';
  const cards = getFromLocalStorage('Cards') || [];
  cards.push(idCard);
  addToLocalStorage('Cards', cards);
  counter = navCount.textContent = [...cards].length;
  addToLocalStorage('cartCounter', counter);

  cartRenderFoo();
}

// cartRender
function cartRenderFoo() {
  const page = document.body.dataset.page;
  if (page === 'cart') {
    renderProduct();
  }
}
