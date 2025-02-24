import { JSX } from 'react';
import { useSearchParams } from 'react-router-dom';

import { DefaultSort, SortDirection, SortType } from '@src/const';

const ProductSort = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get('sortBy') || DefaultSort.Type;
  const sortDirection =
    searchParams.get('sortDirection') || DefaultSort.Direction;

  const handlerSetSortBy = (sortByValue: SortType) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('sortBy', sortByValue);
    setSearchParams(newSearchParams);
  };

  const handlerSetSortDirection = (sortDirectionValue: SortDirection) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('sortDirection', sortDirectionValue);
    setSearchParams(newSearchParams);
  };

  return (
    <div className="catalog-sort">
      <h2 className="catalog-sort__title">Сортировать:</h2>
      <div className="catalog-sort__type">
        <button
          className={[
            'catalog-sort__type-button',
            sortBy === SortType.Date ? 'catalog-sort__type-button--active' : '',
          ].join(' ')}
          aria-label="по дате"
          onClick={(e) => {
            e.preventDefault();
            handlerSetSortBy(SortType.Date);
          }}
        >
          по дате
        </button>
        <button
          className={[
            'catalog-sort__type-button',
            sortBy === SortType.Price
              ? 'catalog-sort__type-button--active'
              : '',
          ].join(' ')}
          aria-label="по цене"
          onClick={(e) => {
            e.preventDefault();
            handlerSetSortBy(SortType.Price);
          }}
        >
          по цене
        </button>
      </div>
      <div className="catalog-sort__order">
        <button
          className={[
            'catalog-sort__order-button',
            'catalog-sort__order-button--up',
            sortDirection === SortDirection.Asc
              ? 'catalog-sort__order-button--active'
              : '',
          ].join(' ')}
          aria-label="По возрастанию"
          onClick={(e) => {
            e.preventDefault();
            handlerSetSortDirection(SortDirection.Asc);
          }}
        />
        <button
          className={[
            'catalog-sort__order-button',
            'catalog-sort__order-button--down',
            sortDirection === SortDirection.Desc
              ? 'catalog-sort__order-button--active'
              : '',
          ].join(' ')}
          aria-label="По убыванию"
          onClick={(e) => {
            e.preventDefault();
            handlerSetSortDirection(SortDirection.Desc);
          }}
        />
      </div>
    </div>
  );
};

export default ProductSort;
