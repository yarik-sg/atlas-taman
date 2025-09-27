# Altas Taman Web

Frontend Next.js 14 du comparateur de prix Altas Taman.

## Scripts

```bash
pnpm --filter web dev     # http://localhost:3000
pnpm --filter web build
pnpm --filter web lint
```

## Variables d'environnement

Copiez `.env.example` vers `.env.local` et ajustez l'URL de l'API si besoin.

```bash
cp apps/web/.env.example apps/web/.env.local
```

- `NEXT_PUBLIC_API_URL` : URL de base de l'API Altas Taman consommée côté client.

## Structure

- `pages/` : pages Next.js (index, redirections).
- `styles/` : styles globaux Tailwind.
- `config.js` : résolution de l'URL API selon l'environnement (local, Codespaces, Vercel, etc.).
