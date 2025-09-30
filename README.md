# AI Commerce - Full Stack E-commerce Application

A modern, full-stack e-commerce application with a React frontend and NestJS GraphQL backend, featuring multi-language support (Arabic/English) and comprehensive e-commerce functionality.

## 🏗️ Project Structure

```
AI-commerce/
├── client/          # React frontend with Vite
│   ├── src/
│   │   ├── components/  # React components (admin, client, shared)
│   │   ├── context/     # React context providers
│   │   ├── types/       # TypeScript type definitions
│   │   ├── lib/         # Apollo Client configuration
│   │   └── graphql/     # GraphQL queries and mutations
│   └── package.json
├── server/          # NestJS GraphQL API
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── users/       # User management
│   │   ├── products/    # Product & category management
│   │   ├── cart/        # Shopping cart functionality
│   │   ├── orders/      # Order management
│   │   └── prisma/      # Database service
│   ├── prisma/          # Database schema and migrations
│   └── package.json
└── README.md
```

## ✨ Features

### Frontend (React)
- 🎨 **Modern UI/UX** - Clean, responsive design with Tailwind CSS
- 🌐 **Multi-language Support** - Arabic and English localization
- 🌙 **Dark/Light Theme** - Theme switching with persistence
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **Authentication** - JWT-based login/register
- 🛒 **Shopping Cart** - Add, update, remove items
- 📦 **Product Catalog** - Browse, search, filter products
- 📋 **Order Management** - Order history and tracking
- 👨‍💼 **Admin Panel** - Product, order, and user management

### Backend (NestJS)
- 🚀 **GraphQL API** - Type-safe, modern API
- 🗄️ **Prisma ORM** - Type-safe database operations
- 🔒 **JWT Authentication** - Secure user authentication
- 🛡️ **Role-based Access Control** - Admin and client permissions
- 📊 **Real-time Data** - GraphQL subscriptions ready
- 🌱 **Database Seeding** - Pre-populated sample data
- 📈 **Scalable Architecture** - Modular NestJS structure

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **API Client**: Apollo Client (GraphQL)
- **Routing**: React Router v6
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: Class Validator & Class Transformer
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd AI-commerce

# Install dependencies for both client and server
cd client && npm install
cd ../server && npm install
```

### 2. Database Setup

```bash
cd server

# Configure your database URL in .env
cp .env .env.local
# Edit .env.local with your PostgreSQL credentials

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 3. Start Development Servers

```bash
# Terminal 1: Start backend server
cd server
npm run start:dev

# Terminal 2: Start frontend client
cd client
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **GraphQL Playground**: http://localhost:4000/graphql
- **Prisma Studio**: Run `npm run db:studio` in server folder

## 🔐 Default Login Credentials

After seeding the database, use these credentials:

- **Admin**: `admin@ecommerce.com` / `password123`
- **Client 1**: `john@example.com` / `password123`
- **Client 2**: `ahmed@example.com` / `password123`

## 📡 API Overview

### Authentication
- Login/Register with JWT tokens
- Role-based access control
- Protected routes for admin features

### Products
- Browse products with filtering and search
- Category-based organization
- Multi-language product information
- Admin product management (CRUD)

### Shopping Cart
- Add/remove/update cart items
- Persistent cart for logged-in users
- Real-time cart total calculation

### Orders
- Create orders from cart
- Guest checkout support
- Order status tracking
- Admin order management

### Users
- User profile management
- Admin user management
- Role assignment

## 🗄️ Database Schema

### Core Entities
- **User**: Authentication and profiles
- **Category**: Product categorization
- **Product**: Product catalog with multi-language support
- **CartItem**: Shopping cart items
- **Order**: Order headers
- **OrderItem**: Individual order line items

### Key Relationships
- Users have many CartItems and Orders
- Products belong to Categories
- Orders have many OrderItems
- CartItems and OrderItems reference Products

## 🌐 Multi-language Support

The application supports both Arabic and English:

- **Frontend**: Dynamic language switching with React Context
- **Backend**: Multi-language fields in database schema
- **Content**: Products and categories support both languages
- **UI**: RTL/LTR layout support

## 🔧 Development

### Backend Development

```bash
cd server

# Start with hot reload
npm run start:dev

# Build for production
npm run build

# Database operations
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
```

### Frontend Development

```bash
cd client

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Run database migrations
3. Build the application: `npm run build`
4. Start production server: `npm run start:prod`

### Frontend Deployment
1. Update API endpoint in Apollo Client configuration
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🎯 Next Steps

To connect the frontend with the new backend:

1. **Install Apollo Client** (already configured):
   ```bash
   cd client
   npm install @apollo/client graphql
   ```

2. **Update App.tsx** to include ApolloProvider
3. **Replace mock data context** with GraphQL queries
4. **Update components** to use GraphQL mutations
5. **Add authentication state management**
6. **Test all features** with the real backend

The GraphQL queries and Apollo Client configuration are already prepared in the client folder!

## 🔗 Documentation Links

- [NestJS Documentation](https://docs.nestjs.com/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
