import { Injectable } from '@nestjs/common';

import { EntityFactory, Guitar } from '@project/shared-core';
import { ShopProductEntity } from './shop-product.entity';
import { ShopProductDto } from './dto/shop-product.dto';

@Injectable()
export class ShopProductFactory implements EntityFactory<ShopProductEntity> {
  public create(entityPlainData: Guitar): ShopProductEntity {
    return new ShopProductEntity(entityPlainData);
  }

  public static createNewProduct(dto: ShopProductDto): ShopProductEntity {
    const newProduct = new ShopProductEntity();

    newProduct.name = dto.name;
    newProduct.description = dto.description;
    newProduct.createDate = new Date();
    newProduct.photo = dto.photo;
    newProduct.typeCode = dto.typeCode;
    newProduct.countStrings = dto.countStrings;
    newProduct.barcode = dto.barcode;
    newProduct.price = dto.price;

    return newProduct;
  }
}
