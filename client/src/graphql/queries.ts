import { gql } from '@apollo/client';

// Auth Queries
export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        email
        name
        nameEn
        role
        avatar
        joinedAt
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
        id
        email
        name
        nameEn
        role
        avatar
        joinedAt
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      nameEn
      role
      avatar
      joinedAt
    }
  }
`;

// Product Queries
export const GET_PRODUCTS = gql`
  query GetProducts($categoryId: ID, $featured: Boolean, $active: Boolean, $search: String) {
    products(categoryId: $categoryId, featured: $featured, active: $active, search: $search) {
      id
      name
      nameEn
      nameAr
      price
      description
      descriptionEn
      descriptionAr
      image
      images
      stock
      featured
      active
      createdAt
      category {
        id
        name
        nameEn
        nameAr
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      nameEn
      nameAr
      price
      description
      descriptionEn
      descriptionAr
      image
      images
      stock
      featured
      active
      createdAt
      category {
        id
        name
        nameEn
        nameAr
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      nameEn
      nameAr
      description
      _count {
        products
      }
    }
  }
`;

// Cart Queries
export const GET_CART = gql`
  query GetCart {
    cart {
      id
      quantity
      createdAt
      product {
        id
        name
        nameEn
        nameAr
        price
        image
        stock
        category {
          name
          nameEn
          nameAr
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($addToCartInput: AddToCartInput!) {
    addToCart(addToCartInput: $addToCartInput) {
      id
      quantity
      product {
        id
        name
        nameEn
        nameAr
        price
        image
        stock
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($updateCartItemInput: UpdateCartItemInput!) {
    updateCartItem(updateCartItemInput: $updateCartItemInput) {
      id
      quantity
      product {
        id
        name
        price
        image
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cartItemId: ID!) {
    removeFromCart(cartItemId: $cartItemId) {
      id
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

// Order Queries
export const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      id
      orderNumber
      total
      status
      customerName
      customerEmail
      shippingAddress
      phoneNumber
      notes
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          name
          nameEn
          nameAr
          image
        }
      }
    }
  }
`;

export const CREATE_GUEST_ORDER = gql`
  mutation CreateGuestOrder($createOrderInput: CreateOrderInput!) {
    createGuestOrder(createOrderInput: $createOrderInput) {
      id
      orderNumber
      total
      status
      customerName
      customerEmail
      shippingAddress
      phoneNumber
      notes
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          name
          nameEn
          nameAr
          image
        }
      }
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders($status: OrderStatus) {
    myOrders(status: $status) {
      id
      orderNumber
      total
      status
      customerName
      customerEmail
      shippingAddress
      phoneNumber
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          name
          nameEn
          nameAr
          image
        }
      }
    }
  }
`;

export const GET_ORDER_BY_NUMBER = gql`
  query GetOrderByNumber($orderNumber: String!) {
    orderByNumber(orderNumber: $orderNumber) {
      id
      orderNumber
      total
      status
      customerName
      customerEmail
      shippingAddress
      phoneNumber
      notes
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          name
          nameEn
          nameAr
          image
        }
      }
    }
  }
`;

// Admin Queries
export const GET_ALL_ORDERS = gql`
  query GetAllOrders($status: OrderStatus) {
    orders(status: $status) {
      id
      orderNumber
      total
      status
      customerName
      customerEmail
      shippingAddress
      phoneNumber
      createdAt
      user {
        id
        name
        email
      }
      items {
        id
        quantity
        price
        product {
          id
          name
          nameEn
          nameAr
          image
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      name
      nameEn
      role
      avatar
      joinedAt
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($updateOrderStatusInput: UpdateOrderStatusInput!) {
    updateOrderStatus(updateOrderStatusInput: $updateOrderStatusInput) {
      id
      orderNumber
      status
      updatedAt
    }
  }
`;

// Product Management (Admin)
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      name
      nameEn
      nameAr
      price
      description
      descriptionEn
      descriptionAr
      image
      images
      stock
      featured
      active
      category {
        id
        name
        nameEn
        nameAr
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($updateProductInput: UpdateProductInput!) {
    updateProduct(updateProductInput: $updateProductInput) {
      id
      name
      nameEn
      nameAr
      price
      description
      descriptionEn
      descriptionAr
      image
      images
      stock
      featured
      active
      category {
        id
        name
        nameEn
        nameAr
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    removeProduct(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      id
      name
      nameEn
      nameAr
      description
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    removeCategory(id: $id) {
      id
      name
    }
  }
`;
