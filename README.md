# Donation App Server

## Introduction

Donation App Server is a **Node.js** and **Express** based backend application that provides API services for a donation platform, supporting **charity organizations**, **donation projects**, and **charity products**.

This project is developed using **TypeScript** and connects to PostgreSQL via **Prisma ORM**. It also supports **Docker containerization**, making development and deployment easier.

## Tech Stack

- **Node.js 20**
- **Express** - Fast Web API framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - PostgreSQL database operations
- **Docker** - Containerized application
- **dotenv** - Environment variable management
- **ts-node-dev** - TypeScript development tool
- **faker.js** - Fake data generation

## Environment Variables

This project uses `.env` for managing environment variables. Create a `.env` file in the root directory and add the following:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=donation
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/donation
PORT=8080
```

## Installation & Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Mode

```bash
npm run dev
```

- Uses `ts-node-dev` to start `server.ts`
- Watches for code changes and automatically restarts

### 3. Compile TypeScript

```bash
npm run build
```

- Compiles TypeScript to `.js` files and outputs to the `dist/` directory

### 4. Start Production Server

```bash
npm run start
```

- Runs `node dist/server.js` using the compiled `.js` files

## Database Connection & Prisma Schema Sync

This project uses `@prisma/client`, which requires a **PostgreSQL** connection for schema synchronization.

### Start Local PostgreSQL Database

If you don’t have a running PostgreSQL instance, you can start a local one using Docker:

```bash
docker-compose up postgres
```

This command will start a local PostgreSQL database.

### Sync Prisma Schema

Whenever you modify the Prisma schema (`prisma/schema.prisma`), run the following command to sync it with the database:

```bash
npx prisma migrate dev --name init
```

This updates the database schema and synchronizes the TypeScript types in `@prisma/client`.

## Docker Deployment

### 1. Build Docker Image

```bash
npm run docker:build
```

- Executes `docker build -t donation-app-server .`

### 2. Run Docker Container

```bash
npm run docker:run
```

- Executes `docker run -p 8080:8080 donation-app-server`

## Seeding Fake Data

This project provides **Seeder** scripts to populate the database with fake data.

```bash
# Seed donation campaigns
npx ts-node src/seeds/campaign.ts

# Seed donation projects
npx ts-node src/seeds/project.ts

# Seed products
npx ts-node src/seeds/product.ts
```

After running, the terminal should display:

```
✅ Seeding complete!
```

## API Endpoints

### 1. Get Donation Campaigns List

```
GET /api/v1/campaigns
```

- **Query Parameters**
  - `page` (pagination)
  - `limit` (items per page)
  - `category` (filter category, e.g., animal, children...)
  - `keyword` (fuzzy search by name/description)
  - `status` (ACTIVE / COMPLETED / INACTIVE / DRAFT)

### 2. Get Product List

```
GET /api/v1/products
```

- **Query Parameters**
  - `page` (pagination)
  - `limit` (items per page)
  - `category` (product category)
  - `keyword` (fuzzy search by name/description)
  - `status` (ACTIVE / COMPLETED / INACTIVE / DRAFT)

### 3. Get Donation Project List

```
GET /api/v1/projects
```

- **Query Parameters**
  - `page` (pagination)
  - `limit` (items per page)
  - `category` (filter category within an array)
  - `keyword` (fuzzy search by name/description)
  - `status` (ACTIVE / COMPLETED / INACTIVE / DRAFT)
