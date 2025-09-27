import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query('q') q?: string) {
    return this.productsService.findAll(q);
  }

  @Get(':id')
  async detail(@Param('id') idParam: string) {
    if (!/^[0-9]+$/.test(idParam)) {
      throw new BadRequestException('Identifiant de produit invalide');
    }

    const id = Number(idParam);

    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }
    return product;
  }
}
