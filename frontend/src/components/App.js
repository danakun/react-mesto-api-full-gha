import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import { api } from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from './ProtectedRoute.js';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login.js';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  // Хук для навигации
  const navigate = useNavigate();
  // Переменная состояния для логина юзера
  const [loggedIn, setLoggedIn] = useState(false);
  // Переменная состояния для мейла
  const [email, setEmail] = useState('');
  // Переменная состояния внутри попапа регистрации
  const [isSuccessful, setIsSuccessful] = useState(false);
  // Переменные состояния для открытия попапа регистрации
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);

  // Переменная состояния для инфо пользователя
  const [currentUser, setCurrentUser] = useState({});
  // Переменные состояний для попапов
  const [isAvatarPopupOpened, setIsAvatarPopupOpened] = useState(false);
  const [isEditProfilePopupOpened, setIsEditProfilePopupOpened] =
    useState(false);
  const [isAddPhotoPopupOpened, setIsAddPhotoPopupOpened] = useState(false);
  const [IsConfirmationPopupOpened, setIsConfirmationPopupOpened] =
    useState(false);
  // Переменная состояния для карточки
  const [selectedCard, setSelectedCard] = useState(null);
  // Переменная состояния для массива карточек
  const [cards, setCards] = useState([]);

  // Функция с промисом для данных профиля и карточки
  useEffect(() => {
    if (loggedIn) {
      api.setToken();
      Promise.all([api.getUserProfile(), api.getInitialCards()])
        .then(([me, cards]) => {    // .then(([currentUser, cards])
          setCurrentUser(me);  // setCurrentUser(currentUser)
          setCards(cards);
        })
        .catch((error) => console.log(`Ошибка: ${error}`));
    }
  }, [loggedIn]);

  // Проверка токена при первой загрузке

  useEffect(() => {
    const jwt = localStorage.getItem('jwt'); 
    if (jwt) {
      auth
        .getContent(jwt) //был передан 'jwt'
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.email);
          navigate('/');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [navigate]);

  // Обработчики тултип попапа
  function handleInfoTooltip() {
    setInfoTooltipPopupOpen(true);
  }

  // Обработчики открывания попапов по клику
  function handleEditAvatarClick() {
    setIsAvatarPopupOpened(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpened(true);
  }

  function handleAddPlaceClick() {
    setIsAddPhotoPopupOpened(true);
  }
  // Обработчик клика по карточке
  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    // const isLiked = card.likes.some((i) => i._id === currentUser._id);
    const isLiked = card.likes.some((like) => like === currentUser._id);
    // Отправляем запрос в api для данных о лайке
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))  
          //setCards((state) => state.filter((c) => c._id !== card._id));
        );
      })
      .catch((error) => console.log(`Ошибка: ${error}`));
  }
  // Обработчик удаления карточки
  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((thisCard) => thisCard._id !== card._id)
        );
      })
      .catch((error) => console.log(`Ошибка: ${error}`));
  }
  // Обработчик закрытия попапов
  function closeAllPopups() {
    setSelectedCard(null);
    setIsAvatarPopupOpened(false);
    setIsEditProfilePopupOpened(false);
    setIsAddPhotoPopupOpened(false);
    setIsConfirmationPopupOpened(false);
    setInfoTooltipPopupOpen(false);
  }

  // Функция для регистрации нового профиля
  function handleRegister(email, password) {
    return auth
      .register(email, password)
      .then(() => {
        handleInfoTooltip();
        setIsSuccessful(true);
        navigate('/sign-in');
      })
      .catch((err) => {
        handleInfoTooltip();
        setIsSuccessful(false);
        console.log(err);
      });
  }

  // Функция для логина профиля
  function handleLogin(email, password) {
    return auth
      .login(email, password)
      // .then((data) => {
      //   if (data) {
      //     localStorage.setItem('jwt', data.token);
      //     setLoggedIn(true);
      //     setEmail(email);
      //     navigate('/');
      //   }
      // })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        setEmail(email);
        navigate("/");
      })
      .catch((err) => {
        handleInfoTooltip();
        setIsSuccessful(false);
        console.log(err);
      });
  }

  // Функция для выхода из профиля
  function signOut() {
    localStorage.removeItem('jwt');
    navigate('/sign-in');
    setLoggedIn(false);
    setEmail('');
  }

  // Обработчик клика по оверлей
  const handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      closeAllPopups();
    }
  };

  function handleUpdateUser({ name, about }) {
    // Внутри этого обработчика вызовите api.setUserInfo.
    // После завершения запроса обновите стейт currentUser из полученных данных
    //  и закройте все модальные окна.
    api
      .editProfile(name, about)
      .then((newData) => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch((error) => console.log(error));
  }

  // Обработчик смены аватара
  function handleUpdateAvatar(avatar) {
    api
      .updateProfilePicture(avatar)
      .then((currentUser) => {
        setCurrentUser(currentUser);
        closeAllPopups();
      })
      .catch((error) => console.log(`Ошибка: ${error}`));
  }

  // Обработчик добавления новой карточки
  function handleAddPlaceSubmit(name, link) {
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.log(`Ошибка: ${error}`));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          email={email}
          loggedIn={loggedIn}
          onSignOut={signOut}
        />
        <Routes>
          <Route
            path="/sign-up"
            element={
              <Register
                handleRegister={handleRegister}
                name="register"
                title="Регистрация"
                buttonText="Зарегистрироваться"
              />
            }
          />
          <Route
            path="/sign-in"
            element={
              <Login
                handleLogin={handleLogin}
                name="login"
                title="Вход"
                buttonText="Войти"
              />
            }
          />
          <Route
            path="/"
            element={
              <>
                <ProtectedRoute
                  element={Main}
                  loggedIn={loggedIn}
                  onEditProfile={handleEditProfileClick}
                  onEditAvatar={handleEditAvatarClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="*"
            element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
        </Routes>
        <EditAvatarPopup
          isOpen={isAvatarPopupOpened}
          onClose={closeAllPopups}
          onOverlayClick={handleOverlayClick}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpened}
          onClose={closeAllPopups}
          onOverlayClick={handleOverlayClick}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPhotoPopupOpened}
          onClose={closeAllPopups}
          onOverlayClick={handleOverlayClick}
          onAddPlace={handleAddPlaceSubmit}
        />

        <PopupWithForm
          name="confirm-del"
          title="Вы уверены?"
          isOpen={IsConfirmationPopupOpened}
          onClose={closeAllPopups}
          buttonText="Да"
        ></PopupWithForm>
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
          onOverlayClick={handleOverlayClick}
        />
        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isSuccessful={isSuccessful}
          onOverlayClick={handleOverlayClick}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
