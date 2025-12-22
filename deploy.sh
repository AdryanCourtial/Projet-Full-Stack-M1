#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/var/www/Projet-Full-Stack-M1"
FRONT_DIR="/var/www/Projet-Full-Stack-M1/Frontend-React"
BACKEND_DIR="/var/www/Projet-Full-Stack-M1/Backend-Express"
BACK_PM2_NAME="backend-full-stack"

echo "== Backend: pull main =="
cd "$REPO_DIR"
git fetch origin
git checkout main
git pull origin main

# install/build backend si besoin
cd "$REPO_DIR/"
npm install

echo "== PM2 reload backend =="
cd "$BACKEND_DIR"
npm install
pm2 reload "$BACK_PM2_NAME" || pm2 start dist/main.js --name "$BACK_PM2_NAME"

echo "== Front: pull front-build (build only) =="
if [ ! -d "$FRONT_DIR/.git" ]; then
  rm -rf "$FRONT_DIR"
  mkdir -p "$FRONT_DIR"
  git clone --branch front-build --single-branch "$REPO_DIR" "$FRONT_DIR" || true
fi

cd "$FRONT_DIR"
git fetch origin front-build
git checkout front-build
git reset --hard origin/front-build

echo "== Done =="
