import { ApiProperty, OmitType } from '@nestjs/swagger';

import { CreateProductDto, ShopProductProperty } from '@project/shop-product';

export class CreateProductPhotoDto extends OmitType(CreateProductDto, [
  'photo',
]) {
  @ApiProperty(ShopProductProperty.PhotoFile.Description)
  public photoFile: Express.Multer.File;
}
