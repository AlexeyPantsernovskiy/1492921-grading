import { JSX } from 'react';
import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import {
  AddProduct,
  EditProduct,
  Footer,
  Header,
  Login,
  PrivateRoute,
  Product,
  ProductList,
  Registration,
} from '@components';
import { AppRoute, AuthorizationStatus } from '@src/const';
import NotFound from '@pages/not-found/not-found';
import Main from '@pages/main/main';
import historyBrowser from '@src/history';

const App = (): JSX.Element => (
  <HistoryRouter history={historyBrowser}>
    <Header />
    <Routes>
      <Route element={<Main />}>
        <Route
          index
          element={
            <PrivateRoute
              restrictedFor={AuthorizationStatus.Auth}
              redirectTo={AppRoute.Products}
            >
              <Login />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Login}
          element={
            <PrivateRoute
              restrictedFor={AuthorizationStatus.Auth}
              redirectTo={AppRoute.Products}
            >
              <Login />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Register}
          element={
            <PrivateRoute
              restrictedFor={AuthorizationStatus.Auth}
              redirectTo={AppRoute.Products}
            >
              <Registration />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Products}
          element={
            <PrivateRoute
              restrictedFor={AuthorizationStatus.NoAuth}
              redirectTo={AppRoute.Login}
            >
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path={`${AppRoute.Products}/:id`}
          element={
            <PrivateRoute
              restrictedFor={AuthorizationStatus.NoAuth}
              redirectTo={AppRoute.Login}
            >
              <Product />
            </PrivateRoute>
          }
        />
        <Route
          path={AppRoute.Add}
          element={
            <PrivateRoute
              restrictedFor={AuthorizationStatus.NoAuth}
              redirectTo={AppRoute.Login}
            >
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path={`${AppRoute.Products}/:id${AppRoute.Edit}`}
          element={
            <PrivateRoute
              restrictedFor={AuthorizationStatus.NoAuth}
              redirectTo={AppRoute.Login}
            >
              <EditProduct />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    <Footer />
  </HistoryRouter>
);

export default App;
