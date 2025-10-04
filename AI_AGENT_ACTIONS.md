# AI Commerce Admin Panel - AI Agent Actions

This document lists all available actions that the AI agent can perform in the admin panel, along with their Zod schema definitions.

## Table of Contents
- [Navigation Actions](#navigation-actions)
- [Product CRUD Actions](#product-crud-actions)
- [Category Actions](#category-actions)
- [Order Actions](#order-actions)
- [User Actions](#user-actions)
- [Dashboard Actions](#dashboard-actions)

---

## Navigation Actions

### `navigate`
Navigate to any page in the admin panel.

**Zod Schema:**
```typescript
z.object({
  path: z.string().describe("The path to navigate to")
})
```

**Available Paths:**
- `/admin` - Dashboard
- `/admin/products` - Products list
- `/admin/products/add` - Add product page
- `/admin/products/:id/edit` - Edit product page (replace :id with product ID)
- `/admin/orders` - Orders list
- `/admin/categories` - Categories list
- `/admin/categories/add` - Add category page

**Examples:**
```typescript
// Navigate to dashboard
{ "path": "/admin" }

// Navigate to products
{ "path": "/admin/products" }

// Navigate to add product
{ "path": "/admin/products/add" }

// Navigate to edit specific product
{ "path": "/admin/products/clx123abc456/edit" }

// Navigate to orders
{ "path": "/admin/orders" }

// Navigate to categories
{ "path": "/admin/categories" }
```

---

## Product CRUD Actions

### `getProducts`
Get all products.

**Zod Schema:**
```typescript
z.object({})
```

**Returns:**
```typescript
{
  success: true,
  products: Product[],
  count: number
}
```

**Example:**
```typescript
{}
```

---

### `getProduct`
Get a specific product by ID.

**Zod Schema:**
```typescript
z.object({
  productId: z.string().describe("The ID of the product to retrieve")
})
```

**Returns:**
```typescript
{
  success: true,
  product: Product
}
```

**Example:**
```typescript
{
  "productId": "clx123abc456"
}
```

---

### `searchProducts`
Search products by name, description, or category.

**Zod Schema:**
```typescript
z.object({
  query: z.string().describe("Search query string")
})
```

**Returns:**
```typescript
{
  success: true,
  products: Product[],
  count: number,
  query: string
}
```

**Example:**
```typescript
{
  "query": "laptop"
}
```

---

### `createProduct`
Create a new product.

**Zod Schema:**
```typescript
z.object({
  name: z.string().describe("Product name"),
  nameAr: z.string().optional().describe("Arabic product name"),
  nameEn: z.string().optional().describe("English product name"),
  price: z.number().positive().describe("Product price"),
  description: z.string().describe("Product description"),
  descriptionAr: z.string().optional().describe("Arabic description"),
  descriptionEn: z.string().optional().describe("English description"),
  image: z.string().url().describe("Product image URL"),
  categoryId: z.string().describe("Category ID"),
  stock: z.number().int().nonnegative().describe("Stock quantity"),
  featured: z.boolean().optional().describe("Whether product is featured")
})
```

**Returns:**
```typescript
{
  success: true,
  product: Product
}
```

**Example:**
```typescript
{
  "name": "MacBook Pro 16",
  "nameEn": "MacBook Pro 16",
  "nameAr": "ماك بوك برو 16",
  "price": 2499.99,
  "description": "Powerful laptop for professionals",
  "descriptionEn": "Powerful laptop for professionals",
  "descriptionAr": "جهاز محمول قوي للمحترفين",
  "image": "https://example.com/macbook.jpg",
  "categoryId": "clx-electronics-123",
  "stock": 15,
  "featured": true
}
```

---

### `updateProduct`
Update an existing product.

**Zod Schema:**
```typescript
z.object({
  productId: z.string().describe("The ID of the product to update"),
  name: z.string().optional(),
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  image: z.string().url().optional(),
  categoryId: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  featured: z.boolean().optional()
})
```

**Returns:**
```typescript
{
  success: true,
  product: Product
}
```

**Example:**
```typescript
{
  "productId": "clx123abc456",
  "price": 2299.99,
  "stock": 20,
  "featured": false
}
```

---

### `deleteProduct`
Delete a product.

**Zod Schema:**
```typescript
z.object({
  productId: z.string().describe("The ID of the product to delete")
})
```

**Returns:**
```typescript
{
  success: true
}
```

**Example:**
```typescript
{
  "productId": "clx123abc456"
}
```

---

## Category Actions

### `getCategories`
Get all categories.

**Zod Schema:**
```typescript
z.object({})
```

**Returns:**
```typescript
{
  success: true,
  categories: Category[],
  count: number
}
```

**Example:**
```typescript
{}
```

---

### `createCategory`
Create a new category.

**Zod Schema:**
```typescript
z.object({
  name: z.string().describe("Category name"),
  nameAr: z.string().describe("Arabic category name"),
  nameEn: z.string().describe("English category name"),
  description: z.string().optional().describe("Category description")
})
```

**Returns:**
```typescript
{
  success: true,
  category: Category
}
```

**Example:**
```typescript
{
  "name": "Electronics",
  "nameEn": "Electronics",
  "nameAr": "إلكترونيات",
  "description": "Electronic devices and accessories"
}
```

---

### `deleteCategory`
Delete a category.

**Zod Schema:**
```typescript
z.object({
  categoryId: z.string().describe("The ID of the category to delete")
})
```

**Returns:**
```typescript
{
  success: true
}
```

**Example:**
```typescript
{
  "categoryId": "clx-category-123"
}
```

---

## Order Actions

### `getOrders`
Get all orders.

**Zod Schema:**
```typescript
z.object({})
```

**Returns:**
```typescript
{
  success: true,
  orders: Order[],
  count: number
}
```

**Example:**
```typescript
{}
```

---

### `getOrder`
Get a specific order by ID.

**Zod Schema:**
```typescript
z.object({
  orderId: z.string().describe("The ID of the order to retrieve")
})
```

**Returns:**
```typescript
{
  success: true,
  order: Order
}
```

**Example:**
```typescript
{
  "orderId": "clx-order-123"
}
```

---

### `searchOrders`
Search orders by ID, customer name, or email.

**Zod Schema:**
```typescript
z.object({
  query: z.string().describe("Search query string")
})
```

**Returns:**
```typescript
{
  success: true,
  orders: Order[],
  count: number,
  query: string
}
```

**Example:**
```typescript
{
  "query": "john@example.com"
}
```

---

### `filterOrdersByStatus`
Filter orders by status.

**Zod Schema:**
```typescript
z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .describe("Order status to filter by")
})
```

**Returns:**
```typescript
{
  success: true,
  orders: Order[],
  count: number,
  status: string
}
```

**Example:**
```typescript
{
  "status": "pending"
}
```

---

### `updateOrderStatus`
Update the status of an order.

**Zod Schema:**
```typescript
z.object({
  orderId: z.string().describe("The ID of the order to update"),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .describe("New order status")
})
```

**Returns:**
```typescript
{
  success: true,
  orderId: string,
  status: string
}
```

**Example:**
```typescript
{
  "orderId": "clx-order-123",
  "status": "shipped"
}
```

---

### `getOrderStats`
Get order statistics.

**Zod Schema:**
```typescript
z.object({})
```

**Returns:**
```typescript
{
  success: true,
  stats: {
    total: number,
    pending: number,
    processing: number,
    shipped: number,
    delivered: number,
    cancelled: number,
    totalRevenue: number
  }
}
```

**Example:**
```typescript
{}
```

---

## User Actions

### `getUsers`
Get all users.

**Zod Schema:**
```typescript
z.object({})
```

**Returns:**
```typescript
{
  success: true,
  users: User[],
  count: number
}
```

**Example:**
```typescript
{}
```

---

### `searchUsers`
Search users by name or email.

**Zod Schema:**
```typescript
z.object({
  query: z.string().describe("Search query string")
})
```

**Returns:**
```typescript
{
  success: true,
  users: User[],
  count: number,
  query: string
}
```

**Example:**
```typescript
{
  "query": "john"
}
```

---

### `filterUsersByRole`
Filter users by role.

**Zod Schema:**
```typescript
z.object({
  role: z.enum(['ADMIN', 'CLIENT']).describe("User role to filter by")
})
```

**Returns:**
```typescript
{
  success: true,
  users: User[],
  count: number,
  role: string
}
```

**Example:**
```typescript
{
  "role": "CLIENT"
}
```

---

### `getUserStats`
Get user statistics.

**Zod Schema:**
```typescript
z.object({})
```

**Returns:**
```typescript
{
  success: true,
  stats: {
    total: number,
    admins: number,
    clients: number,
    newUsers: number
  }
}
```

**Example:**
```typescript
{}
```

---

## Dashboard Actions

### `getDashboardStats`
Get dashboard statistics including revenue, orders, products, and users.

**Zod Schema:**
```typescript
z.object({})
```

**Returns:**
```typescript
{
  success: true,
  stats: {
    totalRevenue: number,
    totalOrders: number,
    totalProducts: number,
    totalUsers: number,
    lowStockProducts: number,
    pendingOrders: number
  }
}
```

**Example:**
```typescript
{}
```

---

### `getLowStockProducts`
Get products with low stock.

**Zod Schema:**
```typescript
z.object({
  threshold: z.number().int().positive().optional()
    .describe("Stock threshold (default: 10)")
})
```

**Returns:**
```typescript
{
  success: true,
  products: Product[],
  count: number,
  threshold: number
}
```

**Example:**
```typescript
{
  "threshold": 5
}
```

---

### `getRecentOrders`
Get recent orders.

**Zod Schema:**
```typescript
z.object({
  limit: z.number().int().positive().optional()
    .describe("Number of orders to return (default: 5)")
})
```

**Returns:**
```typescript
{
  success: true,
  orders: Order[],
  count: number
}
```

**Example:**
```typescript
{
  "limit": 10
}
```

---

## Type Definitions

### Product
```typescript
{
  id: string;
  name: string;
  nameEn: string;
  nameAr: string;
  price: number;
  description: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  category: Category;
  stock: number;
  featured: boolean;
  createdAt: string;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  nameEn: string;
  nameAr: string;
}
```

### Order
```typescript
{
  id: string;
  orderNumber?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  phoneNumber?: string;
  createdAt: string;
}
```

### User
```typescript
{
  id: string;
  name: string;
  nameEn?: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  avatar: string;
  joinedAt: string;
}
```

---

## Integration Details

- **SDK**: `@hsafa/ui-sdk`
- **Provider**: Wrapped in `HsafaProvider` at the app root
- **Agent ID**: `admin-assistant`
- **Base URL**: Set via `VITE_API_BASE_URL` environment variable (default: `http://localhost:4777`)
- **Theme Support**: Synced with app theme (light/dark)
- **Language Support**: Synced with app language (Arabic/English)
- **RTL Support**: Automatically adapts to RTL layout when Arabic is selected
- **Availability**: Only shown when user is logged in as ADMIN

---

## Usage Example

The AI agent can perform complex workflows by combining multiple actions:

**Example: "Find all low stock products in the Electronics category and create a report"**

1. `getCategories` → Get category ID for "Electronics"
2. `getLowStockProducts` → Get products with stock < 10
3. Filter products by category
4. Return formatted report

**Example: "Update the price of all laptops to be 10% off"**

1. `searchProducts` with query "laptop"
2. For each product: `updateProduct` with new price (original * 0.9)
3. Return summary of updated products

**Example: "Show me pending orders from the last 24 hours"**

1. `filterOrdersByStatus` with status "pending"
2. Filter by date in the last 24 hours
3. Return formatted list

---

## Notes

- All actions return a `success` boolean indicating operation status
- Failed operations include an `error` field with the error message
- Toast notifications are automatically shown for user feedback
- All mutations trigger GraphQL refetch to update the UI
- Actions only work when authenticated as ADMIN user
