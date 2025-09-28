# Plan de développement pour Altas Taman

## Vision produit
- **Positionnement** : comparateur de prix dédié au marché marocain, initialement centré sur l'électronique grand public, l'électroménager, la beauté et le prêt-à-porter.
- **Objectifs** :
  - Centraliser les offres des marchands marocains (Electroplanet, Marjane, Jumia, BIM, Decathlon, H&M, etc.).
  - Permettre la comparaison des prix et des caractéristiques produits.
  - Offrir des alertes de baisse de prix et mettre en avant les meilleures affaires quotidiennes.

## Architecture globale
Altas Taman est organisé en monorepo PNPM avec trois axes principaux :

| Couche | Technologies | Rôle |
| --- | --- | --- |
| **Frontend** | Next.js 14 (React 18, App Router), Tailwind CSS | Interface utilisateur réactive (recherche, fiches produits, comparateur, bons plans, compte utilisateur). |
| **Backend API** | NestJS (Node.js/Express), Prisma ORM | API GraphQL/REST sécurisée pour la recherche, les offres, les alertes et l'administration. |
| **Workers d'ingestion** | Node.js + Playwright/Cheerio, files de messages (BullMQ/Redis) | Collecte, normalisation et enrichissement des données marchands. |
| **Données & cache** | PostgreSQL (données structurées), Redis (cache & jobs), Meilisearch/Elasticsearch (recherche plein texte) | Persistance, historique de prix, recherche performante. |
| **Infra** | Docker Compose (dev), Kubernetes/Containers + CI/CD (prod), stockage objet (images) | Déploiement, scalabilité, observabilité. |

### Flux de données
1. **Collecte** : des workers déclenchés périodiquement (CRON) appellent les connecteurs marchands (API publique, scraping Playwright, fichiers CSV ou flux RSS).
2. **Normalisation** : mapping des champs vers le schéma interne (produits, offres, spécifications) via Prisma et enrichissement (catégories, attributs, traduction arabe/français).
3. **Déduplication & matching** : comparaison via clés EAN/GTIN, SKU, similarité de titres pour regrouper les offres sous un même produit.
4. **Stockage** : insertion dans PostgreSQL (tables `products`, `offers`, `merchants`, `price_histories`, `product_specs`). Indexation dans Meilisearch pour la recherche.
5. **Publication** : le backend expose les données aux clients (frontend, API partenaires). Des webhooks et files de messages notifient les modules d'alertes.

