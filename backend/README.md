# Sweet Shop Backend API

Backend REST API for the Sweet Shop Management System built with Node.js, Express, TypeScript, and Prisma.

> **Note**: For complete setup instructions and project overview, see the [root README.md](../README.md).

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL with Docker (from project root):
```bash
docker-compose up -d
```

3. Setup environment variables (create `backend/.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweet_shop?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

4. Generate Prisma Client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Features

- JWT-based authentication
- Role-based access control (USER, ADMIN)
- Sweet CRUD operations
- Search and filter functionality
- Inventory management (purchase/restock)
- Comprehensive test coverage

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Jest + Supertest

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected)
- `GET /api/sweets` - Get all sweets (with optional filters)
- `POST /api/sweets` - Create a new sweet (Admin only)
- `PUT /api/sweets/:id` - Update a sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)
- `POST /api/sweets/:id/purchase` - Purchase a sweet
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)

### Query Parameters (GET /api/sweets)
- `name` - Filter by name (partial match, case-insensitive)
- `category` - Filter by category (partial match, case-insensitive)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Watch mode:
```bash
npm run test:watch
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run create:admin` - Create an admin user interactively

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.ts
│   │   └── sweet.controller.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   └── sweet.routes.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   └── sweet.service.ts
│   ├── middlewares/     # Auth & validation middleware
│   │   └── auth.middleware.ts
│   ├── utils/           # Utility functions
│   │   └── prisma.ts
│   ├── scripts/         # Utility scripts
│   │   └── createAdmin.ts
│   └── index.ts         # Application entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
└── package.json
```

## Environment Variables

See the [root README.md](../README.md) for detailed environment variable documentation.

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 3000)
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `NODE_ENV` - Environment mode (development/production/test)

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Sweet Model
```prisma
model Sweet {
  id        String   @id @default(uuid())
  name      String
  category  String
  price     Float
  quantity  Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Role-based access control middleware
- Input validation with express-validator
- Protected routes with authentication middleware

For more information, see the [root README.md](../README.md).
