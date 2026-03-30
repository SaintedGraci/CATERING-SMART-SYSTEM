# Catering Smart System - API Documentation

## Overview
RESTful API documentation for the catering smart system. Base URL: `/api/v1`

---

## Authentication

### Register User
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "companyName": "Acme Corp",
  "marketingOptIn": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

---

### Login
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "jwt_token_here"
  }
}
```

---

### Logout
```http
POST /api/v1/auth/logout
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

### Refresh Token
```http
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

---

### Forgot Password
```http
POST /api/v1/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

### Reset Password
```http
POST /api/v1/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "newSecurePassword123"
}
```

---

## Packages

### Get All Packages
```http
GET /api/v1/packages
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string)
- `eventType` (string)
- `minPrice` (number)
- `maxPrice` (number)
- `minGuests` (number)
- `maxGuests` (number)
- `sortBy` (string: price, popularity, rating)
- `sortOrder` (string: asc, desc)
- `search` (string)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "uuid",
        "name": "Corporate Lunch Package",
        "slug": "corporate-lunch-package",
        "description": "Perfect for business meetings",
        "basePrice": 299.99,
        "minGuests": 10,
        "maxGuests": 50,
        "imageUrl": "/images/package1.jpg",
        "eventType": "Corporate",
        "isCustomizable": true,
        "isFeatured": true,
        "ratingAverage": 4.5,
        "ratingCount": 23
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### Get Package by ID
```http
GET /api/v1/packages/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Corporate Lunch Package",
    "slug": "corporate-lunch-package",
    "description": "Perfect for business meetings",
    "basePrice": 299.99,
    "minGuests": 10,
    "maxGuests": 50,
    "imageUrl": "/images/package1.jpg",
    "images": [
      {"url": "/images/package1-1.jpg", "alt": "Main dish"},
      {"url": "/images/package1-2.jpg", "alt": "Dessert"}
    ],
    "eventType": "Corporate",
    "isCustomizable": true,
    "items": [
      {
        "id": "uuid",
        "menuItem": {
          "id": "uuid",
          "name": "Caesar Salad",
          "description": "Fresh romaine lettuce",
          "itemType": "appetizer",
          "pricePerServing": 5.99,
          "isVegetarian": true,
          "allergens": ["dairy", "gluten"]
        },
        "quantity": 1,
        "servingsPerGuest": 1,
        "isOptional": false,
        "isSwappable": true
      }
    ],
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent service!",
        "userName": "John D.",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "relatedPackages": []
  }
}
```

---

### Get Featured Packages
```http
GET /api/v1/packages/featured
```

**Response:** `200 OK`

---

## Menu Items

### Get All Menu Items
```http
GET /api/v1/menu-items
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `category` (string)
- `itemType` (string: appetizer, main, side, dessert, beverage)
- `isVegetarian` (boolean)
- `isVegan` (boolean)
- `isGlutenFree` (boolean)
- `isDairyFree` (boolean)
- `isNutFree` (boolean)
- `search` (string)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Grilled Chicken Breast",
        "slug": "grilled-chicken-breast",
        "description": "Tender grilled chicken",
        "itemType": "main",
        "basePrice": 12.99,
        "pricePerServing": 12.99,
        "minServings": 10,
        "isVegetarian": false,
        "isVegan": false,
        "isGlutenFree": true,
        "allergens": [],
        "imageUrl": "/images/chicken.jpg",
        "isAvailable": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 120,
      "totalPages": 6
    }
  }
}
```

---

### Get Menu Item by ID
```http
GET /api/v1/menu-items/:id
```

**Response:** `200 OK`

---

## Categories

### Get All Categories
```http
GET /api/v1/categories
```

**Query Parameters:**
- `type` (string: menu_item, package, event)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Corporate Events",
      "slug": "corporate-events",
      "description": "Professional catering for business",
      "type": "event",
      "displayOrder": 1,
      "isActive": true
    }
  ]
}
```

---

## Cart

### Get Cart
```http
GET /api/v1/cart
```