### Modules backend clés (NestJS)
- **CatalogModule** : gestion des produits, catégories, attributs et spécifications.
- **OfferModule** : ingestion et consultation des offres par marchand, calcul du prix total (produit + livraison).
- **SearchModule** : interface avec Meilisearch, suggestions de recherche, filtres dynamiques.
- **ComparisonModule** : agrégation des fiches techniques et génération des tableaux comparatifs (jusqu'à 3 produits).
- **AlertModule** : création/suivi des alertes de prix, envoi d'e-mails (via SendGrid/Mailjet), gestion des seuils.
- **DealModule** : détection des bons plans (algorithme d'écart de prix vs historique ou moyenne du marché).
- **AuthModule** : inscription/connexion (email + OAuth optionnel), gestion RGPD, préférences utilisateur.
- **AdminModule** : validation des catalogues, monitoring de la qualité des données, gestion des marchands.

### Frontend (Next.js)
- **Pages critiques** :
  - Accueil : recherche, filtres, carrousel des meilleurs bons plans, catégories populaires.
  - Résultats de recherche : liste d'offres triée par prix, badges (livraison gratuite, paiement à la livraison, etc.).
  - Fiche produit : résumé des specs, graphique d'historique de prix, avis agrégés, offres détaillées.
  - Comparateur : tableau interactif jusqu'à trois produits avec mise en évidence des différences.
  - Espace utilisateur : alertes, produits suivis, préférences de notification.
- **State management** : React Query/TanStack Query pour la synchro avec l'API, Zustand pour l'état local.
- **Internationalisation** : support FR/AR, formatage des devises en MAD.
- **Accessibilité & SEO** : SSR/ISR de Next.js, microdonnées schema.org (`Product`, `Offer`, `AggregateOffer`).

### Collecte des données marchands
- **Priorisation** : commencer avec 4-5 marchands majeurs disposant d'API ou de sites stables.
- **Connecteurs** :
  - Utiliser Playwright pour le rendu des pages dynamiques (Jumia, H&M).
  - Privilégier les API publiques/partenariats (Electroplanet, Marjane si disponible).
  - Convertir les flux CSV/Excel fournis par les marchands en offres normalisées.
- **Planification** :
  - Rafraîchir les prix critiques toutes les 2-4h.
  - Rafraîchir l'historique complet nocturnement.
  - Surveiller les changements de structure HTML via tests end-to-end.
- **Qualité** : tests de réconciliation, alertes sur les écarts de prix anormaux, système de score de confiance par marchand.

### Schéma de données recommandé
- `merchants (id, name, url, logo, trust_score, payment_methods)`
- `categories (id, name, parent_id)`
- `products (id, category_id, title, slug, brand, description, thumbnail, specs_json)`
- `product_specs (id, product_id, attribute, value, unit)`
- `offers (id, product_id, merchant_id, price_mad, shipping_cost_mad, availability, url, updated_at)`
- `price_histories (id, offer_id, collected_at, price_mad)`
- `users (id, email, password_hash, locale)`
- `price_alerts (id, user_id, product_id, target_price_mad, active, last_notified_at)`
- `deal_events (id, product_id, offer_id, price_before, price_after, drop_rate, detected_at)`
- `sessions, oauth_accounts` (optionnel via Auth.js/NextAuth).

### Observabilité et sécurité
- **Monitoring** : Prometheus + Grafana, logs structurés (Pino), alertes sur délais d'ingestion, erreurs scraping.
- **Sécurité** : OAuth 2.0 / JWT, chiffrage TLS (Let’s Encrypt), conformité RGPD (opt-in emails, suppression des comptes).
- **Scalabilité** : séparation des files d'ingestion, auto-scaling horizontal des workers, CDN pour assets (Cloudflare).

## Plan de développement par phases

### Phase 0 – Préparation (1-2 semaines)
- Finaliser le design système, prioriser les marchands à intégrer.
- Configurer l'environnement (Docker Compose, variables d'environnement, Prisma + PostgreSQL + Redis + Meilisearch).
- Mettre en place l'authentification basique et les fondations UI (design system Tailwind).

### Phase 1 – Prototype fonctionnel (4-6 semaines)
- Intégrer 2 marchands (ex. Jumia, Electroplanet) avec un connecteur manuel.
- Implémenter les modules Catalog, Offer et Search avec les premières tables Prisma.
- Créer les pages : Accueil (liste de bons plans statiques), Recherche, Fiche produit simple.
- Ajouter la comparaison de base (sélection de 2 produits, specs principales).
- Déployer une version alpha (Vercel + Render/ Railway) pour retours internes.

### Phase 2 – Richesse fonctionnelle (6-8 semaines)
- Ajouter 3 marchands supplémentaires et automatiser l'ingestion (scheduler + files de jobs).
- Étendre la fiche produit (historique de prix, avis agrégés), comparateur à 3 produits.
- Activer les alertes de prix (CRUD + notifications e-mail via SendGrid).
- Mettre en place la détection des bons plans (analyse de variations > 10-15%).
- Introduire l'authentification complète (NextAuth) et l'espace utilisateur.
- Optimiser le SEO (ISR, sitemaps, balisage schema.org, métadonnées sociales).

### Phase 3 – Optimisation & lancement (4-6 semaines)
- Industrialiser l'observabilité (monitoring, alerting) et la modération des données.
- Renforcer la sécurité (tests de pénétration, politiques CSP, audits de scraping).
- Négocier des partenariats marchands, intégrer des flux d'affiliation.
- Affiner les algorithmes de recommandation (produits similaires, cross-selling).
- Ajouter l'internationalisation complète (FR/AR) et les contenus éditoriaux (guides, actualités).
- Préparer le lancement marketing (SEO, réseaux sociaux, emailings) et la roadmap post-lancement.

## Étapes suivantes immédiates
1. Valider le périmètre MVP et les KPIs (taux de conversion en clic, volume d'alertes, temps de rafraîchissement).
2. Concevoir le design system (maquettes Figma) aligné avec la marque Altas Taman.
3. Définir les contrats d'API marchands et établir un protocole de scraping responsable.
4. Planifier la structure du contenu (catégories, pages de conseils, blog) pour renforcer le SEO.
5. Mettre en place un backlog Jira/Linear avec user stories priorisées par phase.

---
Ce document sert de guide directeur pour aligner les équipes produit, technique et marketing autour de la création d'Altas Taman.
