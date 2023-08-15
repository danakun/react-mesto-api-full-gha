import { Routes, Route, Link } from 'react-router-dom';

function Header({ email, onSignOut }) {
  return (
    <header className="header header-container">
      <div
        className="header__link"
        href="#"
        target="_blank"
      >
        <div
          className="header__logo"
          aria-label="Проект Место"
        ></div>
      </div>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <Link
              className="header__auth"
              to="/sign-up"
            >
              Регистрация
            </Link>
          }
        />
        <Route
          path="sign-up"
          element={
            <Link
              className="header__auth"
              to="/sign-in"
            >
              Войти
            </Link>
          }
        />
        <Route
          path="/"
          element={
            <>
              <div className="header__navigate">
                <p className="header__email">{email}</p>
                <button
                  type="button"
                  className="header__navigate-button"
                  onClick={onSignOut}
                >
                  Выйти
                </button>
              </div>
            </>
          }
        />
      </Routes>
    </header>
  );
}

export default Header;
