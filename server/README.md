# TotalFit Express Server

## Setup

```bash
cd server
cp .env.example .env  # create and adjust your env
npm install
npx prisma generate
npm run dev
```

## Scripts (package.json)

- dev: run with ts-node-dev
- build: compile TypeScript
- start: run compiled JS

## Routes

- GET /api/health
- /api/athletes
- /api/performance
- /api/injuries
- /api/finance
- /api/career


