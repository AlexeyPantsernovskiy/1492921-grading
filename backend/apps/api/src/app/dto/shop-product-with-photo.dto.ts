import { IsOptional } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

import { ShopProductDto, ShopProductProperty } from '@project/shop-product';

export class ShopProductPhotoDto extends OmitType(ShopProductDto, ['photo']) {
  @ApiProperty(ShopProductProperty.PhotoFile.Description)
  @IsOptional()
  public photoFile?: Express.Multer.File;
}
