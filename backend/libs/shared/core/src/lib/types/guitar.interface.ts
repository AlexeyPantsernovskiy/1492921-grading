import { GuitarType } from './guitar-type.enum';

export interface Guitar {
  id: string;
  name: string;
  description: string;
  createDate: Date;
  photo: string;
  typeCode: GuitarType;
  countStrings: number;
  barcode: string;
  price: number;
}
