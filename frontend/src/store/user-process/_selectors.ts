import { AuthorizationStatus, StoreSlice } from '@src/const';
import { State } from '@src/types/state';
import { User } from '@src/types/types';


export const getAuthorizationStatus = ({
  [StoreSlice.UserProcess]: USER_PROCESS,
}: State): AuthorizationStatus => USER_PROCESS.authorizationStatus;

export const getIsAuthorized = ({
  [StoreSlice.UserProcess]: USER_PROCESS,
}: State): boolean =>
  USER_PROCESS.authorizationStatus === AuthorizationStatus.Auth;

export const getUser = ({
  [StoreSlice.UserProcess]: USER_PROCESS,
}: State): User => ({
  email: USER_PROCESS.email,
  name: USER_PROCESS.name,
});
