import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  editProduct,
  fetchProduct,
  fetchProducts,
  addProduct,
  fetchGuitarTypes,
} from '../action';
import {
  Guitar,
  GuitarType,
  GuitarTypeInfo,
  ProductWithPagination,
} from '@src/types/types';
import { SiteData } from '@src/types/state';
import { StoreSlice } from '@src/const';

const initialState: SiteData = {
  guitarTypes: null,
  products: {
    entities: [],
    totalPages: 0,
    totalItems: 0,
    currentPage: 0,
    itemsPerPage: 0,
  },
  isProductsLoading: false,
  product: null,
  isProductLoading: false,
};

const loadingGuitarTypesEnd = (
  state: SiteData,
  action: PayloadAction<GuitarType>
) => {
  state.guitarTypes = action.payload;
};

const loadingProductsWait = (state: SiteData) => {
  state.isProductsLoading = true;
};

const loadingProductsError = (state: SiteData) => {
  state.isProductsLoading = false;
};

const loadingProductsEnd = (
  state: SiteData,
  action: PayloadAction<ProductWithPagination>
) => {
  state.products = action.payload;
  state.isProductsLoading = false;
};

const loadingProductWait = (state: SiteData) => {
  state.isProductLoading = true;
};

const loadingProductError = (state: SiteData) => {
  state.isProductLoading = false;
};

const loadingProductEnd = (state: SiteData, action: PayloadAction<Guitar>) => {
  state.product = action.payload;
  state.isProductLoading = false;
};

const addProductEnd = (state: SiteData, action: PayloadAction<Guitar>) => {
  const newProduct = action.payload;
  state.product = newProduct;
  state.products.entities.push(newProduct);
  state.isProductLoading = false;
};

const editProductEnd = (state: SiteData, action: PayloadAction<Guitar>) => {
  const newProduct = action.payload;
  state.product = newProduct;
  state.products.entities = state.products.entities.map((product) =>
    product.id === newProduct.id ? newProduct : product
  );
  state.isProductLoading = false;
};

export const siteData = createSlice({
  name: StoreSlice.SiteData,
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGuitarTypes.fulfilled, loadingGuitarTypesEnd)

      .addCase(fetchProducts.pending, loadingProductsWait)
      .addCase(fetchProducts.fulfilled, loadingProductsEnd)
      .addCase(fetchProducts.rejected, loadingProductsError)

      .addCase(fetchProduct.pending, loadingProductWait)
      .addCase(fetchProduct.fulfilled, loadingProductEnd)
      .addCase(fetchProduct.rejected, loadingProductError)

      .addCase(addProduct.fulfilled, addProductEnd)
      .addCase(editProduct.fulfilled, editProductEnd);
  },
  selectors: {
    guitarTypes: (state) => state.guitarTypes,
    guitarStrings: (state) => {
      // Получаем из объекта массив со всеми возможными струнами
      const allCountStrings = Object.values(
        state.guitarTypes as Record<string, GuitarTypeInfo>
      ).flatMap((item) => item.countStrings);
      // Удаляем дубликаты и сортируем
      return [...new Set(allCountStrings)].sort((a, b) => a - b);
    },
    products: (state) => state.products,
    isProductsLoading: (state) => state.isProductsLoading,
    product: (state) => state.product,
    isProductLoading: (state) => state.isProductLoading,
  },
});
