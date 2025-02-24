import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosInstance } from 'axios';
import { History } from 'history';

import { ProductWithPaginationRdo } from '@src/rdo/product-with-pagination.rdo';
import { ApiRoute, AppRoute } from '@src/const';
import {
  Guitar,
  GuitarType,
  Product,
  User,
  UserLogin,
  UserRegister,
  UserToken,
} from '@src/types/types';
import { StatusCodes } from 'http-status-codes';
import { UserRdo } from '@src/rdo/user-rdo';
import { Token } from '@src/services/token';
import { CreateUserRdo } from '@src/rdo/create-user-rdo';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_PRODUCT_TYPES: 'product-types/fetch',
  FETCH_PRODUCTS: 'products/fetch',
  FETCH_PRODUCT: 'product/fetch',
  ADD_PRODUCT: 'product/add-product',
  EDIT_PRODUCT: 'product/edit-product',
  DELETE_PRODUCT: 'product/delete-product',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  GET_USER_STATUS: 'user/check-auth',
  REGISTER_USER: 'user/register',
};

export const fetchGuitarTypes = createAsyncThunk<
  GuitarType,
  undefined,
  { extra: Extra }
>(Action.FETCH_PRODUCT_TYPES, async (_arg, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<GuitarType>(ApiRoute.ShopProductTypes);
  return data;
});

export const fetchProducts = createAsyncThunk<
  ProductWithPaginationRdo,
  string,
  { extra: Extra }
>(Action.FETCH_PRODUCTS, async (queryParams: string, { extra }) => {
  const { api } = extra;
  const { data } = await api.get<ProductWithPaginationRdo>(
    `${ApiRoute.ShopProducts}?${queryParams}`
  );
  return data;
});

export const fetchProduct = createAsyncThunk<
  Guitar,
  Guitar['id'],
  { extra: Extra }
>(Action.FETCH_PRODUCT, async (productId, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.get<Guitar>(
      `${ApiRoute.ShopProducts}/${productId}`
    );

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === StatusCodes.NOT_FOUND) {
      history.push(AppRoute.NotFound);
    }

    return Promise.reject(error);
  }
});

export const addProduct = createAsyncThunk<Guitar, FormData, { extra: Extra }>(
  Action.ADD_PRODUCT,
  async (newProduct, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<Guitar>(ApiRoute.ShopProducts, newProduct);
    history.push(`${AppRoute.Products}/${data.id}`);

    return data;
  }
);

export const editProduct = createAsyncThunk<Guitar, FormData, { extra: Extra }>(
  Action.EDIT_PRODUCT,
  async (product, { extra }) => {
    const { api, history } = extra;
    const productId = product.get('id') as string;
    const { data } = await api.put<Guitar>(
      `${ApiRoute.ShopProducts}/${productId}`,
      product
    );
    history.push(`${AppRoute.Products}/${data.id}`);
    return data;
  }
);

export const deleteProduct = createAsyncThunk<
  void,
  Product['id'],
  { extra: Extra }
>(Action.DELETE_PRODUCT, async (productId, { extra }) => {
  const { api, history } = extra;
  await api.delete(`${ApiRoute.ShopProducts}/${productId}`);

  history.push(AppRoute.Root);
});

export const getUserStatus = createAsyncThunk<
  UserRdo,
  undefined,
  { extra: Extra }
>(Action.GET_USER_STATUS, async (_arg, { extra }) => {
  const { api } = extra;

  const refreshAccessToken = async (): Promise<UserToken> => {
    const { data } = await api.post<UserToken>(ApiRoute.TokenRefresh);
    return data;
  };

  try {
    // Попытка выполнить основной запрос
    const { data } = await api.post<UserRdo>(ApiRoute.UserCheckAuth);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === StatusCodes.UNAUTHORIZED) {
      Token.drop();
      try {
        // Если запрос вернул UNAUTHORIZED, пытаемся обновить токен
        const token = await refreshAccessToken();
        Token.save(token);

        // Повторяем основной запрос с новым токеном
        const { data } = await api.post<UserRdo>(ApiRoute.UserCheckAuth);
        return data;
      } catch (refreshError) {
        // Если обновление токена не удалось, отклоняем промис с ошибкой
        return Promise.reject(refreshError);
      }
    }

    // Если ошибка не связана с авторизацией, отклоняем промис с оригинальной ошибкой
    return Promise.reject(error);
  }
});

export const loginUser = createAsyncThunk<UserRdo, UserLogin, { extra: Extra }>(
  Action.LOGIN_USER,
  async (login: UserLogin, { extra }) => {
    const { api, history } = extra;

    const { data } = await api.post<User & UserToken>(
      ApiRoute.UserLogin,
      login
    );
    const { name, email, accessToken, refreshToken } = data;

    Token.save({ accessToken, refreshToken });
    history.push(AppRoute.Products);

    return { email, name };
  }
);

export const registerUser = createAsyncThunk<
  void,
  UserRegister,
  { extra: Extra }
>(Action.REGISTER_USER, async ({ email, password, name }, { extra }) => {
  const { api, history } = extra;

  await api.post<CreateUserRdo>(ApiRoute.UserRegister, {
    email,
    password,
    name,
  });
  history.push(AppRoute.Login);
});
