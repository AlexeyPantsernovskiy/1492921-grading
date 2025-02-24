import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { Spinner } from '@components';
import { AppRoute, AuthorizationStatus } from '@src/const';
import { useAppSelector } from '@src/hooks';
import { userSelectors } from '@store';

type PrivateRouteProps = {
  restrictedFor: AuthorizationStatus;
  redirectTo: AppRoute;
  children: JSX.Element;
};

const PrivateRoute = ({
  children,
  restrictedFor,
  redirectTo,
}: PrivateRouteProps): JSX.Element => {
  const authorizationStatus = useAppSelector(userSelectors.authorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return authorizationStatus !== restrictedFor ? (
    children
  ) : (
    <Navigate to={redirectTo} />
  );
};

export default PrivateRoute;
