import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.productsService.findAll(q);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }
    return product;
  }
}
