//Описана робота модалки - відкриття закриття і все що з модалкою повʼязано
import { createMarkupModalProduct } from './helpers.js';
import { addToLocalStorage, getFromLocalStorage } from './storage.js';
import { getProductById } from './products-api.js';
import { renderProductCart } from '/cart.js';
import { renderProductWishlist } from '/wishlist.js';
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
    const cartCards = getFromLocalStorage('Cards') || [];
    const productCartCheck = cartCards.find(card => card === idCard);
    if (productCartCheck) {
      modalProductCartBtn.textContent = 'Remove from Cart';
    } else {
      modalProductCartBtn.textContent = 'Add to cart';
    }
    // check WishList
    const modalProductWishListBtn = document.querySelector(
      '.modal-product__btn--wishlist'
    );
    const wishlistcards = getFromLocalStorage('Wishlist') || [];
    const productWishlistCheck = wishlistcards.find(card => card === idCard);
    if (productWishlistCheck) {
      modalProductWishListBtn.textContent = 'Remove from Wishlist';
    } else {
      modalProductWishListBtn.textContent = 'Add to Wishlist';
    }
    //card listener
    modalProductCartBtn.addEventListener('click', modalProductCartFoo);
    modalProductWishListBtn.addEventListener('click', modalProductWishlistFoo);

    //   close Modal
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('modal--is-open');
    });
  } catch (error) {
    console.log(error);
  }
}

// add-and-Remove-To-Cart
const navCountCart = document.querySelector('[data-cart-count]');
const navCountWishlist = document.querySelector('[data-wishlist-count]');
let Cartcounter = 0;
let Wishlistcounter = 0;
function modalProductCartFoo(event) {
  if (event.target.textContent === 'Remove from Cart') {
    const cards = getFromLocalStorage('Cards') || [];
    const removeCardsForStorage = cards.filter(id => id !== idCard);
    addToLocalStorage('Cards', removeCardsForStorage);
    Cartcounter = navCountCart.textContent = removeCardsForStorage.length;
    addToLocalStorage('cartCounter', Cartcounter);
    event.target.textContent = 'Add to cart';

    cartRenderFoo();
    return;
  }
  event.target.textContent = 'Remove from Cart';
  const cards = getFromLocalStorage('Cards') || [];
  cards.push(idCard);
  addToLocalStorage('Cards', cards);
  Cartcounter = navCountCart.textContent = [...cards].length;
  addToLocalStorage('cartCounter', Cartcounter);

  cartRenderFoo();
}

// cartRender
function cartRenderFoo() {
  const page = document.body.dataset.page;
  if (page === 'cart') {
    renderProductCart();
  }
}

// add-and-Remove-To-Wishlist
function modalProductWishlistFoo(event) {
  if (event.target.textContent === 'Remove from Wishlist') {
    const cards = getFromLocalStorage('Wishlist') || [];
    const removeCardsForStorage = cards.filter(id => id !== idCard);
    addToLocalStorage('Wishlist', removeCardsForStorage);
    Wishlistcounter = navCountWishlist.textContent =
      removeCardsForStorage.length;
    addToLocalStorage('wishlistCounter', Wishlistcounter);
    event.target.textContent = 'Add to Wishlist';

    wishlistRenderFoo();
    return;
  }
  event.target.textContent = 'Remove from Wishlist';
  const cards = getFromLocalStorage('Wishlist') || [];
  cards.push(idCard);
  addToLocalStorage('Wishlist', cards);
  Wishlistcounter = navCountWishlist.textContent = [...cards].length;
  addToLocalStorage('wishlistCounter', Wishlistcounter);

  wishlistRenderFoo();
}
// cartRender
function wishlistRenderFoo() {
  const page = document.body.dataset.page;
  if (page === 'wishlist') {
    renderProductWishlist();
  }
}
