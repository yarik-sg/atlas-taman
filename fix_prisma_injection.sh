#!/bin/bash

set -e

API_PATH="apps/api/src"

echo "🔧 Création du fichier PrismaModule..."
cat > $API_PATH/prisma.module.ts <<'EOF'
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
EOF

echo "🔧 Mise à jour de app.module.ts..."
cat > $API_PATH/app.module.ts <<'EOF'
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, ProductsModule],
})
export class AppModule {}
EOF

echo "🔧 Mise à jour de products.module.ts..."
cat > $API_PATH/products/products.module.ts <<'EOF'
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
EOF

echo "✅ Tous les fichiers nécessaires ont été créés/mis à jour."
echo "➡️ Tu peux maintenant relancer ton backend avec : pnpm dev:api"
