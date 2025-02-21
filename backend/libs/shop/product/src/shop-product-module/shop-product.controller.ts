import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { fillDto } from '@project/shared-helpers';
import { CommonResponse } from '@project/shared-core';

import { ShopProductService } from './shop-product.service';
import { ShopProductDto } from './dto/shop-product.dto';
import { ShopProductRdo } from './rdo/shop-product.rdo';
import { ShopProductQuery } from './shop-product.query';
import { ShopProductWithPaginationRdo } from './rdo/shop-product-with-pagination.rdo';

import { ShopProductResponse } from './swagger/shop-product-response';
import { ShopProductParam } from './swagger/shop-product-param';
import { ShopProductBody } from './swagger/shop-product-request';
import { ShopProductOperation } from './swagger/shop-product-operation';

@ApiTags('Shop')
@Controller('shop/products')
export class ShopProductController {
  constructor(private readonly ShopProductService: ShopProductService) {}

  @Get('')
  @ApiOperation(ShopProductOperation.Index)
  @ApiResponse(ShopProductResponse.ProductList)
  @ApiResponse(CommonResponse.BadRequest)
  public async index(@Query() query: ShopProductQuery) {
    const productsWithPagination =
      await this.ShopProductService.getProducts(query);
    const result = {
      ...productsWithPagination,
      entities: productsWithPagination.entities.map((product) =>
        product.toPOJO()
      ),
    };
    return fillDto(ShopProductWithPaginationRdo, result);
  }

  @Get(':productId')
  @ApiOperation(ShopProductOperation.View)
  @ApiResponse(ShopProductResponse.ProductFound)
  @ApiResponse(ShopProductResponse.ProductNotFound)
  @ApiParam(ShopProductParam.ProductId)
  public async show(@Param(ShopProductParam.ProductId.name) productId: string) {
    const product = await this.ShopProductService.getProduct(productId);
    return fillDto(ShopProductRdo, product.toPOJO());
  }

  @Post('')
  @ApiOperation(ShopProductOperation.CreateProduct)
  @ApiResponse(ShopProductResponse.ProductCreated)
  @ApiResponse(CommonResponse.BadRequest)
  public async create(@Body() dto: ShopProductDto) {
    const newProduct = await this.ShopProductService.createProduct(dto);
    return fillDto(ShopProductRdo, newProduct.toPOJO());
  }

  @Put(':productId')
  @ApiOperation(ShopProductOperation.UpdateProduct)
  @ApiResponse(ShopProductResponse.ProductUpdated)
  @ApiResponse(ShopProductResponse.ProductNotFound)
  @ApiResponse(CommonResponse.BadRequest)
  @ApiBody(ShopProductBody.update)
  public async update(
    @Param(ShopProductParam.ProductId.name) productId: string,
    @Body() dto: ShopProductDto
  ) {
    const updatedProduct = await this.ShopProductService.updateProduct(
      productId,
      dto
    );
    return fillDto(ShopProductRdo, updatedProduct.toPOJO());
  }

  @Delete(':productId')
  @ApiOperation(ShopProductOperation.Delete)
  @ApiResponse(ShopProductResponse.ProductDeleted)
  @ApiResponse(ShopProductResponse.ProductNotFound)
  @ApiParam(ShopProductParam.ProductId)
  @HttpCode(ShopProductResponse.ProductDeleted.status)
  public async delete(
    @Param(ShopProductParam.ProductId.name) productId: string
  ): Promise<void> {
    await this.ShopProductService.deleteProduct(productId);
  }
}
