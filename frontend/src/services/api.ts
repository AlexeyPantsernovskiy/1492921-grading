import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import { Token } from './token';
import { BACKEND_URL, REQUEST_TIMEOUT } from '@src/const';

import store, { logout } from '@store';

type DetailMessageType = {
  type: string;
  message: string | string[];
};

type IgnoreErrorMessage = {
  Start?: string;
  End?: string;
  Include?: string;
};

const IgnoreErrorMessages: IgnoreErrorMessage[] = [
  { Include: 'Token' },
  //{ Start: 'Access' },
  //{ Start: 'Offer with id', End: 'not found.' },
];

const ignoreErrorMessage = (errorMessage: string): boolean =>
  IgnoreErrorMessages.reduce(
    (result, item) =>
      result ||
      (errorMessage.includes(item.Include ?? '') &&
        errorMessage.startsWith(item.Start ?? '') &&
        errorMessage.endsWith(item.End ?? '')),
    false
  );

const StatusCodeMapping = new Set([
  //StatusCodes.BAD_REQUEST,
  StatusCodes.UNAUTHORIZED,
  StatusCodes.NOT_FOUND,
  //StatusCodes.FORBIDDEN,
  //StatusCodes.CONFLICT,
]);

const shouldDisplayError = (response: AxiosResponse) =>
  StatusCodeMapping.has(response.status);

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = Token.getAccessToken() || Token.getRefreshToken();

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageType>) => {
      if (!error.response) {
        toast.error(error.message);
        throw error;
      }

      if (error.response.status === StatusCodes.UNAUTHORIZED) {
        store.dispatch(logout());
      }

      if (!shouldDisplayError(error.response)) {
        const detailMessage = error.response.data;

        const errorMessage =
          typeof detailMessage.message === 'string'
            ? detailMessage.message
            : detailMessage.message.join('\n');
        if (!ignoreErrorMessage(errorMessage)) {
          toast.warn(errorMessage);
        }
      }
      throw error;
    }
  );

  return api;
};
