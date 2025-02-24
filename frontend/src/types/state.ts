import store from '@store';
import type { Guitar, GuitarType, ProductWithPagination, User } from './types';
import { AuthorizationStatus, SortType } from '@src/const';

export type SiteData = {
  guitarTypes: GuitarType | null;
  products: ProductWithPagination;
  isProductsLoading: boolean;
  product: Guitar | null;
  isProductLoading: boolean;
};

export type SiteProcess = {
  sorting: SortType;
};

export type UserProcess = {
  authorizationStatus: AuthorizationStatus;
  email: User['email'];
  name: User['name'];
};

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
