import { IsOptional } from 'class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

import { ShopProductProperty, UpdateProductDto } from '@project/shop-product';

export class UpdateProductPhotoDto extends OmitType(UpdateProductDto, [
  'photo',
]) {
  @ApiProperty(ShopProductProperty.PhotoFile.Description)
  @IsOptional()
  public photoFile?: Express.Multer.File;
}
