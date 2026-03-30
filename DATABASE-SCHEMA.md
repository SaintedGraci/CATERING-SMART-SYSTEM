# Catering Smart System - Database Schema

## Overview
This document defines the database structure for the catering smart system, supporting package management, customization, orders, and user accounts.

---

## Core Tables

### 1. Users
Stores customer and admin account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  company_name VARCHAR(255),
  role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
  email_verified BOOLEAN DEFAULT false,
  marketing_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

### 2. Addresses
Stores delivery and billing addresses for users.

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address_type ENUM('delivery', 'billing') NOT NULL,
  label VARCHAR(50), -- e.g., "Home", "Office"
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'USA',
  access_instructions TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
```

---

### 3. Categories
Organizes menu items and packages into categories.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  type ENUM('menu_item', 'package', 'event') NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_slug ON categories(slug);
```

---

### 4. Menu Items
Individual food and beverage items available for selection.

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  item_type ENUM('appetizer', 'main', 'side', 'dessert', 'beverage') NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  price_per_serving DECIMAL(10, 2) NOT NULL,
  min_servings INT DEFAULT 1,
  preparation_time INT, -- in minutes
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_dairy_free BOOLEAN DEFAULT false,
  is_nut_free BOOLEAN DEFAULT false,
  allergens TEXT[], -- array of allergen strings
  ingredients TEXT,
  nutritional_info JSONB,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  popularity_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_type ON menu_items(item_type);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_slug ON menu_items(slug);
```

---

### 5. Packages
Pre-configured catering packages.

```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  event_type VARCHAR(100), -- e.g., "Wedding", "Corporate", "Birthday"
  base_price DECIMAL(10, 2) NOT NULL,
  min_guests INT NOT NULL,
  max_guests INT,
  image_url VARCHAR(500),
  images JSONB, -- array of image objects
  is_customizable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  popularity_score INT DEFAULT 0,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packages_category ON packages(category_id);
CREATE INDEX idx_packages_active ON packages(is_active);
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_event_type ON packages(event_type);
```

---

### 6. Package Items
Links menu items to packages with quantities.

```sql
CREATE TABLE package_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  servings_per_guest DECIMAL(5, 2) DEFAULT 1,
  is_optional BOOLEAN DEFAULT false,
  is_swappable BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_package_items_package ON package_items(package_id);
CREATE INDEX idx_package_items_menu_item ON package_items(menu_item_id);
```

---

### 7. Orders
Customer orders for catering services.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_email VARCHAR(255), -- for guest checkouts
  guest_name VARCHAR(255),
  guest_phone VARCHAR(20),
  
  -- Order details
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
  event_type VARCHAR(100),
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  guest_count INT NOT NULL,
  
  -- Delivery information
  delivery_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  delivery_street VARCHAR(255) NOT NULL,
  delivery_city VARCHAR(100) NOT NULL,
  delivery_state VARCHAR(100) NOT NULL,
  delivery_postal_code VARCHAR(20) NOT NULL,
  delivery_instructions TEXT,
  contact_person VARCHAR(255),
  contact_phone VARCHAR(20),
  
  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  
  -- Additional
  special_instructions TEXT,
  dietary_restrictions TEXT,
  setup_requirements TEXT,
  promo_code VARCHAR(50),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_event_date ON orders(event_date);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

---

### 8. Order Items
Individual items within an order.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  
  item_name VARCHAR(255) NOT NULL, -- snapshot at order time
  item_description TEXT,
  item_type VARCHAR(50),
  
  quantity INT NOT NULL,
  servings INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  customizations JSONB, -- any special modifications
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);
CREATE INDEX idx_order_items_package ON order_items(package_id);
```

---

### 9. Saved Packages
Customer-saved customized packages for future ordering.

```sql
CREATE TABLE saved_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  base_package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  customizations JSONB NOT NULL, -- stores all customization details
  estimated_price DECIMAL(10, 2),
  guest_count INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_packages_user ON saved_packages(user_id);
```

