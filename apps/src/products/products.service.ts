import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query?: string) {
    const trimmed = query?.trim();

    const where: Prisma.ProductWhereInput | undefined = trimmed
      ? {
          OR: [
            { name: { contains: trimmed, mode: 'insensitive' } },
            { description: { contains: trimmed, mode: 'insensitive' } },
          ],
        }
      : undefined;

    return this.prisma.product.findMany({
      where,
      include: {
        offers: {
          include: { merchant: true },
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
