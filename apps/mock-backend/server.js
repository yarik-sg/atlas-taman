const express = require('express');

const { products } = require('./data/products');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/products', (req, res) => {
  const query = `${req.query.q ?? ''}`.trim().toLowerCase();

  if (!query) {
    return res.json(products);
  }

  const filtered = products.filter((product) => {
    const haystack = [
      product.name,
      product.description ?? '',
      ...product.offers.map((offer) => offer.merchant?.name ?? ''),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });

  return res.json(filtered);
});

app.get('/products/:id', (req, res) => {
  const parsedId = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({ message: 'Identifiant invalide' });
  }

  const product = products.find((item) => item.id === parsedId);

  if (!product) {
    return res.status(404).json({ message: 'Produit introuvable' });
  }

  return res.json(product);
});

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, () => {
  console.log(`Mock backend disponible sur http://localhost:${PORT}`);
});

module.exports = app;
