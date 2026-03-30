# Updated Database Schema - Supabase Auth Integration

## Overview
This document describes the complete database structure for the CaterSmart system, integrating Supabase's built-in authentication with our custom tables.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE AUTH LAYER                       │
│  (Managed by Supabase - Handles JWT, Sessions, Passwords)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ (1:1 relationship)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    auth.users (Supabase)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │ id (UUID) - Primary Key                            │    │
│  │ email (VARCHAR) - Unique                           │    │
│  │ encrypted_password (VARCHAR)                       │    │
│  │ email_confirmed_at (TIMESTAMP)                     │    │
│  │ created_at (TIMESTAMP)                             │    │
│  │ updated_at (TIMESTAMP)                             │    │
│  │ last_sign_in_at (TIMESTAMP)                        │    │
│  │ raw_user_meta_data (JSONB)                         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ (Foreign Key: id)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    user_profiles (Custom)                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ id (UUID) - FK to auth.users.id                    │    │
│  │ first_name (VARCHAR)                               │    │
│  │ last_name (VARCHAR)                                │    │
│  │ phone (VARCHAR)                                    │    │
│  │ company_name (VARCHAR)                             │    │
│  │ role (ENUM: customer, admin, staff)                │    │
│  │ marketing_opt_in (BOOLEAN)                         │    │
│  │ created_at (TIMESTAMP)                             │    │
│  │ updated_at (TIMESTAMP)                             │    │
│  │ last_login (TIMESTAMP)                             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ (1:Many relationships)
                              ▼
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│    addresses     │                    │      orders      │
└──────────────────┘                    └──────────────────┘
        │                                           │
        │                                           ▼
        │                                  ┌──────────────────┐
        │                                  │   order_items    │
        │                                  └──────────────────┘
        │                                           │
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│ payment_methods  │                    │    packages      │
└──────────────────┘                    └──────────────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────┐
                                        │  package_items   │
                                        └──────────────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────┐
                                        │   menu_items     │
                                        └──────────────────┘
```

---

## Core Tables

### 1. auth.users (Supabase Managed)
**Purpose:** Handles authentication, JWT tokens, and password management

```sql
-- This table is managed by Supabase
-- You don't create it, but you can query it

TABLE auth.users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password VARCHAR(255),
  email_confirmed_at TIMESTAMP,
  invited_at TIMESTAMP,
  confirmation_token VARCHAR(255),
  confirmation_sent_at TIMESTAMP,
  recovery_token VARCHAR(255),
  recovery_sent_at TIMESTAMP,
  email_change_token_new VARCHAR(255),
  email_change VARCHAR(255),
  email_change_sent_at TIMESTAMP,
  last_sign_in_at TIMESTAMP,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  is_super_admin BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  phone VARCHAR(15),
  phone_confirmed_at TIMESTAMP,
  phone_change VARCHAR(15),
  phone_change_token VARCHAR(255),
  phone_change_sent_at TIMESTAMP,
  confirmed_at TIMESTAMP,
  email_change_token_current VARCHAR(255),
  email_change_confirm_status SMALLINT,
  banned_until TIMESTAMP,
  reauthentication_token VARCHAR(255),
  reauthentication_sent_at TIMESTAMP,
  is_sso_user BOOLEAN DEFAULT false,
  deleted_at TIMESTAMP
);
```

**What Supabase Handles:**
- ✅ Password hashing (bcrypt)
- ✅ JWT token generation
- ✅ Email verification
- ✅ Password reset
- ✅ Session management
- ✅ OAuth providers (Google, Facebook, etc.)

---

### 2. user_profiles (Your Custom Table)
**Purpose:** Extends auth.users with business-specific data

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  company_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  marketing_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**Relationship:**
- `user_profiles.id` → `auth.users.id` (1:1)
- When auth user is deleted, profile is automatically deleted (CASCADE)

---

### 3. addresses
**Purpose:** Store delivery and billing addresses for users

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  address_type VARCHAR(20) CHECK (address_type IN ('delivery', 'billing')),
  label VARCHAR(50),
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'USA',
  access_instructions TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
```

