# AI Commerce Admin Panel - AI Agent Actions

This document lists all available **UI manipulation actions** for the AI agent. These actions perform operations (navigate, create, update, delete) rather than retrieve data. The agent can see data through the UI itself.

## Action Types

**🔄 Streaming Actions** - Execute on each AI token for real-time form filling  
**✅ Execute-Once Actions** - Execute once with complete data

## Available Actions

| Action | Type | Purpose |
|--------|------|---------|
| `navigate` | ✅ | Navigate between pages |
| `fillProductForm` | 🔄 | Fill product creation form incrementally |
| `submitProductForm` | ✅ | Click submit button (form already filled) |
| `fillProductEditForm` | 🔄 | Fill product edit form incrementally |
| `submitProductUpdate` | ✅ | Click submit button (form already filled) |
| `deleteProduct` | ✅ | Delete a product |
| `fillCategoryForm` | 🔄 | Fill category form incrementally |
| `submitCategoryForm` | ✅ | Click submit button (form already filled) |
| `deleteCategory` | ✅ | Delete a category |
| `updateOrderStatus` | ✅ | Update order status |

## Table of Contents
- [Navigation](#navigation)
- [Product Actions](#product-actions)
- [Category Actions](#category-actions)
- [Order Actions](#order-actions)

---

## Navigation

### `navigate` ✅
Navigate to any page in the admin panel.

**Zod Schema:**
```typescript
z.object({
  path: z.string().describe("The page path to navigate to (e.g., /admin/products, /admin/orders)")
})
```

**Available Paths:**
- `/admin` - Dashboard
- `/admin/products` - Products list
- `/admin/products/add` - Add product page
- `/admin/products/:id/edit` - Edit product page
- `/admin/orders` - Orders list
- `/admin/categories` - Categories list
- `/admin/categories/add` - Add category page

**Example:**
```json
{ "path": "/admin/products" }
```

---

## Product Actions

### `fillProductForm` 🔄
Fill product form fields incrementally for real-time form population.

**Zod Schema:**
```typescript
z.object({
  name: z.string().optional().describe("Product name"),
  nameAr: z.string().optional().describe("Product name in Arabic"),
  nameEn: z.string().optional().describe("Product name in English"),
  price: z.number().positive().optional().describe("Product price"),
  description: z.string().optional().describe("Product description"),
  descriptionAr: z.string().optional().describe("Product description in Arabic"),
  descriptionEn: z.string().optional().describe("Product description in English"),
  image: z.string().url().optional().describe("Product image URL"),
  categoryId: z.string().optional().describe("Category ID"),
  stock: z.number().int().nonnegative().optional().describe("Stock quantity"),
  featured: z.boolean().optional().describe("Whether the product is featured")
})
```

**Example:**
```json
{
  "name": "MacBook Pro 16",
  "price": 2499.99,
  "description": "Powerful laptop"
}
```

---

### `submitProductForm` ✅
Submit the product creation form. Triggers the form submission button.

**Zod Schema:**
```typescript
z.object({})
```

**Note:** This action clicks the submit button. The form should already be filled using `fillProductForm`.

---

### `fillProductEditForm` 🔄
Fill product edit form fields incrementally.

**Zod Schema:**
```typescript
z.object({
  productId: z.string().describe("The ID of the product to edit"),
  name: z.string().optional().describe("Product name"),
  nameAr: z.string().optional().describe("Product name in Arabic"),
  nameEn: z.string().optional().describe("Product name in English"),
  price: z.number().positive().optional().describe("Product price"),
  description: z.string().optional().describe("Product description"),
  descriptionAr: z.string().optional().describe("Product description in Arabic"),
  descriptionEn: z.string().optional().describe("Product description in English"),
  image: z.string().url().optional().describe("Product image URL"),
  categoryId: z.string().optional().describe("Category ID"),
  stock: z.number().int().nonnegative().optional().describe("Stock quantity"),
  featured: z.boolean().optional().describe("Whether the product is featured")
})
```

---

### `submitProductUpdate` ✅
Submit the product update form. Triggers the form submission button.

**Zod Schema:**
```typescript
z.object({})
```

**Note:** This action clicks the submit button. The form should already be filled using `fillProductEditForm`.

---

### `deleteProduct` ✅
Delete a product by ID.

**Zod Schema:**
```typescript
z.object({
  productId: z.string().describe("The ID of the product to delete")
})
```

**Example:**
```json
{ "productId": "clx123abc456" }
```

---

## Category Actions

### `fillCategoryForm` 🔄
Fill category form fields incrementally.

**Zod Schema:**
```typescript
z.object({
  name: z.string().optional().describe("Category name"),
  nameAr: z.string().optional().describe("Category name in Arabic"),
  nameEn: z.string().optional().describe("Category name in English"),
  description: z.string().optional().describe("Category description")
})
```

**Example:**
```json
{
  "name": "Electronics",
  "nameEn": "Electronics",
  "nameAr": "إلكترونيات"
}
```

---

### `submitCategoryForm` ✅
Submit the category creation form. Triggers the form submission button.

**Zod Schema:**
```typescript
z.object({})
```

**Note:** This action clicks the submit button. The form should already be filled using `fillCategoryForm`.

---

### `deleteCategory` ✅
Delete a category by ID.

**Zod Schema:**
```typescript
z.object({
  categoryId: z.string().describe("The ID of the category to delete")
})
```

**Example:**
```json
{ "categoryId": "clx-category-123" }
```

---

## Order Actions

### `updateOrderStatus` ✅
Update the status of an order.

**Zod Schema:**
```typescript
z.object({
  orderId: z.string().describe("The ID of the order to update"),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .describe("The new order status")
})
```

**Example:**
```json
{
  "orderId": "clx-order-123",
  "status": "shipped"
}
```

---

## Integration Details

- **SDK**: `@hsafa/ui-sdk`
- **Provider**: Wrapped in `HsafaProvider` at the app root
- **Agent ID**: `cmgc542tk0006qg104qx65ccj`
- **Base URL**: Set via `VITE_API_BASE_URL` environment variable (default: `http://localhost:3900`)
- **Theme Support**: Synced with app theme (light/dark)
- **Language Support**: Synced with app language (Arabic/English)
- **RTL Support**: Automatically adapts to RTL layout when Arabic is selected
- **Availability**: Only shown when user is logged in as ADMIN

---

## Action Philosophy

These actions are designed for **UI manipulation**, not data retrieval. Actions come in two types:

### 🔄 Streaming Actions
- Fill forms incrementally for real-time visual feedback
- Support partial data with all fields optional
- Examples: `fillProductForm`, `fillCategoryForm`, `fillProductEditForm`

### ✅ Execute-Once Actions
- Perform final operations like submit, delete, navigate
- Require complete data for execution
- Examples: `submitProductForm`, `deleteProduct`, `navigate`, `updateOrderStatus`

The agent should **observe data through the UI** rather than calling getter actions. This keeps actions focused on performing operations rather than querying state.

---

## Usage Examples

### Creating a Product with Streaming

The AI agent uses two actions to create a product with real-time form filling:

**Step 1: Fill form incrementally** 🔄
```json
// Action: fillProductForm
// Executes multiple times as data streams in
{
  "name": "Gaming Mouse",
  "price": 49.99
}
// Then updates with more fields...
{
  "description": "RGB gaming mouse with 16000 DPI",
  "image": "https://example.com/mouse.jpg",
  "categoryId": "electronics-id",
  "stock": 50,
  "featured": true
}
```

**Step 2: Submit form** ✅
```json
// Action: submitProductForm
// Just triggers the submit button - no data needed
{}
```

### Updating a Product

**Step 1: Fill edit form** 🔄
```json
// Action: fillProductEditForm
{
  "productId": "product-123",
  "stock": 100,
  "price": 39.99
}
```

**Step 2: Submit update** ✅
```json
// Action: submitProductUpdate
// Just triggers the submit button - no data needed
{}
```

### Other Actions

**Update order status:**
```json
// Action: updateOrderStatus
{
  "orderId": "order-456",
  "status": "shipped"
}
```

**Navigate:**
```json
// Action: navigate
{ "path": "/admin/products" }
```

---

## Notes

- All actions return `{ success: boolean, error?: string }`
- Toast notifications are automatically shown for user feedback
- All mutations trigger GraphQL refetch to update the UI
- Actions only work when authenticated as ADMIN user
- Agent can see all data through the rendered UI pages
