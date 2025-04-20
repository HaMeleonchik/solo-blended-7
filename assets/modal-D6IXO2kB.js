import{a as u,i as x}from"./vendor-CBLHhzjb.js";const i="https://dummyjson.com";async function S(o){try{return(await u.get(`${i}/products/${o}`)).data}catch(t){console.log(t)}}async function E(o,t=1){try{return(await u.get(`${i}/products/search?q=${o}&limit=12&skip=${(t-1)*12}`)).data}catch(r){console.log(r)}}async function F(){try{return(await u.get(`${i}/products/category-list`)).data}catch(o){console.log(o)}}async function z(o,t=1){try{return(await u.get(`${i}/products/category/${o}?limit=12&skip=${(t-1)*12}`)).data}catch(r){console.log(r)}}async function I(o){try{return(await u.get(`${i}/products?limit=12&skip=${(o-1)*12}`)).data}catch(t){console.log(t)}}function p(o,t){const r=JSON.stringify(t);try{localStorage.setItem(o,r)}catch(e){console.error(e)}}function l(o){try{const t=localStorage.getItem(o);return t===null?void 0:JSON.parse(t)}catch(t){console.error(t)}}function q(o){return o.map(({id:t,title:r,category:e,images:c,description:s,brand:a,price:f})=>`
  <li class="products__item" data-id="${t}">
    <img class="products__image" src="${c[0]}" alt="${s}"/>
    <p class="products__title">${r}</p>
    <p class="products__brand"><span class="products__brand--bold">Brand: ${a}</span></p>
    <p class="products__category">Category: ${e}</p>
    <p class="products__price">Price: $${f}</p>
 </li>
  `).join("")}function B({returnPolicy:o,title:t,category:r,images:e,description:c,shippingInformation:s,price:a}){return`
<img class="modal-product__img" src="${e[0]}" alt="${c}" />
      <div class="modal-product__content">
        <p class="modal-product__title">${t}</p>
        <ul class="modal-product__tags">${r}</ul>
        <p class="modal-product__description">${c}</p>
        <p class="modal-product__shipping-information">Shipping:${s}</p>
        <p class="modal-product__return-policy">Return Policy:${o}</p>
        <p class="modal-product__price">Price:${a}$</p>
      </div>

  `}const _=document.querySelector(".load-more-btn");function T(){_&&(_.style.display="block")}function N(){_&&(_.style.display="none")}P();const C=document.querySelector(".products-cart");C&&C.addEventListener("click",A);async function P(){try{const o=document.querySelector(".products-cart");if(!o)return;const t=l("Cards");if(!t||t.lenght===0)return;const r=t.map(n=>S(n)),e=await Promise.all(r),c=document.querySelector(".nav__count"),s=document.querySelectorAll(".cart-summary__value"),a=l("cartCounter");a&&(c.textContent=a,s.length>0&&(s[0].textContent=a));const L=e.map(n=>n.price).reduce((n,k)=>n+k,0),b=Math.round(L*100)/100;s.length>1&&(s[1].textContent=`$${b}`),o.innerHTML=q(e)}catch(o){console.log(o)}}const m=document.querySelector(".cart-summary__btn");m&&!m.dataset.listenerAdded&&(m.addEventListener("click",w),m.dataset.listenerAdded="true");function w(){x.show({backgroundColor:"green",message:"Successful buy product",messageColor:"white",position:"topRight",close:!1,iconUrl:"icon/success.svg"})}let d=0;const v=document.querySelector(".modal-product"),y=v.closest(".modal"),M=y.querySelector(".modal__close-btn");async function A(o){const t=o.target.closest(".products__item");if(t){d=t.dataset.id;try{const r=await S(d);v.innerHTML=B(r),y.classList.add("modal--is-open");const e=y.querySelector(".modal-product__btn--cart");(l("Cards")||[]).find(a=>a===d)?e.textContent="Remove from Cart":e.textContent="Add to cart",e.addEventListener("click",R),M.addEventListener("click",()=>{y.classList.remove("modal--is-open")})}catch(r){console.log(r)}}}const $=document.querySelector(".nav__count");let g=0;function R(o){if(o.target.textContent==="Remove from Cart"){const e=(l("Cards")||[]).filter(c=>c!==d);p("Cards",e),g=$.textContent=e.length,p("cartCounter",g),o.target.textContent="Add to cart",h();return}o.target.textContent="Remove from Cart";const t=l("Cards")||[];t.push(d),p("Cards",t),g=$.textContent=[...t].length,p("cartCounter",g),h()}function h(){document.body.dataset.page==="cart"&&P()}export{I as a,z as b,q as c,A as d,l as e,E as f,F as g,N as h,T as s};
//# sourceMappingURL=modal-D6IXO2kB.js.map
