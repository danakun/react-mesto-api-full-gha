import { BASE_URL } from './auth';

class Api {
    constructor({ baseUrl, headers}) {
    this._headers = headers;
      this._baseUrl = baseUrl;
    }
  
    getResponseData(res) {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    }

    getInitialCards() {
      return fetch(`${this._baseUrl}/cards`, {
       // credentials: "include",
        headers: this._headers,
      }).then(this.getResponseData);
    };
  
    // другие методы работы с API
    getUserProfile() {
      return fetch(`${this._baseUrl}/users/me`, {
       // credentials: "include",
        headers: this._headers,
      }).then(this.getResponseData);
    }
  
    editProfile(name, job) {
      return fetch(`${this._baseUrl}/users/me`, {
        method: "PATCH",
       // credentials: "include",
        headers: this._headers,
        body: JSON.stringify({
          name: name,
          about: job,
        }),
      }).then(this.getResponseData);
    }
  
    addCard(name, link) { 
      return fetch(`${this._baseUrl}/cards`, {
        method: "POST",
       // credentials: "include",
        headers: this._headers,
        body: JSON.stringify({
          name,
          link,
        }),
      }).then(this.getResponseData);
    }
  
    deleteCard(id) {
      return fetch(`${this._baseUrl}/cards/${id}`, {
        method: "DELETE",
      //  credentials: "include",
        headers: this._headers,
      }).then(this.getResponseData);
    }
  
    deleteLike(id) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: "DELETE",
      //  credentials: "include",
        headers: this._headers,
      }).then(this.getResponseData);
    }
  
    addLike(id) {
      return fetch(`${this._baseUrl}/cards/${id}/likes`, {
        method: "PUT",
       // credentials: "include",
        headers: this._headers,
      }).then(this.getResponseData);
    }
  
    changeLikeCardStatus(id, isLiked) {
      if (isLiked) {
        //return this.deleteLike(id)
        return this.addLike(id);
      }
      //return this.addLike(id);
      return this.deleteLike(id);
    }

    updateProfilePicture({ avatar }) { // updateProfilePicture(avatar)
      return fetch(`${this._baseUrl}/users/me/avatar`, {
        method: "PATCH",
      //  credentials: "include",
        headers: this._headers,
        body: JSON.stringify({
          avatar: avatar,
        }),
      }).then(this.getResponseData);
    }

    setToken() {
      this._headers.authorization = `Bearer ${localStorage.getItem('jwt')}`;
     }
  }
  
  export const api = new Api({
    // baseUrl: "https://mesto.nomoreparties.co/v1/cohort-54",
    baseUrl: BASE_URL,
    headers: {
      authorization: "e95edce0-fc31-46d4-a095-2c86db687d23",
      "Content-Type": "application/json",
    },
  });
  

  