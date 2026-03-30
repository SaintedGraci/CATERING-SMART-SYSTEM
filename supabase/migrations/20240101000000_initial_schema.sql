-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'staff');
CREATE TYPE address_type AS ENUM ('delivery', 'billing');
CREATE TYPE category_type AS ENUM ('menu_item', 'package', 'event');
CREATE TYPE item_type AS ENUM ('appetizer', 'main', 'side', 'dessert', 'beverage');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount', 'free_delivery');
CREATE TYPE payment_type AS ENUM ('cr