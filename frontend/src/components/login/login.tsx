import { FormEvent, JSX } from 'react';
import { Link } from 'react-router-dom';

import { EmailField, PasswordField } from '@components';
import { AppRoute } from '@src/const';
import { useAppDispatch } from '@src/hooks';
import { loginUser } from '@src/store/action';
import { UserLogin } from '@src/types/types';

const Login = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UserLogin = {
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || '',
    };
    dispatch(loginUser(data));
  };

  return (
    <section className="login">
      <h1 className="login__title">Войти</h1>
      <p className="login__text">
        Hовый пользователь?{' '}
        <Link className="login__link" to={AppRoute.Register}>
          Зарегистрируйтесь
        </Link>{' '}
        прямо сейчас
      </p>
      <form method="post" action="/" onSubmit={handleFormSubmit}>
        <EmailField />
        <PasswordField />
        <button className="button login__button button--medium" type="submit">
          Войти
        </button>
      </form>
    </section>
  );
};

export default Login;
