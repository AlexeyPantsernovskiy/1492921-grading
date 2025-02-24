import { JSX, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  BreadCrumbs,
  ProductFilter,
  ProductItem,
  ProductSort,
  Spinner,
} from '@components';
import { AppRoute } from '@src/const';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { fetchProducts } from '@src/store/action';
import { productSelectors } from '@store';
import historyBrowser from '@src/history';

const ProductList = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    dispatch(fetchProducts(searchParams.toString()));
  }, [dispatch, searchParams]);

  const isProductsLoading = useAppSelector(productSelectors.isProductsLoading);
  const products = useAppSelector(productSelectors.products);
  const page = parseInt(searchParams.get('page') ?? '0', 10);

  const handlerGotoPage = (pageValue: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', pageValue.toString());
    setSearchParams(newSearchParams);
  };

  if (isProductsLoading) {
    return <Spinner />;
  }

  return (
    <section className="product-list">
      <div className="container">
        <h1 className="product-list__title">Список товаров</h1>
        <BreadCrumbs />
        <div className="catalog">
          <ProductFilter />
          <ProductSort />
          <div className="catalog-cards">
            <ul className="catalog-cards__list">
              {products.entities.map((product) => (
                <ProductItem key={product.id} {...product} />
              ))}
            </ul>
          </div>
        </div>
        <button
          className="button product-list__button button--red button--big"
          onClick={() => historyBrowser.push(AppRoute.Add)}
        >
          Добавить новый товар
        </button>
        <div className="pagination product-list__pagination">
          <ul className="pagination__list">
            {page > 1 ? (
              <li className="pagination__page pagination__page--prev" id="prev">
                <a
                  className="link pagination__page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handlerGotoPage(page - 1);
                  }}
                >
                  Назад
                </a>
              </li>
            ) : null}

            {Array.from({ length: products.totalPages }).map((_page, index) => {
              const iPage = index + 1;
              const activeClass =
                page === iPage ? 'pagination__page--active' : '';
              return (
                <li
                  className={`pagination__page ${activeClass}`}
                  key={`page${iPage}`}
                >
                  <a
                    className="link pagination__page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handlerGotoPage(iPage);
                    }}
                  >
                    {iPage}
                  </a>
                </li>
              );
            })}
            {page < products.totalPages ? (
              <li className="pagination__page pagination__page--next" id="next">
                <a
                  className="link pagination__page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handlerGotoPage(page + 1);
                  }}
                >
                  Далее
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
