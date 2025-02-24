import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthorizationStatus, StoreSlice } from '@src//const';
import { UserProcess } from '@src/types/state';
import { User } from '@src/types/types';
import { getUserStatus, loginUser } from '../action';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  email: '',
  name: '',
};

const userAuth = (state: UserProcess, action: PayloadAction<User>) => {
  state.authorizationStatus = AuthorizationStatus.Auth;
  state.email = action.payload.email;
  state.name = action.payload.name;
};

const userNoAuth = (state: UserProcess) => {
  state.authorizationStatus = AuthorizationStatus.NoAuth;
  state.email = '';
  state.name = '';
};

export const userProcess = createSlice({
  name: StoreSlice.UserProcess,
  initialState,
  reducers: {
    logout: userNoAuth,
  },
  extraReducers(builder) {
    builder
      .addCase(getUserStatus.fulfilled, userAuth)
      .addCase(getUserStatus.rejected, userNoAuth)
      .addCase(loginUser.fulfilled, userAuth);
  },
  selectors: {
    authorizationStatus: (state) => state.authorizationStatus,
    user: (state) => ({ name: state.name, email: state.email }),
    isLogged: (state) => state.authorizationStatus === AuthorizationStatus.Auth,
  },
});
