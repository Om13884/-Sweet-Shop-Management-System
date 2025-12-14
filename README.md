# Sweet Shop Management System

## 1. Project Title

**Sweet Shop Management System**

## 2. Project Description

The Sweet Shop Management System is a full-stack web application designed to manage a sweet shop's inventory, sales, and user operations. This system provides a complete solution for both customers and administrators to interact with the sweet shop's products and services.

### What the System Does

The system enables:
- **User Registration and Authentication**: Secure user registration and login with JWT-based authentication
- **Product Browsing**: Customers can view all available sweets with images, prices, and availability
- **Search and Filter**: Advanced search functionality to find sweets by name, category, and price range
- **Purchase Management**: Customers can purchase sweets, which automatically updates inventory
- **Inventory Management**: Administrators can add, edit, delete, and restock sweets
- **Role-Based Access Control**: Different permissions for regular users (USER) and administrators (ADMIN)

### Who It Is For

- **Customers (USER role)**: Browse sweets, search/filter products, and make purchases
- **Administrators (ADMIN role)**: Full CRUD operations on sweets, manage inventory, and restock products

### Key Features

1. **Authentication & Authorization**
   - Secure user registration and login
   - JWT token-based authentication
   - Role-based access control (USER/ADMIN)

2. **Sweet Management**
   - View all available sweets with images
   - Search by name, category, and price range
   - Real-time inventory tracking

3. **Inventory Control**
   - Purchase functionality that decrements stock
   - Restock functionality for administrators
   - Out-of-stock indicators

4. **Admin Control**
   - Create, read, update, and delete sweets
   - Manage product details (name, category, price, quantity)
   - Restock inventory

## 3. Tech Stack

### Backend

- **Node.js** - JavaScript runtime environment
- **TypeScript** - Type-safe JavaScript superset
- **Express** - Web application framework
- **Prisma** - Next-generation ORM for database operations
- **PostgreSQL** - Relational database (Docker)
- **JWT** - JSON Web Tokens for authentication
- **Jest** - JavaScript testing framework

### Frontend

- **React** - UI library for building user interfaces
- **Vite** - Next-generation frontend build tool
- **TypeScript** - Type-safe JavaScript superset
- **Tailwind CSS** - Utility-first CSS framework

### DevOps

- **Docker** - Containerization platform
- **Docker Compose** - Multi-container Docker application orchestration

## 4. System Architecture

### Backend–Frontend Interaction

The system follows a client-server architecture:

1. **Frontend (React SPA)**: Runs on `http://localhost:5173`
   - Makes HTTP requests to the backend API
   - Uses Axios for API communication
   - Stores JWT tokens in localStorage
   - Implements protected routes based on user roles

2. **Backend (Express API)**: Runs on `http://localhost:3000`
   - Provides RESTful API endpoints
   - Handles authentication and authorization
   - Processes business logic and database operations
   - Returns JSON responses

3. **Database (PostgreSQL)**: Runs in Docker container
   - Stores user and sweet data
   - Managed through Prisma ORM
   - Accessible on port `5432`

### JWT Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Backend validates credentials and generates JWT token
3. Frontend stores token in localStorage
4. Subsequent requests include token in `Authorization: Bearer <token>` header
5. Backend middleware validates token and extracts user information
6. Protected routes check user role (USER/ADMIN) for authorization

### Database Usage via Docker

- PostgreSQL runs in a Docker container for easy setup and portability
- Database schema is managed through Prisma migrations
- Connection string: `postgresql://postgres:postgres@localhost:5432/sweet_shop`
- Data persists in Docker volume for development

### Role-Based Access Control (USER / ADMIN)

- **USER Role**: 
  - Can view all sweets
  - Can search and filter sweets
  - Can purchase sweets
  - Cannot modify inventory

- **ADMIN Role**:
  - All USER permissions
  - Can create, update, and delete sweets
  - Can restock inventory
  - Access to Admin Panel

## 5. API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-string"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Sweet Endpoints

All sweet endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <token>
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Gulab Jamun",
  "category": "Indian Sweets",
  "price": 5.99,
  "quantity": 100
}
```

#### Get All Sweets
```http
GET /api/sweets
Authorization: Bearer <token>
```

**Query Parameters (Optional):**
- `name` - Filter by name (partial match, case-insensitive)
- `category` - Filter by category (partial match, case-insensitive)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

**Example:**
```http
GET /api/sweets?name=chocolate&category=Candy&minPrice=1&maxPrice=10
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Gulab Jamun",
    "category": "Indian Sweets",
    "price": 5.99,
    "quantity": 100,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Updated Name",
  "price": 6.99,
  "quantity": 150
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/:id
Authorization: Bearer <token>
```

### Inventory Endpoints

#### Purchase Sweet
```http
POST /api/sweets/:id/purchase
Content-Type: application/json
Authorization: Bearer <token>

{
  "quantity": 1
}
```

**Response:** Updated sweet object with decremented quantity

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/:id/restock
Content-Type: application/json
Authorization: Bearer <token>

{
  "quantity": 50
}
```

**Response:** Updated sweet object with incremented quantity