**Headers:** `Authorization: Bearer {token}` (optional for guest)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "type": "package",
        "packageId": "uuid",
        "name": "Corporate Lunch Package",
        "quantity": 1,
        "guestCount": 25,
        "basePrice": 299.99,
        "customizations": [
          {
            "menuItemId": "uuid",
            "name": "Extra Caesar Salad",
            "quantity": 5,
            "price": 29.95
          }
        ],
        "subtotal": 329.94
      }
    ],
    "subtotal": 329.94,
    "tax": 26.40,
    "deliveryFee": 15.00,
    "total": 371.34
  }
}
```

---

### Add to Cart
```http
POST /api/v1/cart/items
```

**Request Body:**
```json
{
  "type": "package",
  "packageId": "uuid",
  "guestCount": 25,
  "eventDate": "2024-06-15",
  "eventTime": "12:00",
  "customizations": [
    {
      "menuItemId": "uuid",
      "quantity": 5
    }
  ]
}
```

**Response:** `201 Created`

---

### Update Cart Item
```http
PUT /api/v1/cart/items/:itemId
```

**Request Body:**
```json
{
  "guestCount": 30,
  "customizations": []
}
```

**Response:** `200 OK`

---

### Remove from Cart
```http
DELETE /api/v1/cart/items/:itemId
```

**Response:** `204 No Content`

---

### Clear Cart
```http
DELETE /api/v1/cart
```

**Response:** `204 No Content`

---

### Apply Promo Code
```http
POST /api/v1/cart/promo-code
```

**Request Body:**
```json
{
  "code": "SUMMER2024"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "discountAmount": 30.00,
    "newTotal": 341.34
  }
}
```

---

## Orders

### Create Order
```http
POST /api/v1/orders
```

**Headers:** `Authorization: Bearer {token}` (optional for guest)

**Request Body:**
```json
{
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "companyName": "Acme Corp"
  },
  "eventDetails": {
    "eventType": "Corporate",
    "eventDate": "2024-06-15",
    "eventTime": "12:00",
    "guestCount": 25,
    "specialInstructions": "Please arrive 30 minutes early",
    "dietaryRestrictions": "2 vegetarian, 1 gluten-free",
    "setupRequirements": "full-service"
  },
  "deliveryAddress": {
    "street": "123 Business Ave",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "accessInstructions": "Use loading dock entrance",
    "contactPerson": "Jane Smith",
    "contactPhone": "+1234567891"
  },
  "paymentMethod": {
    "type": "credit_card",
    "cardToken": "tok_visa_token"
  },
  "promoCode": "SUMMER2024"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-2024-001234",
    "status": "confirmed",
    "total": 341.34,
    "confirmationEmail": "sent"
  }
}
```

---

### Get Order by ID
```http
GET /api/v1/orders/:id
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2024-001234",
    "status": "confirmed",
    "eventDate": "2024-06-15",
    "eventTime": "12:00",
    "guestCount": 25,
    "items": [],
    "subtotal": 329.94,
    "tax": 26.40,
    "deliveryFee": 15.00,
    "discountAmount": 30.00,
    "total": 341.34,
    "paymentStatus": "paid",
    "deliveryAddress": {},
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get User Orders
```http
GET /api/v1/orders
```

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string)

**Response:** `200 OK`

---

### Cancel Order
```http
POST /api/v1/orders/:id/cancel
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "reason": "Event postponed"
}
```

**Response:** `200 OK`

---

### Reorder
```http
POST /api/v1/orders/:id/reorder
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `201 Created`

---

## Saved Packages

### Get Saved Packages
```http
GET /api/v1/saved-packages
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My Custom Wedding Package",
      "basePackageId": "uuid",
      "customizations": {},
      "estimatedPrice": 1500.00,
      "guestCount": 100,
      "createdAt": "2024-01-10T14:20:00Z"
    }
  ]
}
```

---

### Save Package
```http
POST /api/v1/saved-packages
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "My Custom Wedding Package",
  "basePackageId": "uuid",
  "customizations": {},
  "guestCount": 100,
  "notes": "For summer wedding"
}
```

**Response:** `201 Created`

---

### Update Saved Package
```http
PUT /api/v1/saved-packages/:id
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

### Delete Saved Package
```http
DELETE /api/v1/saved-packages/:id
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

## Favorites

### Get Favorites
```http
GET /api/v1/favorites
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

### Add to Favorites
```http
POST /api/v1/favorites
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "packageId": "uuid"
}
```

**Response:** `201 Created`

---

### Remove from Favorites
```http
DELETE /api/v1/favorites/:packageId
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

## Reviews

### Get Package Reviews
```http
GET /api/v1/packages/:packageId/reviews
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `sortBy` (string: rating, date)

