#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/Projet-Full-Stack-M1"

cd "$APP_DIR"

# 1) Mettre à jour le code
git fetch origin
git reset --hard origin/main

# 2) Build Front
cd Frontend-React/
npm ci
npm run build
cd "$APP_DIR"

# 4) Build Back
cd Backend-Express/
npm ci
npm run build
cd "$APP_DIR"

# 5) PM2 reload (ou start si première fois)
pm2 start ecosystem.config.cjs --only app || pm2 reload ecosystem.config.cjs --only app --update-env
pm2 save
