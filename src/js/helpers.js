//Допоміжні функції

// markupProduct
export function createMarkupProduct(product) {
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
// createMarkupModalProduct
export function createMarkupModalProduct({
  returnPolicy,
  title,
  category,
  images,
  description,
  shippingInformation,
  price,
}) {
  return `
<img class="modal-product__img" src="${images[0]}" alt="${description}" />
      <div class="modal-product__content">
        <p class="modal-product__title">${title}</p>
        <ul class="modal-product__tags">${category}</ul>
        <p class="modal-product__description">${description}</p>
        <p class="modal-product__shipping-information">Shipping:${shippingInformation}</p>
        <p class="modal-product__return-policy">Return Policy:${returnPolicy}</p>
        <p class="modal-product__price">Price:${price}$</p>
      </div>

  `;
}

const LoadMoreBtn = document.querySelector('.load-more-btn');
//  hide/show LoadMoreButton
export function showLoadMoreButton() {
  if (LoadMoreBtn) {
    LoadMoreBtn.style.display = 'block';
  }
}
export function hideLoadMoreButton() {
  if (LoadMoreBtn) {
    LoadMoreBtn.style.display = 'none';
  }
}

