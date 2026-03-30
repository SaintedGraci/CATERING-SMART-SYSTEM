# Catering Smart System - Website Sitemap

## 1. Home Page (`/`)
- Hero section with value proposition
- Featured packages showcase
- How it works (3-step process)
- Customer testimonials
- Call-to-action buttons

## 2. Browse Packages (`/packages`)
- Package categories filter (Corporate, Wedding, Birthday, etc.)
- Package cards with images, pricing, and quick details
- Sort options (price, popularity, rating)
- Search functionality

### 2.1 Package Details (`/packages/[id]`)
- Package overview and description
- Included items list
- Pricing breakdown
- Customization options
- Add to cart button
- Related packages

## 3. Customize Package (`/customize`)
- Step-by-step customization wizard
  - Step 1: Select base package or start from scratch
  - Step 2: Choose menu items (appetizers, mains, desserts, beverages)
  - Step 3: Set quantities and serving sizes
  - Step 4: Add special requests/dietary requirements
  - Step 5: Select delivery date and time
- Real-time price calculator
- Save customization for later
- Proceed to checkout

## 4. Menu (`/menu`)
- Browse all available food items
- Categories: Appetizers, Main Courses, Sides, Desserts, Beverages
- Dietary filters (Vegetarian, Vegan, Gluten-free, etc.)
- Allergen information
- Item details modal

## 5. Cart (`/cart`)
- Selected packages and items
- Quantity adjustments
- Remove items
- Apply promo codes
- Order summary with total
- Proceed to checkout

## 6. Checkout (`/checkout`)
- Customer information form
- Delivery details
- Event information
- Payment method selection
- Order review
- Terms and conditions
- Place order button

## 7. Order Confirmation (`/order/[id]/confirmation`)
- Order number and details
- Estimated delivery time
- Payment receipt
- Next steps information
- Download invoice option

## 8. Account Section

### 8.1 Login (`/login`)
- Email/password login
- Social login options
- Forgot password link
- Sign up link

### 8.2 Sign Up (`/signup`)
- Registration form
- Email verification

### 8.3 My Account (`/account`)
- Dashboard overview
- Quick actions

### 8.4 Order History (`/account/orders`)
- Past orders list
- Order status tracking
- Reorder functionality
- Download invoices

### 8.5 Saved Packages (`/account/saved`)
- Saved customizations
- Favorite packages
- Quick edit and order

### 8.6 Profile Settings (`/account/settings`)
- Personal information
- Delivery addresses
- Payment methods
- Notification preferences

## 9. About Us (`/about`)
- Company story
- Mission and values
- Team introduction
- Certifications and awards

## 10. Services (`/services`)
- Catering services overview
- Event types we serve
- Service areas
- Additional services (staff, equipment rental)

## 11. Gallery (`/gallery`)
- Event photos
- Food presentation images
- Filter by event type
- Customer event showcases

## 12. Contact (`/contact`)
- Contact form
- Phone and email
- Business hours
- Location map
- FAQ section

## 13. Blog (`/blog`)
- Catering tips and guides
- Recipe ideas
- Event planning advice
- Company news

### 13.1 Blog Post (`/blog/[slug]`)
- Article content
- Related posts
- Share buttons

## 14. FAQ (`/faq`)
- Categorized questions
- Search functionality
- Ordering process
- Customization options
- Delivery and setup
- Payment and cancellation

## 15. Terms & Policies

### 15.1 Terms of Service (`/terms`)
### 15.2 Privacy Policy (`/privacy`)
### 15.3 Refund Policy (`/refund`)
### 15.4 Delivery Policy (`/delivery`)

## 16. Admin Section (Protected)

### 16.1 Admin Dashboard (`/admin`)
- Overview statistics
- Recent orders
- Quick actions

### 16.2 Manage Orders (`/admin/orders`)
- Order list with filters
- Order details and status updates
- Customer communication

### 16.3 Manage Packages (`/admin/packages`)
- Create/edit/delete packages
- Package availability
- Pricing management

### 16.4 Manage Menu Items (`/admin/menu`)
- Add/edit/delete items
- Inventory tracking
- Category management

### 16.5 Customer Management (`/admin/customers`)
- Customer list
- Customer details
- Order history per customer

### 16.6 Reports (`/admin/reports`)
- Sales reports
- Popular items
- Customer analytics
- Revenue tracking

---

## Navigation Structure

### Primary Navigation
- Home
- Packages
- Menu
- How It Works
- Gallery
- Contact

### Secondary Navigation
- About Us
- Blog
- FAQ

### User Menu (Logged in)
- My Account
- Order History
- Saved Packages
- Settings
- Logout

### Footer Navigation
- About Us
- Services
- Contact
- Blog
- FAQ
- Terms of Service
- Privacy Policy
- Refund Policy

---

## Key User Flows

### Flow 1: Browse and Order Pre-made Package
Home → Packages → Package Details → Add to Cart → Checkout → Confirmation

### Flow 2: Customize Package
Home → Customize → Select Base → Choose Items → Set Details → Cart → Checkout → Confirmation

### Flow 3: Quick Reorder
Login → Order History → Select Order → Reorder → Cart → Checkout → Confirmation

### Flow 4: Save for Later
Customize → Save Package → Continue Later → My Account → Saved Packages → Edit → Order
