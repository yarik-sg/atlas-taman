/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `priceMad` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `shippingMad` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,merchantId]` on the table `Offer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "createdAt",
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "createdAt",
DROP COLUMN "priceMad",
DROP COLUMN "shippingMad",
DROP COLUMN "url",
ADD COLUMN     "deliveryFee" DOUBLE PRECISION,
ADD COLUMN     "paymentMethods" TEXT[],
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "brand",
DROP COLUMN "category",
DROP COLUMN "createdAt",
DROP COLUMN "title",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_name_key" ON "Merchant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_productId_merchantId_key" ON "Offer"("productId", "merchantId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