---

### 10. Reviews
Customer reviews and ratings for packages and orders.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  food_quality_rating INT CHECK (food_quality_rating >= 1 AND food_quality_rating <= 5),
  service_rating INT CHECK (service_rating >= 1 AND service_rating <= 5),
  value_rating INT CHECK (value_rating >= 1 AND value_rating <= 5),
  
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  admin_response TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_package ON reviews(package_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
```

---

### 11. Promo Codes
Discount codes for promotions.

```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  
  discount_type ENUM('percentage', 'fixed_amount', 'free_delivery') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  
  min_order_amount DECIMAL(10, 2),
  max_discount_amount DECIMAL(10, 2),
  
  usage_limit INT, -- total uses allowed
  usage_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  
  is_active BOOLEAN DEFAULT true,
  applicable_packages UUID[], -- array of package IDs
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active);
```

---

### 12. Promo Code Usage
Tracks promo code usage by users.

```sql
CREATE TABLE promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  discount_applied DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_usage_code ON promo_code_usage(promo_code_id);
CREATE INDEX idx_promo_usage_user ON promo_code_usage(user_id);
```

---

### 13. Payment Methods
Saved payment methods for users.

```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  payment_type ENUM('credit_card', 'debit_card', 'paypal') NOT NULL,
  
  -- Tokenized card info (never store actual card numbers)
  card_token VARCHAR(255),
  card_last_four VARCHAR(4),
  card_brand VARCHAR(50), -- Visa, Mastercard, etc.
  card_exp_month INT,
  card_exp_year INT,
  
  billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  
  is_default BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
```

---

### 14. Favorites
User's favorite packages and menu items.

```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_package ON favorites(package_id);
CREATE UNIQUE INDEX idx_favorites_unique ON favorites(user_id, package_id);
```

---

### 15. Cart
Temporary shopping cart for users.

```sql
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255), -- for guest users
  
  items JSONB NOT NULL, -- stores cart items structure
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_session ON cart(session_id);
```

---

### 16. Notifications
System notifications for users.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- order_confirmed, order_delivered, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
```

---

### 17. Blog Posts
Content marketing and informational articles.

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  
  featured_image VARCHAR(500),
  category VARCHAR(100),
  tags TEXT[],
  
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  published_at TIMESTAMP,
  
  view_count INT DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at);
```

---

### 18. FAQ
Frequently asked questions.

```sql
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_active ON faqs(is_active);
```

---

### 19. Activity Log
Audit trail for important actions.

```sql
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50), -- order, package, user, etc.
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);
```

---

## Relationships Summary

### One-to-Many Relationships
- Users → Addresses
- Users → Orders
- Users → Saved Packages
- Users → Reviews
- Users → Payment Methods
- Users → Favorites
- Packages → Package Items
- Orders → Order Items
- Categories → Menu Items
- Categories → Packages

### Many-to-Many Relationships
- Packages ↔ Menu Items (through package_items)
- Users ↔ Packages (through favorites)

---

## Data Integrity Rules

1. Soft deletes for orders and users (maintain historical data)
2. Cascade deletes for dependent records (addresses, cart items)
3. Snapshot pricing and item details in orders (preserve order history)
4. Validate email uniqueness
5. Ensure at least one default address per user
6. Prevent duplicate favorites
7. Expire guest carts after 24 hours
8. Archive old orders after 2 years

---

## Indexes Strategy

- Primary keys on all tables
- Foreign key indexes for join performance
- Composite indexes for common query patterns
- Text search indexes on searchable fields (names, descriptions)
- Partial indexes for filtered queries (is_active, status)

---

## Security Considerations

1. Never store plain text passwords (use bcrypt/argon2)
2. Never store actual credit card numbers (use payment gateway tokens)
3. Encrypt sensitive personal information
4. Use row-level security for multi-tenant data
5. Implement rate limiting on authentication tables
6. Regular backup schedule
7. Audit logging for sensitive operations