## 6. Local Setup Instructions

Follow these steps in order to set up the project locally. All commands are copy-paste ready.

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd "sweet shop"
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Start PostgreSQL Using Docker

From the project root directory:

```bash
docker-compose up -d
```

Verify the database is running:

```bash
docker ps
```

You should see a `sweet-shop-db` container running.

### Step 4: Setup Backend .env

Create a `.env` file in the `backend` directory:

```bash
cd backend
```

Create the file and add:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweet_shop?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

### Step 5: Run Prisma Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will:
- Generate Prisma Client
- Create database tables (users and sweets)

### Step 6: Run Backend Server

```bash
npm run dev
```

The backend API will be running at `http://localhost:3000`

### Step 7: Run Backend Tests

Open a new terminal window and run:

```bash
cd backend
npm test
```

Or with coverage:

```bash
npm run test:coverage
```

### Step 8: Install Frontend Dependencies

Open a new terminal window:

```bash
cd frontend
npm install
```

### Step 9: Setup Frontend .env

Create a `.env` file in the `frontend` directory (optional, defaults work):

```env
VITE_API_URL=http://localhost:3000/api
```

### Step 10: Start Frontend

```bash
npm run dev
```

The frontend application will be running at `http://localhost:5173`

### Optional: Create Admin User

To create an admin user for testing admin features:

```bash
cd backend
npm run create:admin
```

Follow the prompts to enter email and password. This will create a user with ADMIN role.

## 7. Environment Variables

### Backend Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweet_shop?schema=public"
```

- **Description**: PostgreSQL connection string
- **Format**: `postgresql://[user]:[password]@[host]:[port]/[database]?schema=public`
- **Default**: Uses Docker Compose defaults

```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

- **Description**: Secret key for signing JWT tokens
- **Required**: Yes
- **Security**: Must be changed in production

```env
JWT_EXPIRES_IN="7d"
```

- **Description**: JWT token expiration time
- **Default**: 7 days
- **Format**: Number followed by unit (s, m, h, d)

```env
PORT=3000
```

- **Description**: Port on which the backend server runs
- **Default**: 3000

```env
NODE_ENV=development
```

- **Description**: Environment mode
- **Options**: `development`, `production`, `test`

### Frontend Environment Variables

Create `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:3000/api
```

- **Description**: Backend API base URL
- **Default**: `http://localhost:3000/api` (hardcoded in code)
- **Note**: Vite requires `VITE_` prefix for environment variables

## 8. Running Tests

### Backend Tests

Navigate to the backend directory:

```bash
cd backend
```

#### Run All Tests

```bash
npm test
```

#### Run Tests with Coverage

```bash
npm run test:coverage
```

#### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

The backend includes comprehensive test coverage:

- **Authentication Tests** (`auth.routes.test.ts`):
  - User registration
  - User login
  - Password validation
  - Email validation

- **Sweet Service Tests** (`sweet.service.test.ts`):
  - Create sweet
  - Find all sweets with filters
  - Update sweet
  - Delete sweet
  - Purchase sweet (inventory decrement)
  - Restock sweet (inventory increment)

- **Sweet Route Tests** (`sweet.routes.test.ts`):
  - GET /api/sweets (with filters)
  - POST /api/sweets (admin only)
  - PUT /api/sweets/:id (admin only)
  - DELETE /api/sweets/:id (admin only)
  - POST /api/sweets/:id/purchase
  - POST /api/sweets/:id/restock (admin only)
  - Authentication and authorization checks

### Test-Driven Development (TDD) Approach

The project follows TDD principles:
- Tests are written to define expected behavior
- Tests cover both success and error scenarios
- Integration tests verify API endpoints
- Unit tests verify business logic
- Tests ensure authentication and authorization work correctly

## 9. Screenshots Section

### Login Page
_Placeholder for login page screenshot showing the user login form with email and password fields._

### Dashboard
_Placeholder for dashboard screenshot showing the grid of sweet products with images, names, prices, and purchase buttons._

### Admin Panel
_Placeholder for admin panel screenshot showing the table view of all sweets with edit, delete, and restock functionality._

### Purchase Flow
_Placeholder for purchase flow screenshot showing the process of selecting a sweet and completing a purchase._

## 10. My AI Usage

### Tools Used

- **Cursor AI** - Primary AI coding assistant for code generation, refactoring, and debugging
- **ChatGPT** - Secondary AI tool for architecture design, documentation, and code review

### What AI Was Used For

