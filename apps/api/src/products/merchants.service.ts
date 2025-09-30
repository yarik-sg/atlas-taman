import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.merchant.findMany();
  }
}
