import React from 'react';
import iconError from '../images/icon-error.png';
import iconSuccess from '../images/icon-success.png';

function InfoTooltip({ isOpen, onClose, isSuccessful, onOverlayClick }) {
  const message = `${
    isSuccessful
      ? 'Вы успешно зарегистрировались!'
      : `Что-то пошло не так!
      Попробуйте ещё раз.`
  }`;

  const icon = `${isSuccessful ? iconSuccess : iconError}`;

  return (
    <section
      className={`popup ${isOpen ? 'popup_opened' : ''}`}
      id="popup-info-tooltip"
      onClick={onOverlayClick}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
        />
        <img
          className="popup__icon popup__icon_type_tooltip"
          src={icon}
          alt={message}
        />
        <p className="popup__info">{message}</p>
      </div>
    </section>
  );
}

export default InfoTooltip;
