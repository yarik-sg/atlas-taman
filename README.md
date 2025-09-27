# atlas-taman

## Préparation de l'environnement

1. Copier le fichier d'exemple :
   ```bash
   cp .env.example .env
   ```
2. Ouvrir `.env` et vérifier la valeur de `DATABASE_URL` afin qu'elle corresponde à votre instance Postgres locale (le fichier `.env.example` pointe vers le service `postgres` défini dans `docker-compose.yml`).

## Lancer les services de développement

Démarrer la base de données Postgres en arrière-plan :

```bash
docker compose up -d postgres
```

## Préparer la base de données

Exécuter les scripts Prisma fournis dans `package.json` pour appliquer les migrations puis remplir les données de démonstration :

```bash
pnpm db:migrate
pnpm db:seed
```

## Démarrer l'API

Une fois la base prête, lancer l'API NestJS avec le script `dev:api` déclaré dans `package.json` :

```bash
pnpm dev:api
```

Après le démarrage de l'API, le frontend pourra se connecter à Prisma et récupérer des données.
