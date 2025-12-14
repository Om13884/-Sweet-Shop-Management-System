
# 🍬 Sweet Shop Management System

A full-stack web application to manage a sweet shop’s inventory, sales, and users with secure authentication, role-based access, and real-time inventory control.

---

## 📌 Project Overview

The **Sweet Shop Management System** is designed to provide a complete digital solution for sweet shop operations. It supports both **customers** and **administrators**, enabling smooth product browsing, purchasing, inventory management, and admin control through a modern full-stack architecture.

---

## ✨ Features

### 🔐 Authentication & Authorization

* Secure user registration and login
* JWT-based authentication
* Role-based access control (**USER / ADMIN**)

### 🍭 Sweet & Inventory Management

* Browse sweets with images, price, and availability
* Search and filter by name, category, and price range
* Real-time inventory updates on purchase
* Out-of-stock indicators

### 🛒 Purchase System

* Users can purchase sweets
* Automatic stock decrement
* Validation for stock availability

### 🛠 Admin Controls

* Full CRUD operations on sweets
* Restock inventory
* Admin-only protected routes

---

## 👥 User Roles

### USER

* View all sweets
* Search and filter products
* Purchase sweets

### ADMIN

* All USER permissions
* Create, update, delete sweets
* Restock inventory
* Access admin panel

---

## 🧑‍💻 Tech Stack

### Backend

* **Node.js**
* **TypeScript**
* **Express**
* **Prisma ORM**
* **PostgreSQL (Docker)**
* **JWT Authentication**
* **Jest** (Testing)

### Frontend

* **React**
* **Vite**
* **TypeScript**
* **Tailwind CSS**

### DevOps

* **Docker**
* **Docker Compose**

---

## 🏗 System Architecture

### Client–Server Architecture

| Component | URL                     | Description         |
| --------- | ----------------------- | ------------------- |
| Frontend  | `http://localhost:5173` | React SPA           |
| Backend   | `http://localhost:3000` | Express REST API    |
| Database  | `localhost:5432`        | PostgreSQL (Docker) |

### JWT Authentication Flow

1. User logs in or registers
2. Backend generates JWT
3. Frontend stores token in `localStorage`
4. Token sent via `Authorization: Bearer <token>`
5. Middleware validates token & role

---

## 🔗 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Authentication

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/auth/register` | Register user |
| POST   | `/auth/login`    | Login user    |

### Sweets

| Method | Endpoint      | Access       |
| ------ | ------------- | ------------ |
| GET    | `/sweets`     | USER / ADMIN |
| POST   | `/sweets`     | ADMIN        |
| PUT    | `/sweets/:id` | ADMIN        |
| DELETE | `/sweets/:id` | ADMIN        |

### Inventory

| Method | Endpoint               | Access |
| ------ | ---------------------- | ------ |
| POST   | `/sweets/:id/purchase` | USER   |
| POST   | `/sweets/:id/restock`  | ADMIN  |

---

## ⚙️ Local Setup Guide

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd sweet-shop
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

### 3️⃣ Start PostgreSQL (Docker)

```bash
docker-compose up -d
```

### 4️⃣ Backend Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweet_shop?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

### 5️⃣ Prisma Setup

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6️⃣ Start Backend

```bash
npm run dev
```

---

### 7️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Start frontend:

```bash
npm run dev
```

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Areas Covered

* Authentication
* Authorization
* Sweet CRUD
* Purchase & Restock
* Role protection

---

## 🖼 Screenshots

* Login Page
* Dashboard
* Admin Panel
* Purchase Flow

*(Add screenshots here)*

---

## 🤖 AI Usage Disclosure

### Tools Used

* **Cursor AI** – Code generation, refactoring
* **ChatGPT** – Architecture, documentation, review

### AI Contribution Areas

* Boilerplate generation
* Prisma schema & migrations
* API & test generation
* Documentation
* UI components

### Human Oversight

* Manual code review
* Security validation
* Logic verification
* Integration testing

---

## 📈 Skills Demonstrated

* Full-stack development
* REST API design
* JWT authentication
* Prisma ORM & PostgreSQL
* React + Tailwind UI
* Docker & environment setup
* Test-Driven Development
* Professional documentation

---

## ✅ Project Status

✔ Feature complete
✔ Tested
✔ Interview ready
✔ Portfolio ready

---

## ⚠️ Security Note

> **Never commit `.env` files**
> Change `JWT_SECRET` in production.

---

### ⭐ If you like this project, don’t forget to star the repo!

---


