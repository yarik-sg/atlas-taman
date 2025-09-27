import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ProductsService } from '../src/products/products.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const productsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProductsService)
      .useValue(productsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    productsService.findAll.mockReset();
    productsService.findOne.mockReset();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Atlas Taman API is running');
  });

  it('/products (GET)', async () => {
    productsService.findAll.mockResolvedValue([
      {
        id: 1,
        name: 'Mock product',
        description: null,
        offers: [
          {
            id: 10,
            price: 99.99,
            deliveryFee: null,
            paymentMethods: ['Carte bancaire'],
            productId: 1,
            merchantId: 1,
            merchant: { id: 1, name: 'Mock merchant', url: 'https://example.com' },
          },
        ],
      },
    ]);

    const response = await request(app.getHttpServer()).get('/products');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(productsService.findAll).toHaveBeenCalledWith(undefined);
  });

  it('/products?q=iphone (GET)', async () => {
    productsService.findAll.mockResolvedValue([]);

    const response = await request(app.getHttpServer()).get('/products').query({ q: 'iphone 15' });

    expect(response.statusCode).toBe(200);
    expect(productsService.findAll).toHaveBeenCalledWith('iphone 15');
  });

  it('/products/:id (GET) returns 200 for an existing product', async () => {
    productsService.findOne.mockResolvedValue({
      id: 1,
      name: 'Mock product',
      description: 'Lorem ipsum',
      offers: [],
    });

    const response = await request(app.getHttpServer()).get('/products/1');

    expect(response.statusCode).toBe(200);
    expect(productsService.findOne).toHaveBeenCalledWith(1);
    expect(response.body).toMatchObject({ id: 1, name: 'Mock product' });
  });

  it('/products/:id (GET) returns 404 when product does not exist', async () => {
    productsService.findOne.mockResolvedValue(null);

    const response = await request(app.getHttpServer()).get('/products/999');

    expect(response.statusCode).toBe(404);
    expect(productsService.findOne).toHaveBeenCalledWith(999);
  });

  it('/products/:id (GET) rejects non numeric ids', async () => {
    const response = await request(app.getHttpServer()).get('/products/1abc');

    expect(response.statusCode).toBe(400);
    expect(productsService.findOne).not.toHaveBeenCalled();
  });
});
