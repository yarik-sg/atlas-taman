import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  const findMany = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: { product: { findMany } },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    findMany.mockReset();
  });

  it('returns all products when no query is provided', () => {
    findMany.mockResolvedValue([]);

    service.findAll();

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: undefined,
      include: {
        offers: {
          include: { merchant: true },
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  });

  it('filters products when query provided', () => {
    findMany.mockResolvedValue([]);

    service.findAll('iPhone');

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: 'iPhone', mode: 'insensitive' } },
          { description: { contains: 'iPhone', mode: 'insensitive' } },
        ],
      },
      include: {
        offers: {
          include: { merchant: true },
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  });
});
