import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query?: string) {
    const trimmed = query?.trim();

    const where = trimmed
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

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        offers: {
          include: { merchant: true },
          orderBy: { price: 'asc' },
        },
      },
    });
  }
}
