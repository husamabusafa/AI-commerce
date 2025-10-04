# AI Commerce Admin Panel - Agent Setup Guide

This guide explains how to configure your AI agent on the HSAFA AI Agent Studio platform to work with the AI Commerce admin panel.

## Prerequisites

1. Access to HSAFA AI Agent Studio
2. AI Commerce application running (client + server)
3. Admin user credentials

## Step 1: Create Your Agent

1. Log in to HSAFA AI Agent Studio
2. Create a new agent with ID: `admin-assistant`
3. Configure the agent with the following settings:

### Agent Configuration

**Name:** AI Commerce Admin Assistant  
**Description:** AI assistant for managing the AI Commerce admin panel  
**Model:** GPT-4 or GPT-4 Turbo (recommended for best performance)  

### System Prompt

```
You are an AI assistant for the AI Commerce admin panel. You help administrators manage products, orders, categories, and users efficiently.

Your capabilities include:
- Navigating between different admin pages
- Creating, reading, updating, and deleting products
- Managing categories
- Viewing and updating order statuses
- Searching and filtering data
- Generating reports and statistics

Always be helpful, professional, and efficient. When performing actions, explain what you're doing and confirm the results. If an action fails, explain the error and suggest alternatives.

When the user asks to perform an action:
1. Confirm you understand the request
2. Execute the necessary actions
3. Report the results clearly
4. Ask if they need anything else

Be proactive in suggesting relevant actions based on the context.
```

## Step 2: Import Action Schemas

Import all the action schemas from the `AI_AGENT_ACTIONS.md` file. Here are the key actions to configure:

### Navigation Actions (1 action)
- `navigate` - Single action to navigate to any admin page

### Product Actions (6 actions)
- `getProducts`
- `getProduct`
- `searchProducts`
- `createProduct`
- `updateProduct`
- `deleteProduct`

### Category Actions (3 actions)
- `getCategories`
- `createCategory`
- `deleteCategory`

### Order Actions (6 actions)
- `getOrders`
- `getOrder`
- `searchOrders`
- `filterOrdersByStatus`
- `updateOrderStatus`
- `getOrderStats`

### User Actions (4 actions)
- `getUsers`
- `searchUsers`
- `filterUsersByRole`
- `getUserStats`

### Dashboard Actions (3 actions)
- `getDashboardStats`
- `getLowStockProducts`
- `getRecentOrders`

**Total: 25 actions**

## Step 3: Configure Each Action

For each action, use the Zod schema provided in `AI_AGENT_ACTIONS.md`. 

### Example: Creating the `createProduct` Action

**Action Name:** `createProduct`

**Description:** Create a new product in the store

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

**When to use:** When the user wants to create a new product, add a product, or list a new item.

## Step 4: Train Your Agent

Add example conversations to help the agent understand how to use actions:

### Example 1: Navigation
**User:** "Show me the products page"  
**Agent:** "I'll navigate you to the products page."  
*Action: `navigate` with `{ path: "/admin/products" }`*  
**Agent:** "You're now on the products page. I can help you search, add, edit, or delete products. What would you like to do?"

### Example 2: Product Search
**User:** "Find all laptops"  
**Agent:** "I'll search for laptop products."  
*Action: `searchProducts` with `{ query: "laptop" }`*  
**Agent:** "I found 5 laptop products. Here they are: [list products]. Would you like me to update any of them?"

### Example 3: Creating a Product
**User:** "Add a new MacBook Pro for $2499"  
**Agent:** "I'll create a new MacBook Pro product. I'll need a few more details:"  
- What's the full name? "MacBook Pro 16-inch"
- Description? "Powerful laptop for professionals"
- Category? "Electronics"
- Stock quantity? "15"
- Featured? "Yes"
- Image URL? "[user provides]"

*Action: `createProduct` with all details*  
**Agent:** "Product created successfully! The MacBook Pro has been added with 15 units in stock. Would you like to view it or create another product?"

### Example 4: Order Management
**User:** "Show me all pending orders"  
**Agent:** "I'll fetch all pending orders for you."  
*Action: `filterOrdersByStatus` with `{ status: "pending" }`*  
**Agent:** "There are 12 pending orders. The most recent is order #ORD-1234 from John Doe for $299.99. Would you like me to update any order statuses?"

### Example 5: Dashboard Stats
**User:** "Give me a summary of the store"  
**Agent:** "I'll get the dashboard statistics for you."  
*Action: `getDashboardStats`*  
**Agent:** "Here's your store summary:
- Total Revenue: $45,678
- Total Orders: 234
- Total Products: 89
- Total Users: 156
- Low Stock Products: 8
- Pending Orders: 12

