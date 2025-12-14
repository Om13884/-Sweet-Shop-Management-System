# Sweet Shop Frontend

Frontend SPA for the Sweet Shop Management System built with React, Vite, TypeScript, and Tailwind CSS.

> **Note**: For complete setup instructions and project overview, see the [root README.md](../README.md).

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**Note**: Ensure the backend API is running on `http://localhost:3000` before starting the frontend.

## Features

- User authentication (Register/Login)
- Dashboard with sweet listings and images
- Search and filter functionality
- Purchase functionality
- Admin panel for managing sweets
- Responsive design with Tailwind CSS
- Protected routes based on user roles

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/
│   ├── menu-images/     # Sweet product images
│   └── index.html
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/          # Page components
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── AdminPanel.tsx
│   ├── services/       # API services
│   │   ├── auth.service.ts
│   │   └── sweet.service.ts
│   ├── contexts/       # React contexts
│   │   └── AuthContext.tsx
│   ├── types/          # TypeScript types
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   └── imageMapper.ts
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
└── package.json
```

## Pages

### `/register` - User Registration
- Email and password registration form
- Validation and error handling
- Redirects to dashboard on success

### `/login` - User Login
- Email and password login form
- Error handling for invalid credentials
- Redirects to dashboard on success

### `/dashboard` - Main Dashboard
- Displays all available sweets in a grid layout
- Shows product images, names, categories, prices, and quantities
- Search and filter functionality (name, category, price range)
- Purchase button (disabled when out of stock)
- Accessible to all authenticated users

### `/admin` - Admin Panel
- Table view of all sweets with images
- Create, edit, and delete sweets
- Restock functionality
- Accessible only to ADMIN role users

## Components

### Navbar
- Displays user email and role
- Shows "Admin Panel" link for admin users
- Logout functionality

### ProtectedRoute
- Route guard component
- Checks authentication status
- Enforces role-based access (for admin routes)

## Environment Variables

Create `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:3000/api
```

- **Description**: Backend API base URL
- **Default**: `http://localhost:3000/api` (hardcoded in code)
- **Note**: Vite requires `VITE_` prefix for environment variables

## Image Management

Product images are stored in `public/menu-images/` and automatically mapped to sweets based on their names using the `imageMapper` utility. The system supports:

- Automatic image matching based on sweet names
- Fallback to default image if no match found
- Error handling for missing images

## API Integration

The frontend communicates with the backend API through service files:

- `auth.service.ts` - Handles authentication (register, login, logout)
- `sweet.service.ts` - Handles sweet operations (CRUD, purchase, restock)

All API requests include JWT tokens in the Authorization header for authenticated endpoints.

## Authentication Flow

1. User registers or logs in
2. JWT token is stored in localStorage
3. Token is included in all API requests
4. AuthContext manages authentication state
5. Protected routes check authentication status
6. Admin routes additionally check user role

For more information, see the [root README.md](../README.md).