**Response:** `200 OK`

---

### Create Review
```http
POST /api/v1/orders/:orderId/review
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "packageId": "uuid",
  "rating": 5,
  "title": "Excellent service!",
  "comment": "The food was amazing and delivery was on time.",
  "foodQualityRating": 5,
  "serviceRating": 5,
  "valueRating": 4
}
```

**Response:** `201 Created`

---

## User Account

### Get Profile
```http
GET /api/v1/account/profile
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "companyName": "Acme Corp",
    "emailVerified": true,
    "marketingOptIn": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### Update Profile
```http
PUT /api/v1/account/profile
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "companyName": "Acme Corp"
}
```

**Response:** `200 OK`

---

### Change Password
```http
PUT /api/v1/account/password
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**Response:** `200 OK`

---

## Addresses

### Get Addresses
```http
GET /api/v1/account/addresses
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

### Add Address
```http
POST /api/v1/account/addresses
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "addressType": "delivery",
  "label": "Office",
  "street": "123 Business Ave",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "accessInstructions": "Use loading dock",
  "isDefault": true
}
```

**Response:** `201 Created`

---

### Update Address
```http
PUT /api/v1/account/addresses/:id
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

### Delete Address
```http
DELETE /api/v1/account/addresses/:id
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

## Payment Methods

### Get Payment Methods
```http
GET /api/v1/account/payment-methods
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

### Add Payment Method
```http
POST /api/v1/account/payment-methods
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "paymentType": "credit_card",
  "cardToken": "tok_visa_token",
  "billingAddressId": "uuid",
  "isDefault": true
}
```

**Response:** `201 Created`

---

### Delete Payment Method
```http
DELETE /api/v1/account/payment-methods/:id
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `204 No Content`

---

## Notifications

### Get Notifications
```http
GET /api/v1/notifications
```

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `isRead` (boolean)

**Response:** `200 OK`

---

### Mark as Read
```http
PUT /api/v1/notifications/:id/read
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

### Mark All as Read
```http
PUT /api/v1/notifications/read-all
```

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

---

## Blog

### Get Blog Posts
```http
GET /api/v1/blog
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `category` (string)
- `tag` (string)

**Response:** `200 OK`

---

### Get Blog Post
```http
GET /api/v1/blog/:slug
```

**Response:** `200 OK`

---

## FAQ

### Get FAQs
```http
GET /api/v1/faq
```

**Query Parameters:**
- `category` (string)
- `search` (string)

**Response:** `200 OK`

---

## Admin Endpoints

### Get Dashboard Stats
```http
GET /api/v1/admin/dashboard
```

**Headers:** `Authorization: Bearer {admin_token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "todayOrders": 15,
    "pendingOrders": 8,
    "totalRevenue": 12500.00,
    "averageOrderValue": 425.50,
    "topPackages": [],
    "recentOrders": []
  }
}
```

---

### Manage Orders
```http
GET /api/v1/admin/orders
PUT /api/v1/admin/orders/:id/status
```

---

### Manage Packages
```http
GET /api/v1/admin/packages
POST /api/v1/admin/packages
PUT /api/v1/admin/packages/:id
DELETE /api/v1/admin/packages/:id
```

---

### Manage Menu Items
```http
GET /api/v1/admin/menu-items
POST /api/v1/admin/menu-items
PUT /api/v1/admin/menu-items/:id
DELETE /api/v1/admin/menu-items/:id
```

---

### Manage Customers
```http
GET /api/v1/admin/customers
GET /api/v1/admin/customers/:id
```

---

### Reports
```http
GET /api/v1/admin/reports/sales
GET /api/v1/admin/reports/popular-items
GET /api/v1/admin/reports/customer-analytics
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limiting

- Anonymous: 100 requests per 15 minutes
- Authenticated: 1000 requests per 15 minutes
- Admin: 5000 requests per 15 minutes

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Pagination

All list endpoints support pagination with consistent format:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response:**
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Webhooks

### Order Status Changed
```json
{
  "event": "order.status_changed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "orderId": "uuid",
    "orderNumber": "ORD-2024-001234",
    "oldStatus": "confirmed",
    "newStatus": "preparing"
  }
}
```

### Payment Completed
```json
{
  "event": "payment.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "orderId": "uuid",
    "amount": 341.34,
    "transactionId": "txn_123456"
  }
}
```
