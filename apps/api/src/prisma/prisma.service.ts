import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

type PrismaClientCtor = new () => {
  $connect?: () => Promise<void>;
  $disconnect?: () => Promise<void>;
};

let PrismaClient: PrismaClientCtor;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (error) {
  if (process.env.NODE_ENV === 'test') {
    PrismaClient = class {
      product = {
        findMany: async () => [],
        findUnique: async () => null,
      };
      async $connect() {}
      async $disconnect() {}
    } as unknown as PrismaClientCtor;
  } else {
    throw error;
  }
}

@Injectable()
export class PrismaService extends (PrismaClient as any)
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    const connect = (this as { $connect?: () => Promise<void> }).$connect;
    if (typeof connect === 'function') {
      await connect.call(this);
    }
  }

  async onModuleDestroy(): Promise<void> {
    const disconnect = (this as { $disconnect?: () => Promise<void> }).$disconnect;
    if (typeof disconnect === 'function') {
      await disconnect.call(this);
    }
  }
}
