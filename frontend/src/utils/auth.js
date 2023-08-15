export const BASE_URL = 'http://localhost:3000';
 // export const BASE_URL = 'https://mesto.nomoreparties.co/v1/cohort-54';

const getResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(getResponse);
};

export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    // credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(getResponse);
};

export const getContent = (jwt) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    // credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      Authorization : `Bearer ${jwt}`, // 'Authorization'?????????
    },
  }).then(getResponse);
};
