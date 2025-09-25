import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // --- Marchands ---
  const jumia = await prisma.merchant.upsert({
    where: { name: 'Jumia' },
    update: {},
    create: { name: 'Jumia', url: 'https://www.jumia.ma' },
  });

  const electroplanet = await prisma.merchant.upsert({
    where: { name: 'Electroplanet' },
    update: {},
    create: { name: 'Electroplanet', url: 'https://www.electroplanet.ma' },
  });

  const marjane = await prisma.merchant.upsert({
    where: { name: 'Marjane' },
    update: {},
    create: { name: 'Marjane', url: 'https://www.marjane.ma' },
  });

  const carrefour = await prisma.merchant.upsert({
    where: { name: 'Carrefour' },
    update: {},
    create: { name: 'Carrefour', url: 'https://www.carrefour.ma' },
  });

  // --- Produits ---
  const iphone15 = await prisma.product.upsert({
    where: { name: 'iPhone 15' },
    update: {},
    create: {
      name: 'iPhone 15',
      description: 'Smartphone Apple iPhone 15 - 128 Go',
    },
  });

  const galaxyS24 = await prisma.product.upsert({
    where: { name: 'Samsung Galaxy S24' },
    update: {},
    create: {
      name: 'Samsung Galaxy S24',
      description: 'Smartphone Samsung Galaxy S24 - 256 Go',
    },
  });

  const machineLG = await prisma.product.upsert({
    where: { name: 'Machine à laver LG 9kg' },
    update: {},
    create: {
      name: 'Machine à laver LG 9kg',
      description: 'Machine à laver automatique LG 9kg',
    },
  });

  const nivea = await prisma.product.upsert({
    where: { name: 'Crème Nivea' },
    update: {},
    create: {
      name: 'Crème Nivea',
      description: 'Crème hydratante Nivea 200ml',
    },
  });

  const tshirtAdidas = await prisma.product.upsert({
    where: { name: 'T-shirt Adidas' },
    update: {},
    create: {
      name: 'T-shirt Adidas',
      description: 'T-shirt Adidas homme, taille M',
    },
  });

  // --- Offres ---
  await prisma.offer.createMany({
    data: [
      {
        price: 12000,
        deliveryFee: 50,
        paymentMethods: ['Carte bancaire'],
        productId: iphone15.id,
        merchantId: jumia.id,
      },
      {
        price: 11800,
        deliveryFee: 100,
        paymentMethods: ['Paiement à la livraison'],
        productId: iphone15.id,
        merchantId: electroplanet.id,
      },
      {
        price: 11950,
        deliveryFee: 0,
        paymentMethods: ['Carte bancaire', 'Paiement à la livraison'],
        productId: iphone15.id,
        merchantId: marjane.id,
      },

      {
        price: 10500,
        deliveryFee: 50,
        paymentMethods: ['Carte bancaire'],
        productId: galaxyS24.id,
        merchantId: jumia.id,
      },
      {
        price: 10400,
        deliveryFee: 80,
        paymentMethods: ['Carte bancaire'],
        productId: galaxyS24.id,
        merchantId: carrefour.id,
      },

      {
        price: 4500,
        deliveryFee: 150,
        paymentMethods: ['Paiement à la livraison'],
        productId: machineLG.id,
        merchantId: electroplanet.id,
      },
      {
        price: 4600,
        deliveryFee: 100,
        paymentMethods: ['Carte bancaire'],
        productId: machineLG.id,
        merchantId: marjane.id,
      },

      {
        price: 35,
        deliveryFee: 20,
        paymentMethods: ['Paiement à la livraison'],
        productId: nivea.id,
        merchantId: marjane.id,
      },
      {
        price: 30,
        deliveryFee: 15,
        paymentMethods: ['Carte bancaire'],
        productId: nivea.id,
        merchantId: carrefour.id,
      },

      {
        price: 250,
        deliveryFee: 30,
        paymentMethods: ['Paiement à la livraison'],
        productId: tshirtAdidas.id,
        merchantId: jumia.id,
      },
      {
        price: 240,
        deliveryFee: 25,
        paymentMethods: ['Carte bancaire'],
        productId: tshirtAdidas.id,
        merchantId: carrefour.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Base enrichie : marchands + produits + offres insérés avec succès');
}

main()
  .catch((e) => {
    console.error('❌ Erreur dans le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
