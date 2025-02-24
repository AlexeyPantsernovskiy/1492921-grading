import { JSX } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector } from '@src/hooks';
import { GuitarTypeInfo } from '@src/types/types';
import { productSelectors } from '@store';

const ProductFilter = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleProductTypeChange = (type: string, isChecked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (isChecked) {
      newSearchParams.append('typeCodes', type);
    } else {
      const newTypes = newSearchParams
        .getAll('typeCodes')
        .filter((filterType) => filterType !== type);
      newSearchParams.delete('typeCodes');
      newTypes.forEach((newType) => {
        newSearchParams.append('typeCodes', newType);
      });
    }
    setSearchParams(newSearchParams);
  };

  const handleCountStringsChange = (
    countStrings: string,
    isChecked: boolean
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (isChecked) {
      newSearchParams.append('countStrings', countStrings);
    } else {
      const newCountStrings = newSearchParams
        .getAll('countStrings')
        .filter((item) => item !== countStrings);
      newSearchParams.delete('countStrings');
      newCountStrings.forEach((item) => {
        newSearchParams.append('countStrings', item);
      });
    }
    setSearchParams(newSearchParams);
  };

  const productTypes = useAppSelector(productSelectors.guitarTypes);
  const guitarStrings = useAppSelector(productSelectors.guitarStrings);

  // Получаем выбранные типы гитар
  const selectedTypeCodes = searchParams.getAll('typeCodes');

  // Определяем допустимые значения для количества струн
  const allowedStrings = selectedTypeCodes.reduce((acc, typeCode) => {
    if (productTypes) {
      acc.push(...productTypes[typeCode].countStrings);
    }
    return acc;
  }, [] as number[]);

  return (
    <form className="catalog-filter" action="#" method="post">
      <h2 className="title title--bigger catalog-filter__title">Фильтр</h2>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">Тип гитар</legend>
        {Object.values(productTypes as Record<string, GuitarTypeInfo>).map(
          (productType) => (
            <div
              className="form-checkbox catalog-filter__block-item"
              key={`item-type-${productType.code}`}
            >
              <input
                className="visually-hidden"
                type="checkbox"
                id={productType.code}
                name={productType.code}
                checked={searchParams
                  .getAll('typeCodes')
                  .includes(productType.code)}
                onChange={(e) => {
                  handleProductTypeChange(productType.code, e.target.checked);
                }}
              />
              <label htmlFor={productType.code}>{productType.name}</label>
            </div>
          )
        )}
      </fieldset>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">
          Количество струн
        </legend>
        {guitarStrings.map((item) => (
          <div
            className="form-checkbox catalog-filter__block-item"
            key={`string-qty-${item}`}
          >
            <input
              className="visually-hidden"
              type="checkbox"
              id={`${item}-strings`}
              name={`${item}-strings`}
              checked={searchParams
                .getAll('countStrings')
                .includes(item.toString())}
              onChange={(e) => {
                handleCountStringsChange(item.toString(), e.target.checked);
              }}
              disabled={!allowedStrings.includes(item)}
            />
            <label htmlFor={`${item}-strings`}>{item}</label>
          </div>
        ))}
      </fieldset>
      <button
        className="catalog-filter__reset-btn button button--black-border button--medium"
        type="reset"
        onClick={() => {
          setSearchParams([]);
        }}
      >
        Очистить
      </button>
    </form>
  );
};

export default ProductFilter;