#### 1. Boilerplate Generation
- **Project Structure**: AI generated the complete folder structure for both backend and frontend
- **Configuration Files**: Generated `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, and other configuration files
- **Docker Setup**: Created `docker-compose.yml` with PostgreSQL configuration
- **Prisma Setup**: Generated Prisma schema and migration files

#### 2. Prisma Schema
- **Database Models**: AI designed the User and Sweet models with appropriate fields and relationships
- **Migrations**: Generated Prisma migration files for database schema
- **Type Safety**: Ensured Prisma Client types are properly integrated with TypeScript

#### 3. Test Generation
- **Test Structure**: AI created comprehensive test suites using Jest and Supertest
- **Test Cases**: Generated test cases for:
  - Authentication endpoints (register, login)
  - Sweet CRUD operations
  - Inventory management (purchase, restock)
  - Authorization checks (admin-only routes)
- **Test Utilities**: Created test helpers and setup/teardown functions

#### 4. Documentation
- **README Files**: AI generated initial documentation structure and content
- **API Documentation**: Created detailed endpoint documentation with request/response examples
- **Setup Instructions**: Generated step-by-step setup guides
- **Code Comments**: Added inline documentation and JSDoc comments

#### 5. Code Implementation
- **Backend Services**: AI generated service layer with business logic for authentication and sweet management
- **Controllers**: Created Express controllers with proper error handling
- **Routes**: Generated route definitions with validation middleware
- **Frontend Components**: Created React components for pages (Login, Register, Dashboard, AdminPanel)
- **Frontend Services**: Generated API service layer with Axios
- **Authentication Context**: Created React context for managing authentication state
- **Protected Routes**: Implemented route guards for authentication and authorization

#### 6. Styling and UI
- **Tailwind CSS**: AI generated utility classes for responsive design
- **Component Styling**: Created modern, clean UI components
- **Image Integration**: Implemented image mapping utility for menu images

### Reflection on How AI Improved Productivity

The use of AI significantly accelerated the development process:

1. **Speed**: Reduced development time from weeks to days by generating boilerplate code and common patterns
2. **Consistency**: Ensured consistent code style and architecture patterns throughout the project
3. **Best Practices**: AI suggested and implemented industry best practices (SOLID principles, proper error handling, security measures)
4. **Documentation**: Automated documentation generation saved hours of manual writing
5. **Testing**: Generated comprehensive test suites that might have been overlooked or rushed in manual development
6. **Learning**: AI provided explanations and context for complex concepts, improving understanding

### Manual Review and Validation

**Important**: While AI was extensively used for code generation, all logic was manually reviewed and validated:

- **Code Review**: Every generated file was reviewed line-by-line for correctness
- **Logic Validation**: Business logic was tested manually to ensure it meets requirements
- **Security Audit**: Authentication, authorization, and input validation were manually verified
- **Testing**: All tests were run and verified to pass, with additional edge cases added manually
- **Integration Testing**: Full application flow was tested manually to ensure everything works together
- **Bug Fixes**: Issues discovered during testing were fixed manually with proper understanding

### AI Limitations and Human Oversight

- AI-generated code required human judgment for business logic decisions
- Some AI suggestions were modified or rejected based on project requirements
- Security-critical code (JWT handling, password hashing) was carefully reviewed
- Database schema was validated against requirements
- API design decisions were made with human oversight

### Conclusion on AI Usage

AI served as a powerful productivity tool that handled repetitive tasks, generated boilerplate code, and provided suggestions. However, all critical decisions, logic validation, and final implementation were done with human oversight to ensure correctness, security, and alignment with project requirements.

## 11. Conclusion

### What Was Achieved

This project successfully delivers a complete, production-ready Sweet Shop Management System with:

- **Full-Stack Implementation**: Complete backend API and frontend SPA
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Comprehensive Features**: User registration, product browsing, search/filter, purchase, and admin management
- **Modern Tech Stack**: Latest technologies (React, TypeScript, Express, Prisma, PostgreSQL)
- **Test Coverage**: Comprehensive test suite covering all major functionality
- **Professional Documentation**: Complete setup guides, API documentation, and usage instructions
- **Docker Integration**: Easy database setup with Docker Compose
- **Image Support**: Menu images integrated into the product display

### Skills Demonstrated

This project demonstrates proficiency in:

1. **Backend Development**:
   - RESTful API design and implementation
   - Database design and ORM usage (Prisma)
   - Authentication and authorization
   - Input validation and error handling
   - Test-driven development

2. **Frontend Development**:
   - React component architecture
   - State management with Context API
   - Protected routes and authentication
   - Responsive UI design with Tailwind CSS
   - API integration with Axios

3. **DevOps**:
   - Docker containerization
   - Environment configuration
   - Database migrations

4. **Software Engineering**:
   - Clean code architecture
   - Separation of concerns
   - Type safety with TypeScript
   - Comprehensive testing
   - Professional documentation

### Readiness for Production / Interview

This project is **interview-ready** and demonstrates:

- **Production-Quality Code**: Follows best practices, includes error handling, and is well-structured
- **Complete Feature Set**: All required features are implemented and working
- **Test Coverage**: Comprehensive tests demonstrate understanding of testing principles
- **Documentation**: Professional documentation shows ability to communicate technical concepts
- **Problem-Solving**: Demonstrates ability to build a complete system from scratch
- **Modern Practices**: Uses current technologies and follows industry standards

The system is ready for:
- Technical interviews and code reviews
- Portfolio demonstration
- Further development and feature additions
- Production deployment (with proper security hardening)

---

**Note**: Remember to change the `JWT_SECRET` in production and never commit sensitive information to version control.
#   - S w e e t - S h o p - M a n a g e m e n t - S y s t e m  
 