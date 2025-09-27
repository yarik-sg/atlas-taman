# Altas Taman

Altas Taman est un comparateur de prix pensé pour le marché marocain. Le projet s'inspire de plateformes comme Achatmoinscher.com ou Ledenicheur.fr et cible en priorité les catégories suivantes :

- Électronique (smartphones, ordinateurs portables, tablettes, accessoires)
- Électroménager (gros et petit électroménager)
- Beauté et bien-être
- Mode et prêt-à-porter

## Objectifs produit
- Aggréger et harmoniser les offres des marchands marocains (Electroplanet, Marjane, Jumia, BIM, Decathlon, H&M, etc.).
- Permettre la comparaison des prix, frais de livraison et moyens de paiement.
- Proposer un comparateur de caractéristiques techniques pour jusqu'à trois produits.
- Offrir des alertes e-mail lors des baisses de prix et mettre en avant les meilleurs bons plans.

## Architecture proposée
Le repository est structuré en monorepo PNPM :

- `apps/web` : frontend Next.js 14 (React 18, Tailwind CSS) pour les interfaces utilisateur.
- `apps/api` : backend NestJS exposant les APIs produits/offres/alertes (Prisma, PostgreSQL).
- `apps/workers` : workers Node.js pour l'ingestion et la normalisation des données marchands.
- `prisma` : schéma et migrations de la base PostgreSQL.

Les détails sur l'architecture complète (collecte de données, modules backend, pipeline des bons plans, roadmap) sont décrits dans [docs/project-plan.md](docs/project-plan.md).

## Démarrage rapide

1. Cloner le dépôt et installer les dépendances :

   ```bash
   pnpm install
   ```

2. Copier les variables d'environnement d'exemple :

   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

3. Lancer l'infrastructure locale (PostgreSQL, Redis, Typesense, etc.) si besoin via Docker :

   ```bash
   docker compose up -d postgres redis typesense mailhog
   ```

4. Appliquer les migrations Prisma et les données de démonstration :

   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. Démarrer les applications :

   ```bash
   pnpm --filter api dev   # http://localhost:3001
   pnpm --filter web dev   # http://localhost:3000
   ```

Les scripts complémentaires sont détaillés dans les README spécifiques à chaque application (`apps/api/README.md`, `apps/web/README.md`).

## Roadmap synthétique
1. **Phase 0 – Préparation** : socle technique (Docker, Prisma, Auth), design system et sélection des marchands.
2. **Phase 1 – Prototype** : intégration de 2 marchands, moteur de recherche et fiches produits de base.
3. **Phase 2 – Fonctionnalités avancées** : alertes de prix, comparateur à 3 produits, détection de bons plans.
4. **Phase 3 – Lancement** : monitoring, sécurité, partenariats marchands, contenu éditorial et marketing.

Consultez le plan détaillé pour la liste complète des étapes et des décisions techniques.
