import { Link } from 'react-router-dom';

import { useAppSelector } from '@src/hooks';
import { userSelectors } from '@store';
import { AppRoute } from '@src/const';

const Header = () => {
  const isAuthorized = useAppSelector(userSelectors.authorizationStatus);
  const user = useAppSelector(userSelectors.user);
  return (
    <header
      className={['header', isAuthorized ? 'header--admin' : ''].join(' ')}
      id="header"
    >
      <div className="container">
        <div className="header__wrapper">
          <Link className="header__logo logo" to={AppRoute.Root}>
            <img
              className="logo__img"
              width="70"
              height="70"
              src="./img/svg/logo.svg"
              alt="Логотип"
            />
          </Link>
          <nav className="main-nav">
            <ul className="main-nav__list">
              <li className="main-nav__item">
                <Link className="link main-nav__link" to={AppRoute.Products}>
                  Каталог
                </Link>
              </li>
              <li className="main-nav__item">
                <Link className="link main-nav__link" to="#">
                  Где купить?
                </Link>
              </li>
              <li className="main-nav__item">
                <Link className="link main-nav__link" to="#">
                  О компании
                </Link>
              </li>
            </ul>
          </nav>
          <div className="header__container">
            <span className="header__user-name">{user.name}</span>
            <Link
              className="header__link"
              to={AppRoute.Login}
              aria-label="Перейти в личный кабинет"
            >
              <svg
                className="header__link-icon"
                width="12"
                height="14"
                aria-hidden="true"
              >
                <use xlinkHref="#icon-account"></use>
              </svg>
              <span className="header__link-text">Вход</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
