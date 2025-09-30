import { Controller, Get, Query } from '@nestjs/common';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async findAll(
    @Query('productId') productId: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('freeDelivery') freeDelivery?: string,
    @Query('payment') payment?: string,
    @Query('merchantId') merchantId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.offersService.findAll({
      productId: +productId,
      sort,
      order,
      freeDelivery: freeDelivery === 'true',
      payment,
      merchantId: merchantId ? +merchantId : undefined,
      page: page ? +page : undefined,
      limit: limit ? +limit : undefined,
    });
  }
}