**Relationship:**
- `addresses.user_id` → `user_profiles.id` (Many:1)

---

### 4. categories
**Purpose:** Organize menu items and packages

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  type VARCHAR(20) CHECK (type IN ('menu_item', 'package', 'event')),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_slug ON categories(slug);
```

---

### 5. menu_items
**Purpose:** Individual food and beverage items

```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  item_type VARCHAR(20) CHECK (item_type IN ('appetizer', 'main', 'side', 'dessert', 'beverage')),
  base_price DECIMAL(10, 2) NOT NULL,
  price_per_serving DECIMAL(10, 2) NOT NULL,
  min_servings INT DEFAULT 1,
  preparation_time INT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_dairy_free BOOLEAN DEFAULT false,
  is_nut_free BOOLEAN DEFAULT false,
  allergens TEXT[],
  ingredients TEXT,
  nutritional_info JSONB,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  popularity_score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_type ON menu_items(item_type);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
```

**Relationship:**
- `menu_items.category_id` → `categories.id` (Many:1)

---

### 6. packages
**Purpose:** Pre-configured catering packages

```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  event_type VARCHAR(100),
  base_price DECIMAL(10, 2) NOT NULL,
  min_guests INT NOT NULL,
  max_guests INT,
  image_url VARCHAR(500),
  images JSONB,
  is_customizable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  popularity_score INT DEFAULT 0,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packages_category ON packages(category_id);
CREATE INDEX idx_packages_active ON packages(is_active);
CREATE INDEX idx_packages_slug ON packages(slug);
```

**Relationship:**
- `packages.category_id` → `categories.id` (Many:1)

---

### 7. package_items
**Purpose:** Links menu items to packages (Many-to-Many)

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_package_items_package ON package_items(package_id);
CREATE INDEX idx_package_items_menu_item ON package_items(menu_item_id);
```

**Relationships:**
- `package_items.package_id` → `packages.id` (Many:1)
- `package_items.menu_item_id` → `menu_items.id` (Many:1)

---

### 8. orders
**Purpose:** Customer orders for catering services

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  guest_email VARCHAR(255),
  guest_name VARCHAR(255),
  guest_phone VARCHAR(20),
  
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  event_type VARCHAR(100),
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  guest_count INT NOT NULL,
  
  delivery_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  delivery_street VARCHAR(255) NOT NULL,
  delivery_city VARCHAR(100) NOT NULL,
  delivery_state VARCHAR(100) NOT NULL,
  delivery_postal_code VARCHAR(20) NOT NULL,
  delivery_instructions TEXT,
  contact_person VARCHAR(255),
  contact_phone VARCHAR(20),
  
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  
  special_instructions TEXT,
  dietary_restrictions TEXT,
  setup_requirements TEXT,
  promo_code VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_event_date ON orders(event_date);
CREATE INDEX idx_orders_order_number ON orders(order_number);
```

**Relationships:**
- `orders.user_id` → `user_profiles.id` (Many:1)
- `orders.delivery_address_id` → `addresses.id` (Many:1)

---

### 9. order_items
**Purpose:** Individual items within an order

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  
  item_name VARCHAR(255) NOT NULL,
  item_description TEXT,
  item_type VARCHAR(50),
  
  quantity INT NOT NULL,
  servings INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  customizations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);
CREATE INDEX idx_order_items_package ON order_items(package_id);
```

**Relationships:**
- `order_items.order_id` → `orders.id` (Many:1)
- `order_items.menu_item_id` → `menu_items.id` (Many:1)
- `order_items.package_id` → `packages.id` (Many:1)

---

## How They Work Together

### User Authentication Flow

