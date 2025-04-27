// Change Theme
import { addToLocalStorage, getFromLocalStorage } from './storage.js';
export function ThemeChange() {
  document.body.classList.toggle('theme-dark');
  document.body.classList.toggle('theme-light');

  const bodyClass = document.body.classList.value;

  addToLocalStorage('theme', bodyClass);
}

export function setThemeFromLocalStorage() {
  const theme = getFromLocalStorage('theme');
  if (theme) {
    document.body.classList.value = theme;
  }
}
