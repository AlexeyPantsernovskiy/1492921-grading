import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import FormData from 'form-data';
import * as url from 'node:url';

import {
  NO_UPDATE_PHOTO,
  ShopProductEntity,
  ShopProductOperation,
  ShopProductParam,
  ShopProductProperty,
  ShopProductQuery,
  ShopProductResponse,
} from '@project/shop-product';

import { multerFileToFormData } from '@project/shared-helpers';
import { UploadedFileRdo } from '@project/file-uploader';

import { CommonResponse, GuitarTypeInfo, PaginationResult } from '@project/shared-core';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { ApplicationServiceURL } from './app.config';

import { ShopProductPhotoDto } from './dto/shop-product-with-photo.dto';
import { CheckProductGuard } from './guards/check-product.guard ';
import { UploadFileInterceptor } from '@project/interceptors';

@ApiTags('Shop')
@Controller('shop')
@UseFilters(AxiosExceptionFilter)
export class ShopController {
  constructor(private readonly httpService: HttpService) {}

  private async uploadFile(file: Express.Multer.File): Promise<string | null> {
    const form = new FormData();
    if (file) {
      multerFileToFormData(form, file, 'file');
      const { data } = await this.httpService.axiosRef.post<UploadedFileRdo>(
        `${ApplicationServiceURL.Files}/upload`,
        form
      );
      return `${data.subDirectory}/${data.hashName}`;
    }
    return null;
  }

  @Get('products')
  @ApiOperation(ShopProductOperation.Index)
  @ApiResponse(ShopProductResponse.ProductList)
  @ApiResponse(CommonResponse.BadRequest)
  public async index(@Query() _query: ShopProductQuery, @Req() req: Request) {
    const queryString = url.parse(req.url).query;
    const productsResponse = await this.httpService.axiosRef.get<
      PaginationResult<ShopProductEntity>
    >(`${ApplicationServiceURL.Shop}?${queryString}`, {});
    return productsResponse.data;
  }

  @Post('products')
  @ApiOperation(ShopProductOperation.CreateProduct)
  @ApiResponse(ShopProductResponse.ProductCreated)
  @ApiResponse(CommonResponse.BadRequest)
  @ApiResponse(CommonResponse.UserNotAuth)
  @ApiBearerAuth('accessToken')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    UploadFileInterceptor(ShopProductProperty.PhotoFile.Validate, 'photoFile')
  )
  @UseGuards(CheckAuthGuard)
  public async create(
    @Body() dto: ShopProductPhotoDto,
    @UploadedFile() photoFile?: Express.Multer.File
  ) {
    if (!photoFile) {
      throw new BadRequestException(
        `Необходимо загрузить с изображением товара в формате jpg или png`
      );
    }
    dto['photo'] = await this.uploadFile(photoFile);
    console.log('dto', dto);
    const productResponse = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Shop}`,
      dto
    );
    return productResponse.data;
  }

  @Put(`products/:${ShopProductParam.ProductId.name}`)
  @ApiOperation(ShopProductOperation.UpdateProduct)
  @ApiResponse(ShopProductResponse.ProductUpdated)
  @ApiResponse(CommonResponse.BadRequest)
  @ApiResponse(ShopProductResponse.ProductNotFound)
  @ApiResponse(CommonResponse.UserNotAuth)
  @ApiBearerAuth('accessToken')
  @ApiConsumes('multipart/form-data')
  @ApiParam(ShopProductParam.ProductId)
  @UseInterceptors(
    UploadFileInterceptor(ShopProductProperty.PhotoFile.Validate, 'photoFile')
  )
  @UseGuards(CheckAuthGuard)
  @UseGuards(CheckProductGuard)
  public async update(
    @Param(ShopProductParam.ProductId.name) productId: string,
    @Body() dto: ShopProductPhotoDto,
    @UploadedFile() photoFile?: Express.Multer.File
  ) {
    dto['photo'] = photoFile
      ? await this.uploadFile(photoFile)
      : NO_UPDATE_PHOTO;
    const productResponse = await this.httpService.axiosRef.put(
      `${ApplicationServiceURL.Shop}/${productId}`,
      dto
    );
    return productResponse.data;
  }

  @Delete(`products/:${ShopProductParam.ProductId.name}`)
  @ApiOperation(ShopProductOperation.Delete)
  @ApiResponse(ShopProductResponse.ProductDeleted)
  @ApiResponse(ShopProductResponse.ProductNotFound)
  @ApiResponse(CommonResponse.UserNotAuth)
  @ApiBearerAuth('accessToken')
  @ApiParam(ShopProductParam.ProductId)
  @HttpCode(ShopProductResponse.ProductDeleted.status)
  @UseGuards(CheckAuthGuard)
  @UseGuards(CheckProductGuard)
  public async delete(
    @Param(ShopProductParam.ProductId.name) productId: string
  ) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Shop}/${productId}`,
      {}
    );
    return data;
  }

  @Get(`products/:${ShopProductParam.ProductId.name}`)
  @ApiOperation(ShopProductOperation.View)
  @ApiResponse(ShopProductResponse.ProductFound)
  @ApiResponse(ShopProductResponse.ProductNotFound)
  public async show(@Param(ShopProductParam.ProductId.name) productId: string) {
    const productResponse = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Shop}/${productId}`,
      {}
    );
    return productResponse.data;
  }

  @Get('product-types')
  @ApiOperation(ShopProductOperation.ProductTypes)
  @ApiResponse(ShopProductResponse.ProductTypes)
  public async getProductTypes() {
    return GuitarTypeInfo;
  }
}
