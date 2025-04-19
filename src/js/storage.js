//Робота з loacalStorage
export function addToLocalStorage(key, value) {
  const normalizeData = JSON.stringify(value);
  try {
    localStorage.setItem(key, normalizeData);
  } catch (error) {
    console.error(error);
  }
}

export function getFromLocalStorage(key) {
  try {
    const lsData = localStorage.getItem(key);
    if (lsData === null) {
      return;
    }

    const normalizeData = JSON.parse(lsData);

    return normalizeData;
  } catch (error) {
    console.error(error);
  }
}

export function removeFromLocalStorage(key) {
  try {
    const lsData = localStorage.getItem(key);
    if (lsData === null) {
      return;
    }
    localStorage.removeItem(key);
    return;
  } catch (error) {
    console.error(error);
  }
}
