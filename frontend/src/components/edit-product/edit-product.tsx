import { JSX } from 'react';

import { BreadCrumbs, ProductForm } from '@components';
import { useAppSelector } from '@src/hooks';
import { productSelectors } from '@store';

const EditProduct = (): JSX.Element => {
  const product = useAppSelector(productSelectors.product);
  return (
    <>
      <h1 className="edit-item__title">{product?.name}</h1>
      <BreadCrumbs isEditPage productName={product?.name} />
      <ProductForm />
    </>
  );
};

export default EditProduct;