Would you like to see more details about any of these?"

### Example 6: Complex Workflow
**User:** "I need to see all low stock items and mark them as not featured"  
**Agent:** "I'll help you with that. First, let me get the low stock products."  
*Action: `getLowStockProducts`*  
**Agent:** "I found 8 products with low stock. Now I'll update them to not be featured."  
*Actions: Multiple `updateProduct` calls with `{ productId: "...", featured: false }`*  
**Agent:** "Done! I've updated all 8 low stock products to not be featured. They are: [list products]. This will help prioritize restocking."

## Step 5: Configure Agent Behavior

### Agent Personality
- Professional and efficient
- Proactive in suggesting related actions
- Clear in explaining what it's doing
- Helpful in error scenarios

### Agent Capabilities Prompt
Add this to help the agent understand when to use actions:

```
When asked to navigate, always use the appropriate navigation action first.

When asked about data (products, orders, users):
1. Use get/search/filter actions to retrieve data
2. Present results clearly
3. Offer to perform related actions

When asked to create/update/delete:
1. Gather all required information
2. Confirm the action with the user
3. Execute the action
4. Report success/failure
5. Suggest next steps

For complex requests:
1. Break down into steps
2. Execute actions in logical order
3. Report progress
4. Provide summary at the end

Always check action results and handle errors gracefully.
```

## Step 6: Test Your Agent

### Test Cases

1. **Navigation Test**
   - "Take me to the products page"
   - "Show me the orders"
   - "Go to dashboard"

2. **Data Retrieval Test**
   - "How many products do we have?"
   - "Show me all pending orders"
   - "What's the total revenue?"

3. **Search Test**
   - "Find products with 'phone' in the name"
   - "Search for orders from john@example.com"
   - "Show me all admin users"

4. **Create Test**
   - "Add a new product: iPhone 15 Pro, $999, 20 in stock"
   - "Create a new electronics category"

5. **Update Test**
   - "Change the price of product X to $799"
   - "Mark order #123 as shipped"
   - "Update product stock to 50"

6. **Delete Test**
   - "Delete the product with ID abc123"
   - "Remove the Accessories category"

7. **Complex Workflow Test**
   - "Find all products under $100 and mark them as featured"
   - "Show me today's orders and mark the pending ones as processing"
   - "Give me a report on low stock items and navigate to the add product page"

## Step 7: Deploy

1. Save your agent configuration
2. Make sure the agent ID is `admin-assistant`
3. Ensure your AI Commerce app is configured with:
   - `VITE_API_BASE_URL` environment variable pointing to your HSAFA backend
   - Server running on port 4777 (or your configured port)

## Step 8: Using the Agent

1. Log in to AI Commerce admin panel as an ADMIN user
2. The AI chat widget will appear in the bottom-right corner (or bottom-left in RTL mode)
3. Click the chat button to open the assistant
4. Start interacting with your AI assistant!

## Troubleshooting

### Agent doesn't appear
- Check that you're logged in as ADMIN
- Verify you're on an `/admin/*` route
- Check browser console for errors

### Actions not working
- Verify action names match exactly (case-sensitive)
- Check Zod schemas are correct
- Ensure the agent has all actions configured
- Check network tab for API calls

### Wrong responses
- Review system prompt
- Add more training examples
- Check action descriptions are clear
- Test with simpler prompts first

## Advanced Configuration

### Custom UI Components

You can also register custom React components for the agent to render. Add this to `AdminAgentActions.tsx`:

```typescript
import { useHsafaComponent } from '@hsafa/ui-sdk';

// Inside your component:
useHsafaComponent('ProductCard', ProductCard);
useHsafaComponent('OrderSummary', OrderSummary);
useHsafaComponent('StatsDashboard', StatsDashboard);
```

Then configure your agent to return UI items:
```json
{
  "type": "ui",
  "component": "ProductCard",
  "props": {
    "name": "iPhone 15",
    "price": 999,
    "image": "..."
  }
}
```

### Environment Variables

Add to `.env`:
```
VITE_API_BASE_URL=http://localhost:4777
VITE_AGENT_ID=admin-assistant
```

## Support

For issues or questions:
- Check `AI_AGENT_ACTIONS.md` for action reference
- Review HSAFA UI SDK documentation
- Check the AdminAgentActions.tsx implementation
- Contact HSAFA support

---

**Note:** Make sure your HSAFA backend is configured to accept requests from your AI Commerce application (CORS settings).
