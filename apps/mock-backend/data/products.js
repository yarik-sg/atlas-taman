const merchants = [
  { id: 1, name: 'Electroplanet', url: 'https://www.electroplanet.ma/' },
  { id: 2, name: 'Marjane', url: 'https://www.marjane.ma/' },
  { id: 3, name: 'Jumia', url: 'https://www.jumia.ma/' },
  { id: 4, name: 'Hmall', url: 'https://www.hmall.ma/' },
];

const products = [
  {
    id: 1,
    name: 'Samsung Galaxy S24 256 Go',
    description: "Smartphone AMOLED 6,2\" 120 Hz, triple capteur photo, compatible 5G.",
    offers: [
      {
        id: 101,
        price: 10499,
        deliveryFee: 59,
        paymentMethods: ['Carte bancaire', 'Paiement à la livraison'],
        productId: 1,
        merchantId: 1,
        merchant: merchants[0],
      },
      {
        id: 102,
        price: 10249,
        deliveryFee: 0,
        paymentMethods: ['Carte bancaire'],
        productId: 1,
        merchantId: 2,
        merchant: merchants[1],
      },
      {
        id: 103,
        price: 10899,
        deliveryFee: 79,
        paymentMethods: ['Carte bancaire', 'Cash on delivery'],
        productId: 1,
        merchantId: 3,
        merchant: merchants[2],
      },
    ],
  },
  {
    id: 2,
    name: 'LG InstaView Door-in-Door 601L',
    description:
      "Réfrigérateur américain avec panneau InstaView, compresseur linéaire garanti 10 ans, Wi-Fi ThinQ.",
    offers: [
      {
        id: 201,
        price: 28990,
        deliveryFee: 0,
        paymentMethods: ['Carte bancaire', 'Paiement en plusieurs fois'],
        productId: 2,
        merchantId: 1,
        merchant: merchants[0],
      },
      {
        id: 202,
        price: 28490,
        deliveryFee: 199,
        paymentMethods: ['Carte bancaire', 'Paiement en plusieurs fois'],
        productId: 2,
        merchantId: 4,
        merchant: merchants[3],
      },
    ],
  },
  {
    id: 3,
    name: 'Dyson V15 Detect Absolute',
    description:
      'Aspirateur balai sans fil avec détection de poussières laser et filtration HEPA jusqu\'à 99,97%.',
    offers: [
      {
        id: 301,
        price: 9499,
        deliveryFee: 49,
        paymentMethods: ['Carte bancaire', 'Paiement en plusieurs fois'],
        productId: 3,
        merchantId: 3,
        merchant: merchants[2],
      },
      {
        id: 302,
        price: 9690,
        deliveryFee: 0,
        paymentMethods: ['Carte bancaire', 'Paiement à la livraison'],
        productId: 3,
        merchantId: 4,
        merchant: merchants[3],
      },
    ],
  },
];

module.exports = { merchants, products };
