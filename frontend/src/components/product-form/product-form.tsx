import { FormEvent, Fragment, JSX, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { useAppDispatch, useAppSelector } from '@src/hooks';
import { clearProduct, productSelectors } from '@store';
import { AppRoute } from '@src/const';
import { addProduct, editProduct, fetchProduct } from '@src/store/action';
import { Spinner } from '@components';
import { GuitarTypeInfo } from '@src/types/types';
import historyBrowser from '@src/history';

const ProductForm = (): JSX.Element | null => {
  const params = useParams();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const productTypes = useAppSelector(productSelectors.guitarTypes);
  const guitarStrings = useAppSelector(productSelectors.guitarStrings);
  const isProductLoading = useAppSelector(productSelectors.isProductLoading);
  const product = useAppSelector(productSelectors.product);
  const isNewForm = pathname === AppRoute.Add;
  const uploadRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [selectedTypeCode, setSelectedTypeCode] = useState<string | null>(
    product?.typeCode || null
  );

  const allowedStrings =
    productTypes && selectedTypeCode
      ? productTypes[selectedTypeCode].countStrings
      : [];

  useEffect(() => {
    const { id } = params;
    if (id) {
      dispatch(fetchProduct(id));
    } else {
      dispatch(clearProduct());
    }
  }, [params, dispatch]);

  useEffect(() => {
    if (product?.photo) {
      if (imgRef.current) {
        imgRef.current.srcset = product.photo;
      }
    }
  }, [product, dispatch]);

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setSelectedPhoto(files[0]);
      if (imgRef.current) {
        imgRef.current.srcset = URL.createObjectURL(files[0]);
      }
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (selectedPhoto) {
      formData.append('photoFile', selectedPhoto);
    }
    const dateValue = formData.get('createDate') as string;
    const [day, month, year] = dateValue.split('.');
    formData.set('createDate', `${year}-${month}-${day}`);
    if (product) {
      formData.set('id', product.id);
      dispatch(editProduct(formData));
    } else {
      dispatch(addProduct(formData));
    }
  };

  const onImageAddButtonClick = () => {
    uploadRef.current?.click();
  };

  const onImageDeleteButtonClick = () => {
    setSelectedPhoto(null);
    if (imgRef.current) {
      imgRef.current.srcset = '';
    }
  };

  if (isProductLoading) {
    return <Spinner />;
  }

  return (
    <form
      className="add-item__form"
      action="#"
      method="post"
      onSubmit={handleFormSubmit}
    >
      <div className="add-item__form-left">
        <div className="edit-item-image add-item__form-image">
          <div className="edit-item-image__image-wrap">
            <input
              type="file"
              accept="image/*"
              ref={uploadRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <img srcSet={product?.photo} ref={imgRef} alt="Photo" />
          </div>
          <div className="edit-item-image__btn-wrap">
            <button
              className="button button--small button--black-border edit-item-image__btn"
              type="button"
              onClick={onImageAddButtonClick}
            >
              {isNewForm ? 'Добавить' : 'Заменить'}
            </button>
            <button
              className="button button--small button--black-border edit-item-image__btn"
              type="button"
              onClick={onImageDeleteButtonClick}
            >
              Удалить
            </button>
          </div>
        </div>
        <div className="input-radio add-item__form-radio">
          <span>Выберите тип товара</span>
          {Object.values(productTypes as Record<string, GuitarTypeInfo>).map(
            (productType) => (
              <Fragment key={`item-type-${productType.code}`}>
                <input
                  type="radio"
                  id={productType.code}
                  name="typeCode"
                  value={productType.code}
                  defaultChecked={productType.code === product?.typeCode}
                  onChange={(e) => setSelectedTypeCode(e.target.value)}
                />
                <label htmlFor={productType.code}>{productType.name}</label>
              </Fragment>
            )
          )}
        </div>
        <div className="input-radio add-item__form-radio">
          <span>Количество струн</span>
          {guitarStrings.map((item) => (
            <Fragment key={`string-qty-${item}`}>
              <input
                type="radio"
                id={`string-qty-${item}`}
                name="countStrings"
                value={item}
                disabled={!allowedStrings.includes(item)}
                className="visually-hidden"
                defaultChecked={product?.countStrings === item}
              />
              <label htmlFor={`string-qty-${item}`}>{item}</label>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="add-item__form-right">
        <div className="custom-input add-item__form-input">
          <label>
            <span>Дата добавления товара</span>
            <input
              type="text"
              name="createDate"
              placeholder="Дата в формате 00.00.0000"
              defaultValue={dayjs(product?.createDate).format('DD.MM.YYYY')}
            />
          </label>
          <p>Заполните поле</p>
        </div>
        <div className="custom-input add-item__form-input">
          <label>
            <span>Введите наименование товара</span>
            <input
              type="text"
              name="name"
              placeholder="Наименование"
              defaultValue={product?.name}
            />
          </label>
          <p>Заполните поле</p>
        </div>
        <div className="custom-input add-item__form-input add-item__form-input--price is-placeholder">
          <label>
            <span>Введите цену товара</span>
            <input
              type="text"
              name="price"
              placeholder="Цена в формате 00 000"
              defaultValue={product?.price}
            />
          </label>
          <p>Заполните поле</p>
        </div>
        <div className="custom-input add-item__form-input">
          <label>
            <span>Введите артикул товара</span>
            <input
              type="text"
              name="barcode"
              placeholder="Артикул товара"
              defaultValue={product?.barcode}
            />
          </label>
          <p>Заполните поле</p>
        </div>
        <div className="custom-textarea add-item__form-textarea">
          <label>
            <span>Введите описание товара</span>
            <textarea
              name="description"
              placeholder=""
              defaultValue={product?.description}
            />
          </label>
          <p>Заполните поле</p>
        </div>
      </div>
      <div className="add-item__form-buttons-wrap">
        <button
          className="button button--small add-item__form-button"
          type="submit"
        >
          Сохранить изменения
        </button>
        <button
          className="button button--small add-item__form-button"
          type="button"
          onClick={() => historyBrowser.back()}
        >
          Вернуться к списку товаров
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
