import { JSX, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BreadCrumbs, Spinner } from '@components';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { fetchProduct, getUserStatus } from '@src/store/action';
import { productSelectors } from '@store';
import { DEFAULT_PRODUCT_CARD_TAB, ProductCardTab } from '@src/const';

const Product = (): JSX.Element | null => {
  const params = useParams();
  const dispatch = useAppDispatch();
  dispatch(getUserStatus());
  const [activeTab, setActiveTab] = useState<ProductCardTab>(
    DEFAULT_PRODUCT_CARD_TAB
  );

  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [params, dispatch]);

  const isProductLoading = useAppSelector(productSelectors.isProductLoading);
  const product = useAppSelector(productSelectors.product);
  const productTypes = useAppSelector(productSelectors.guitarTypes);

  if (isProductLoading) {
    return <Spinner />;
  }

  if (!product || !productTypes) {
    return null;
  }

  return (
    <>
      <h1 className="page-content__title title title--bigger">Товар</h1>
      <BreadCrumbs isProductDetail productName={'Товар'} />
      <div className="product-container">
        <img
          className="product-container__img"
          src={product.photo}
          width="90"
          height="235"
          alt=""
        />
        <div className="product-container__info-wrapper">
          <h2 className="product-container__title title title--big title--uppercase">
            {product.name}
          </h2>
          <br />
          <br />
          <div className="tabs">
            <a
              className={[
                'button button--medium tabs__button',
                activeTab === ProductCardTab.Description &&
                  'button--black-border',
              ].join(' ')}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(ProductCardTab.Characteristics);
              }}
            >
              Характеристики
            </a>
            <a
              className={[
                'button button--medium tabs__button',
                activeTab === ProductCardTab.Characteristics &&
                  'button--black-border',
              ].join(' ')}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(ProductCardTab.Description);
              }}
            >
              Описание
            </a>
            <div className="tabs__content" id="characteristics">
              <table
                className={[
                  'tabs__table',
                  activeTab === ProductCardTab.Description ? 'hidden' : '',
                ].join(' ')}
              >
                <tbody>
                  <tr className="tabs__table-row">
                    <td className="tabs__title">Артикул:</td>
                    <td className="tabs__value">{product.barcode}</td>
                  </tr>
                  <tr className="tabs__table-row">
                    <td className="tabs__title">Тип:</td>
                    <td className="tabs__value">
                      {productTypes[product.typeCode].name}
                    </td>
                  </tr>
                  <tr className="tabs__table-row">
                    <td className="tabs__title">Количество струн:</td>
                    <td className="tabs__value">
                      {product.countStrings} струнная
                    </td>
                  </tr>
                </tbody>
              </table>
              <p
                className={[
                  'tabs__product-description',
                  activeTab === ProductCardTab.Characteristics ? 'hidden' : '',
                ].join(' ')}
              >
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
