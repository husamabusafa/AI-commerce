# AI Commerce Server

A modern e-commerce backend built with NestJS, GraphQL, Prisma, and PostgreSQL.

## Features

- 🚀 **NestJS Framework** - Scalable Node.js server-side applications
- 📊 **GraphQL API** - Modern API with type safety and introspection
- 🗄️ **Prisma ORM** - Next-generation ORM for type-safe database access
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 🛡️ **Role-based Access Control** - Admin and client user roles
- 🌐 **Multi-language Support** - Arabic and English content support
- 📦 **Product Management** - Categories, inventory, and featured products
- 🛒 **Shopping Cart** - User-specific cart management
- 📋 **Order Management** - Complete order lifecycle tracking
- 🌱 **Database Seeding** - Pre-populated data for development

## Tech Stack

- **Framework**: NestJS
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: Class Validator & Class Transformer
- **Language**: TypeScript

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env .env.local
   # Edit .env.local with your database credentials
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

## Environment Variables

Create a `.env` file in the server root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_commerce?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# App
PORT=4000
NODE_ENV="development"

# CORS
CLIENT_URL="http://localhost:5173"
```

## Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run build` - Build the application
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## API Endpoints

The GraphQL API will be available at:
- **GraphQL Playground**: `http://localhost:4000/graphql`
- **API Endpoint**: `http://localhost:4000/graphql`

## Database Schema

### Core Entities

- **User** - Authentication and user management
- **Category** - Product categorization
- **Product** - Product catalog with multi-language support
- **CartItem** - Shopping cart functionality
- **Order** - Order management and tracking
- **OrderItem** - Individual items within orders

### Key Features

- Multi-language support (Arabic/English)
- Role-based access control (Admin/Client)
- Inventory management with stock tracking
- Order status tracking (Pending → Processing → Shipped → Delivered)
- Featured products and categories
- Guest checkout support

## Authentication

The API uses JWT-based authentication. Login credentials for seeded users:

- **Admin**: `admin@ecommerce.com` / `password123`
- **Client 1**: `john@example.com` / `password123`
- **Client 2**: `ahmed@example.com` / `password123`

### Protected Routes

- **Admin Only**: User management, product management, order management
- **Authenticated Users**: Cart operations, order creation, profile management
- **Public**: Product browsing, guest checkout

## GraphQL Examples

### Authentication
```graphql
# Login
mutation {
  login(loginInput: { email: "admin@ecommerce.com", password: "password123" }) {
    accessToken
    user {
      id
      name
      email
      role
    }
  }
}

# Register
mutation {
  register(registerInput: { 
    email: "user@example.com"
    password: "password123"
    name: "User Name"
  }) {
    accessToken
    user {
      id
      name
      email
    }
  }
}
```

### Products
```graphql
# Get all products
query {
  products {
    id
    name
    price
    image
    stock
    featured
    category {
      name
    }
  }
}

# Get featured products
query {
  products(featured: true) {
    id
    name
    price
    image
  }
}

# Search products
query {
  products(search: "headphones") {
    id
    name
    price
    description
  }
}
```

### Cart Management
```graphql
# Add to cart
mutation {
  addToCart(addToCartInput: { productId: "product-id", quantity: 2 }) {
    id
    quantity
    product {
      name
      price
    }
  }
}

# Get cart
query {
  cart {
    id
    quantity
    product {
      name
      price
      image
    }
  }
}
```

### Orders
```graphql
# Create order
mutation {
  createOrder(createOrderInput: {
    customerName: "John Doe"
    customerEmail: "john@example.com"
    shippingAddress: "123 Main St, City, Country"
    items: [
      { productId: "product-id", quantity: 1 }
    ]
  }) {
    id
    orderNumber
    total
    status
  }
}

# Get my orders
query {
  myOrders {
    id
    orderNumber
    total
    status
    createdAt
    items {
      quantity
      price
      product {
        name
      }
    }
  }
}
```

## Development

1. **Start the development server:**
   ```bash
   npm run start:dev
   ```

2. **Open GraphQL Playground:**
   Navigate to `http://localhost:4000/graphql`

3. **Database GUI:**
   ```bash
   npm run db:studio
   ```

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm run start:prod
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
