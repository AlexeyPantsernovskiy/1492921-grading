import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SortType, StoreSlice } from '@src/const';
import { SiteProcess } from '@src/types/state';

const initialState: SiteProcess = {
  sorting: SortType.Date,
};

export const siteProcess = createSlice({
  name: StoreSlice.SiteProcess,
  initialState,
  reducers: {
    setSorting: (state, action: PayloadAction<SortType>) => {
      state.sorting = action.payload;
    },
  },
  selectors: {
    sorting: (state) => state.sorting
  }
});

