# 🚀 Full Stack Application

Une application full-stack moderne et complète avec **Express.js**, **React**, **MySQL** et **Redis**.

---

## 📋 Table des matières

- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Démarrage Rapide](#-démarrage-rapide)
- [Structure du Projet](#-structure-du-projet)
- [Commandes Utiles](#-commandes-utiles)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture

```
Full Stack/
│
├── Backend-Express/          # API REST avec Express & TypeScript
│   ├── src/
│   │   ├── config/          # Configuration des services
│   │   ├── controllers/     # Logique métier des routes
│   │   ├── dto/             # Data Transfer Objects (validation)
│   │   ├── middlewares/     # Middleware Express (auth, etc)
│   │   ├── routes/          # Définition des endpoints
│   │   ├── services/        # Logique métier réutilisable
│   │   ├── jobs/            # Tâches programmées (node-cron)
│   │   ├── types/           # Types TypeScript
│   │   ├── utils/           # Fonctions utilitaires
│   │   ├── swagger.ts       # Documentation API
│   │   ├── prisma.ts        # Configuration Prisma
│   │   └── index.ts         # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma    # Schéma de base de données
│   ├── nodemon.json         # Config hot-reload
│   └── package.json
│
├── Frontend-React/          # Interface utilisateur avec React & Vite
│   ├── src/
│   │   ├── api/             # Clients API (Axios)
│   │   ├── components/      # Composants React réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   ├── layout/          # Layouts principaux
│   │   ├── atom/            # État global (Jotai)
│   │   ├── hooks/           # Custom hooks React
│   │   ├── config/          # Configuration frontend
│   │   ├── interfaces/      # Types & interfaces TypeScript
│   │   ├── assets/          # Images, fonts, etc
│   │   ├── utils/           # Fonctions utilitaires
│   │   ├── App.tsx          # Composant principal
│   │   ├── main.tsx         # Point d'entrée
│   │   └── index.css        # Styles globaux
│   ├── public/              # Assets statiques
│   ├── vite.config.ts       # Configuration Vite
│   └── package.json
│
├── docker-compose.yaml      # Orchestration des services Docker
├── Caddyfile               # Reverse proxy (production)
├── ecosystem.config.cjs    # Configuration PM2 (production)
├── deploy.sh               # Script de déploiement
└── .env                    # Variables d'environnement

```

---

## 💻 Tech Stack

### Backend
- **Express.js 5.x** - Framework HTTP
- **TypeScript** - Typage statique
- **Prisma ORM** - Gestion de base de données
- **JWT** - Authentification sécurisée
- **Redis** - Cache & sessions
- **Swagger/OpenAPI** - Documentation interactive
- **node-cron** - Tâches programmées

### Frontend
- **React 19** - UI library
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **React Router 7** - Routage
- **Jotai** - État global léger
- **Axios** - HTTP client
- **react-toastify** - Notifications

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **MySQL 8.0** - Base de données
- **Redis** - Cache en mémoire
- **Caddy** - Reverse proxy (production)
- **PM2** - Gestionnaire de processus (production)

---

## 🚀 Démarrage Rapide

### ✅ Prérequis

- **Docker Desktop** (Windows/Mac) ou Docker Engine + Docker Compose (Linux)
- **Node.js 18+** (optionnel, pour dev local sans Docker)
- **npm** ou **yarn**

### 🐳 Option 1: Docker Compose (Recommandé)

```bash
# À la racine du projet
docker-compose up --build
```

**Accès:**
- 🖥️ **Frontend:** http://localhost:5173
- 🔌 **Backend API:** http://localhost:5000
- 📚 **API Docs (Swagger):** http://localhost:5000/swagger/
- 🗄️ **MySQL:** localhost:3309
- ⚡ **Redis:** localhost:3310

Les services démarrent automatiquement avec:
- Installation des dépendances
- Migrations Prisma
- Seed de données (si configuré)

### 💻 Option 2: Installation Locale

#### Prérequis locaux
- MySQL 8.0 en cours d'exécution
- Redis en cours d'exécution
- Node.js 18+

#### Backend

```bash
cd Backend-Express

# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.exemple .env
# Éditer .env avec vos valeurs locales

# 3. Générer Prisma Client
npx prisma generate

# 4. Migrer la base de données
npx prisma migrate dev

# 5. Démarrer en développement
npm run dev
```

✅ Backend sur **http://localhost:5000**

#### Frontend

```bash
cd Frontend-React

# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement (optionnel)
cp .env.exemple .env

# 3. Démarrer le dev server
npm run dev
```

✅ Frontend sur **http://localhost:5173**

---

## 📦 Configuration Environnement

### Fichier `.env` - Variables principales

```env
# ========== BACKEND ==========
PORT=5000
APP_HOST=http://localhost:5000

# ========== DATABASE ==========
DATABASE_URL=mysql://root:password@127.0.0.1:3309/full_stack_dev
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=full_stack_dev

# ========== AUTHENTICATION ==========
AUTH_SECRET=your_jwt_access_token_secret
AUTH_SECRET_EXPIRES_IN=15m
AUTH_REFRESH_SECRET=your_jwt_refresh_token_secret
AUTH_REFRESH_SECRET_EXPIRES_IN=24h

# ========== CACHE ==========
REDIS_PORT=3980

# ========== FRONTEND ==========
FRONTEND_PORT=3089
VITE_API_URL=http://localhost:5000
```

### 🐳 Services Docker

| Service | Port | Accès | Credentials |
|---------|------|-------|-------------|
| **Frontend** | 5173 | http://localhost:5173 | - |
| **Backend** | 5000 | http://localhost:5000 | - |
| **MySQL** | 3309 | localhost:3309 | `root` / `password` |
| **Redis** | 3310 | localhost:3310 | - |

---

## 🛠️ Commandes Utiles

### Backend

```bash
# Mode développement (hot-reload avec nodemon)
npm run dev

# Compiler TypeScript
npm run build

# Production (run compiled)
npm start

# ========== PRISMA ==========

# Nouvelle migration
npx prisma migrate dev --name add_new_field

# Générer Prisma Client
npx prisma generate

# Interface graphique Prisma
npx prisma studio

# Reset base de données (ATTENTION: supprime les données)
npx prisma migrate reset
```

### Frontend

```bash
# Développement (Vite hot-reload)
npm run dev

# Build production
npm run build

# Linting (ESLint)
npm run lint

# Preview du build
npm run preview
```

### Docker Compose

```bash
# Démarrer tous les services
docker-compose up

# Démarrer en arrière-plan
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer volumes (réinitialiser BD)
docker-compose down -v

# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Rebuild des images
docker-compose up --build

# Exécuter une commande dans un conteneur
docker-compose exec backend npm run build
docker-compose exec mysql mysql -u root -ppassword full_stack_dev
```

---

## 📡 API Documentation

### Accéder à Swagger UI
```
http://localhost:5000/api-docs
```

Toutes les routes API sont documentées avec des exemples de requête/réponse.

### Endpoints Principaux

```
GET    /api-docs              # Documentation Swagger
GET    /health                # Health check
POST   /auth/register         # Créer un compte
POST   /auth/login            # Se connecter
POST   /auth/refresh           # Refresh token
POST   /auth/logout            # Se déconnecter
```

*(Complétez avec vos endpoints réels)*

---

## 🔄 Workflow Développement

### 1️⃣ Créer une branche

```bash
git checkout -b feature/ma-feature
```

### 2️⃣ Développer avec Docker

```bash
docker-compose up -d
# Développer...
```

### 3️⃣ Tester en local (optionnel)

```bash
# Terminal 1 - Backend
cd Backend-Express && npm run dev

# Terminal 2 - Frontend
cd Frontend-React && npm run dev
```

### 4️⃣ Committer

```bash
git add .
git commit -m "feat: description courte de la feature"
git push origin feature/ma-feature
```

### 5️⃣ Créer une Pull Request

---

## 🐛 Troubleshooting

### ❌ Port déjà utilisé

```bash
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000
```

Puis tuer le processus:
```bash
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### ❌ Conteneurs ne démarrent pas

```bash
# Voir les erreurs
docker-compose logs

# Reconstruire
docker-compose down -v
docker-compose up --build
```

### ❌ Base de données inaccessible

```bash
# Vérifier que MySQL est bien démarré
docker-compose logs mysql

# Réinitialiser la BD
docker-compose down -v
docker-compose up --build
```

### ❌ "Cannot find module 'prisma'"

```bash
# Backend
cd Backend-Express
npm install
npx prisma generate
```

### ❌ Frontend ne se connecte pas au backend

- ✅ Vérifier que backend est sur http://localhost:5000
- ✅ Vérifier `VITE_API_URL` dans le frontend
- ✅ Vérifier les logs: `docker-compose logs backend`
- ✅ Vérifier CORS config dans Express

---

## 📊 Monitoring & Logs

```bash
# Logs temps réel tous les services
docker-compose logs -f

# Logs d'un service
docker-compose logs -f backend

# Stats CPU/Memory
docker stats

# Accéder au shell d'un conteneur
docker-compose exec backend sh
docker-compose exec frontend sh
```

---

## 🚀 Déploiement Production

### Utiliser le script de déploiement

```bash
./deploy.sh
```

**Configuration production:**
- PM2 pour la gestion des processus
- Caddy pour le reverse proxy HTTPS
- Docker pour la containerization

---

## 🎯 Checklist avant de commencer

- [ ] Docker & Docker Compose installés
- [ ] Node.js 18+ installé
- [ ] Avoir cloné le repo: `git clone <repo>`
- [ ] Avoir accès aux identifiants SSH (optionnel)

---

## 📞 Support & Ressources

### Documentation externe
- [Express.js](https://expressjs.com)
- [React](https://react.dev)
- [Prisma](https://www.prisma.io/docs/)
- [Vite](https://vitejs.dev)
- [Docker](https://docs.docker.com)

### En cas de problème
1. Vérifier le troubleshooting ci-dessus
2. Consulter les logs Docker
3. Consulter la documentation des dépendances
4. Demander à l'équipe

---

## 📝 Notes

- 🔒 Les credentials `.env` sont à personnaliser en production
- 🐳 Docker est l'approche recommandée pour la cohérence
- 📦 Prisma Studio utile pour explorer la BD: `npx prisma studio`
- 🔄 Hot-reload activé en dev (nodemon backend, Vite frontend)

---

**Happy coding! 🚀**
