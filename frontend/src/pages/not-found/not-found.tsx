import { JSX } from 'react';

import { AppRoute } from '@src/const';
import historyBrowser from '@src/history';

const NotFound = (): JSX.Element => (
  <section className="error">
    <h1 className="error__title">404</h1>
    <span className="error__subtitle">Страница не найдена.</span>
    <p className="error__text">
      Возможно, страница была удалена или
      <br />
      её вовсе не существовало.
    </p>
    <button
      className="button button__error button--small button--black-border"
      onClick={() => historyBrowser.push(AppRoute.Root)}
    >
      Продолжить покупки
    </button>
  </section>
);

export default NotFound;