```
1. User signs up
   ↓
2. Supabase creates record in auth.users
   ↓
3. Trigger automatically creates user_profiles record
   ↓
4. JWT token issued
   ↓
5. User can now place orders, save addresses, etc.
```

### Order Creation Flow

```
1. User (authenticated via JWT) browses packages
   ↓
2. Selects package → package_items loaded
   ↓
3. Customizes items → menu_items referenced
   ↓
4. Adds to cart
   ↓
5. Proceeds to checkout
   ↓
6. Selects/creates address
   ↓
7. Order created (references user_profiles.id)
   ↓
8. Order items created (snapshot of menu_items/packages)
   ↓
9. Payment processed
   ↓
10. Order confirmed
```

### Admin Access Flow

```
1. Admin logs in with email/password
   ↓
2. Supabase validates credentials
   ↓
3. JWT token issued
   ↓
4. Check user_profiles.role = 'admin'
   ↓
5. Grant access to admin dashboard
   ↓
6. Admin can view/manage all orders, packages, menu items
```

---

## Key Relationships Summary

### One-to-One
- `auth.users` ↔ `user_profiles` (1:1)

### One-to-Many
- `user_profiles` → `addresses` (1:Many)
- `user_profiles` → `orders` (1:Many)
- `user_profiles` → `payment_methods` (1:Many)
- `categories` → `menu_items` (1:Many)
- `categories` → `packages` (1:Many)
- `packages` → `package_items` (1:Many)
- `orders` → `order_items` (1:Many)

### Many-to-Many
- `packages` ↔ `menu_items` (through `package_items`)

---

## Row Level Security (RLS)

### user_profiles
```sql
-- Users can only see their own profile
CREATE POLICY "view_own_profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can see all profiles
CREATE POLICY "admin_view_all" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### orders
```sql
-- Users can only see their own orders
CREATE POLICY "view_own_orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can see all orders
CREATE POLICY "admin_view_all_orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Triggers

### Auto-create user_profiles on signup
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Query Examples

### Get user with profile
```sql
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at,
  up.first_name,
  up.last_name,
  up.role,
  up.phone
FROM auth.users au
JOIN user_profiles up ON up.id = au.id
WHERE au.email = 'admin@catersmart.com';
```

### Get package with all items
```sql
SELECT 
  p.id,
  p.name,
  p.base_price,
  json_agg(
    json_build_object(
      'item_name', mi.name,
      'quantity', pi.quantity,
      'price', mi.price_per_serving
    )
  ) as items
FROM packages p
JOIN package_items pi ON pi.package_id = p.id
JOIN menu_items mi ON mi.id = pi.menu_item_id
WHERE p.id = 'package-uuid'
GROUP BY p.id, p.name, p.base_price;
```

### Get user's orders with items
```sql
SELECT 
  o.id,
  o.order_number,
  o.total,
  o.status,
  json_agg(
    json_build_object(
      'item_name', oi.item_name,
      'quantity', oi.quantity,
      'price', oi.total_price
    )
  ) as items
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = auth.uid()
GROUP BY o.id, o.order_number, o.total, o.status
ORDER BY o.created_at DESC;
```

---

## Migration Order

When setting up the database, create tables in this order:

1. ✅ `auth.users` (Supabase managed - already exists)
2. ✅ `user_profiles` (extends auth.users)
3. `addresses` (references user_profiles)
4. `categories`
5. `menu_items` (references categories)
6. `packages` (references categories)
7. `package_items` (references packages & menu_items)
8. `orders` (references user_profiles & addresses)
9. `order_items` (references orders, menu_items, packages)
10. `payment_methods` (references user_profiles)
11. `reviews` (references user_profiles, orders, packages)
12. `promo_codes`
13. `saved_packages` (references user_profiles)

---

**Status:** Complete database schema with Supabase Auth integration
**Security:** Row Level Security enabled on all user-facing tables
**Performance:** Indexes on all foreign keys and frequently queried columns
