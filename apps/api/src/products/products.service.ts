import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: string) {
    return this.prisma.product.findMany({
      where: query
        ? { name: { contains: query, mode: 'insensitive' } }
        : {},
      include: {
        offers: {
          include: {
            merchant: true,
          },
        },
      },
    });
  }
}
