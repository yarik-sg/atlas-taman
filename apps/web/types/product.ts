export type Merchant = {
  id: number;
  name: string;
  url: string | null;
};

export type Offer = {
  id: number;
  price: number;
  deliveryFee: number | null;
  paymentMethods: string[];
  productId: number;
  merchantId: number;
  merchant: Merchant;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
};

export type ProductWithOffers = Product & { offers: Offer[] };
