import"./assets/styles-C18aTrnn.js";import{a as p}from"./assets/vendor-C19taMLP.js";const g="https://dummyjson.com";async function S(t){try{return(await p.get(`${g}/products/${t}`)).data}catch(o){console.log(o)}}async function A(t,o=1){try{return(await p.get(`${g}/products/search?q=${t}&limit=12&skip=${(o-1)*12}`)).data}catch(e){console.log(e)}}async function T(){try{return(await p.get(`${g}/products/category-list`)).data}catch(t){console.log(t)}}async function k(t,o=1){try{return(await p.get(`${g}/products/category/${t}?limit=12&skip=${(o-1)*12}`)).data}catch(e){console.log(e)}}async function $(t){try{return(await p.get(`${g}/products?limit=12&skip=${(t-1)*12}`)).data}catch(o){console.log(o)}}q();let i="",r=0,n="All";const s=document.querySelector("ul.products"),b=document.querySelector("ul.categories"),f=document.querySelector("div.not-found");function q(){T().then(t=>{t.unshift("All");const o=t.map(e=>`
    <li class="categories__item">
   <button class="categories__btn" type="button">${e}</button>
 </li>
    `).join("");b.insertAdjacentHTML("beforeend",o),b.addEventListener("click",C)}).catch(t=>console.log(t))}async function C(t){if(t.target.nodeName!=="BUTTON")return;M(),i=t.target.textContent,i==="All"?n="All":n="category",b.querySelectorAll("button").forEach(c=>c.classList.remove("categories__btn--active")),t.target.closest("button").classList.add("categories__btn--active"),r=1;try{if(i==="All"){const l=await $(r);s.innerHTML=a(l.products),l.products.length>=12?y():d();return}const c=await k(i,r);c.products.length>=12?y():d(),s.innerHTML=a(c.products)}catch(c){console.log(c)}}function a(t){return t.map(({id:o,title:e,category:c,images:l,description:_,brand:h,price:H})=>`
  <li class="products__item" data-id="${o}">
    <img class="products__image" src="${l[0]}" alt="${_}"/>
    <p class="products__title">${e}</p>
    <p class="products__brand"><span class="products__brand--bold">Brand: ${h}</span></p>
    <p class="products__category">Category: ${c}</p>
    <p class="products__price">Price: $${H}</p>
 </li>
  `).join("")}function y(){u&&(u.style.display="block")}function d(){u&&(u.style.display="none")}s.addEventListener("click",E);const B=document.querySelector(".modal-product"),v=B.closest(".modal");async function E(t){const o=t.target.closest(".products__item");if(!o)return;const e=o.dataset.id;try{const c=await S(e);B.innerHTML=F(c),v.classList.add("modal--is-open")}catch(c){console.log(c)}}v.addEventListener("click",j);function j(){v.classList.remove("modal--is-open")}function F({returnPolicy:t,title:o,category:e,images:c,description:l,shippingInformation:_,price:h}){return`
<img class="modal-product__img" src="${c[0]}" alt="" />
      <div class="modal-product__content">
        <p class="modal-product__title">${o}</p>
        <ul class="modal-product__tags">${e}</ul>
        <p class="modal-product__description">${l}</p>
        <p class="modal-product__shipping-information">Shipping:${_}</p>
        <p class="modal-product__return-policy">Return Policy:${t}</p>
        <p class="modal-product__price">Price:${h}$</p>
        <button class="modal-product__buy-btn" type="button">Buy</button>
      </div>

  `}const P=document.querySelector(".search-form"),w=P.querySelector(".search-form__input");let m="";P.addEventListener("submit",N);async function N(t){t.preventDefault(),r=1,n="search",M();try{if(m=w.value.trim(),m==="")return;const o=await A(m,r);o.products.length>=12?y():d(),o.products.length===0&&(s.innerHTML="",f.classList.add("not-found--visible")),s.innerHTML=a(o.products)}catch(o){console.log(o)}}const R=document.querySelector(".search-form__btn-clear");R.addEventListener("click",x);async function x(){w.value="",n="All",M();const t=await $(r);s.innerHTML=a(t.products),t.products.length>=12?y():d()}const u=document.querySelector(".load-more-btn");u.addEventListener("click",D);async function D(){r+=1;try{if(n==="All"){const{products:t}=await $(r);L(t),s.insertAdjacentHTML("beforeend",a(t))}else if(n==="category"){const{products:t}=await k(i,r);L(t),s.insertAdjacentHTML("beforeend",a(t))}else if(n==="search"){const{products:t}=await A(m,r);L(t),s.insertAdjacentHTML("beforeend",a(t))}}catch(t){console.log(t)}}function L(t){t.length===0&&(f.classList.add("not-found--visible"),d())}function M(){f.classList.contains("not-found--visible")&&f.classList.remove("not-found--visible")}
//# sourceMappingURL=index.js.map
