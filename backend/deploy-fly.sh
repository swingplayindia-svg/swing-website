#!/bin/bash
# Run ONE command at a time, or: bash deploy-fly.sh
# Requires: fly auth login (and Fly account unlocked at fly.io/high-risk-unlock)

set -e
cd "$(dirname "$0")"
export PATH="$HOME/.fly/bin:$PATH"

echo "Step 1: fly auth login (if not already)"
fly auth whoami || fly auth login

echo "Step 2: fly launch (skip if app already exists)"
fly launch --no-deploy || true

echo "Step 3: set secrets — edit SMTP_PASS and CORS_ORIGIN below first!"
read -p "Gmail app password: " SMTP_PASS
read -p "Your live website URL (e.g. https://yoursite.vercel.app): " CORS_ORIGIN

fly secrets set \
  SMTP_HOST=smtp.gmail.com \
  SMTP_PORT=587 \
  SMTP_USER=swingplay.india@gmail.com \
  SMTP_PASS="$SMTP_PASS" \
  MAIL_FROM=swingplay.india@gmail.com \
  MAIL_TO=swingplay.india@gmail.com \
  FIREBASE_PROJECT_ID=swing-b7a0c \
  FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@swing-b7a0c.iam.gserviceaccount.com \
  CORS_ORIGIN="$CORS_ORIGIN"

echo "Add FIREBASE_PRIVATE_KEY in: https://fly.io/apps/swing-api/secrets"
read -p "Press enter after FIREBASE_PRIVATE_KEY is set in Fly dashboard..."

echo "Step 4: deploy"
fly deploy

echo "Step 5: health check"
fly status
curl -s "https://swing-api.fly.dev/health" || curl -s "$(fly info -j | grep -o 'https://[^"]*' | head -1)/health"
