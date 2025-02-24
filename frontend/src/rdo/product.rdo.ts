import { Product } from '@src/types/types';

export class ProductRdo implements Product {
  id: string;
  name: string;
  description: string;
  createDate: Date;
  photo: string;
  typeCode: string;
  barcode: string;
  price: number;
}
