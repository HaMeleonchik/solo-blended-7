// Функції для роботи з бекендом

import axios from 'axios';
import { BASE_URL } from './constants';

export async function getProductById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function getProductByName(query, currentPage = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}/products/search?q=${query}&limit=12&skip=${
        (currentPage - 1) * 12
      }`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllCategory() {
  try {
    const response = await axios.get(`${BASE_URL}/products/category-list`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
export async function getProductsByCategory(category, currentPage = 1) {
  try {
    const response = await axios.get(
      `${BASE_URL}/products/category/${category}?limit=12&skip=${
        (currentPage - 1) * 12
      }`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts(currentPage) {
  try {
    const response = await axios.get(
      `${BASE_URL}/products?limit=12&skip=${(currentPage - 1) * 12}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
