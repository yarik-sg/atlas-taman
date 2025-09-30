import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  async findAll({ productId, sort, order, freeDelivery, payment, merchantId, page, limit }: {
    productId: number;
    sort?: string;
    order?: string;
    freeDelivery?: boolean;
    payment?: string;
    merchantId?: number;
    page?: number;
    limit?: number;
  }) {
    const orderBy = sort === 'price' ? { price: (order === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc' } : undefined;
    const where: any = { productId };
    if (freeDelivery) where.deliveryFee = 0;
    if (payment) where.paymentMethods = { has: payment };
    if (merchantId) where.merchantId = merchantId;
    const take = limit && limit > 0 ? limit : undefined;
    const skip = page && limit && page > 0 ? (page - 1) * limit : undefined;
    return this.prisma.offer.findMany({
      where,
      orderBy,
      include: { merchant: true, product: true },
      take,
      skip,
    });
  }
}
