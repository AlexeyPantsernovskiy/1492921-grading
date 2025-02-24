import { SortType, StoreSlice } from '../../const';
import { State } from '../../types/state';


export const getSorting = ({
  [StoreSlice.SiteProcess]: SITE_PROCESS,
}: State): SortType => SITE_PROCESS.sorting;
