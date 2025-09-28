# Altas Taman API

Backend NestJS exposant les fonctionnalités du comparateur de prix Altas Taman.

## Scripts

Depuis la racine du repository :

```bash
pnpm --filter api dev         # démarrer l'API en mode watch (http://localhost:3001)
pnpm db:migrate               # appliquer les migrations Prisma
pnpm db:seed                  # charger les données d'exemple
pnpm --filter api test        # exécuter les tests unitaires
```

## Variables d'environnement

Copiez `.env.example` vers `.env` et ajustez les valeurs si besoin.

```bash
cp apps/api/.env.example apps/api/.env
```

- `DATABASE_URL` : connexion PostgreSQL utilisée par Prisma.
- `PORT` : port HTTP exposé par NestJS (défaut : `3001`).

## Architecture

- `src/prisma` : service de connexion Prisma.
- `src/products` : module exposant la ressource produits et leurs offres.
- `src/app.module.ts` : point d'entrée principal.

L'API suppose que la base a été migrée via Prisma (`pnpm db:migrate`) et que la seed (`pnpm db:seed`) a été jouée pour disposer d'exemples.
