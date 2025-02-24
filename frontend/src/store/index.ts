import { configureStore } from '@reduxjs/toolkit';

import { fetchGuitarTypes, getUserStatus } from './action';
import { rootReducer } from './root-reducer';
import { createAPI } from '@src/services/api';
import history from '@src/history';
import { userProcess } from './user-process/user-process';
import { siteProcess } from './site-process/site-process';
import { siteData } from './site-data/site-data';

const api = createAPI();
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          api,
          history,
        },
      },
    }),
});

store.dispatch(getUserStatus());
store.dispatch(fetchGuitarTypes());

export default store;

export const userSelectors = userProcess.selectors;
export const { logout } = userProcess.actions;
export const productSelectors = siteData.selectors;
export const { clearProduct } = siteData.actions;
export const { setSorting } = siteProcess.actions;
export const getSorting = siteProcess.selectors.sorting;
