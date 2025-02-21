import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ShopProductParam } from '@project/shop-product';

import { ApplicationServiceURL } from '../app.config';

@Injectable()
export class CheckProductGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Shop}/${request.params[ShopProductParam.ProductId.name]}`
    );

    if (data) {
      return true;
    }
    return false;
  }
}
