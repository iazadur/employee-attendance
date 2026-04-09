#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not set. Aborting startup."
  exit 1
fi

echo "Running Prisma migrations..."

# migrate deploy is idempotent: applies only unapplied migrations, no-op when up to date.
npx prisma migrate deploy

echo "Starting backend server..."
exec node dist/src/main.js