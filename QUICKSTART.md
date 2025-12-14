# Quick Start Guide

## Prerequisites
- Node.js v18+
- Docker & Docker Compose

## Setup (5 minutes)

### 1. Start Database
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Edit if needed
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 3. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Create Admin User (Optional)
```bash
cd backend
npm run create:admin
```

## Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

## Default Credentials
After creating admin user, use those credentials to login.

## Testing
```bash
cd backend
npm test
npm run test:coverage
```

## Troubleshooting

### Database Connection Error
- Ensure Docker is running
- Check: `docker ps` (should show postgres container)
- Verify DATABASE_URL in backend/.env

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Change port in frontend/vite.config.ts
- Database: Change port in docker-compose.yml

### Prisma Errors
- Run: `npm run prisma:generate`
- Run: `npm run prisma:migrate`

