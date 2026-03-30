// Core Types for Catering Smart System

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  role: 'customer' | 'admin' | 'staff';
  emailVerified: boolean;
  marketingOptIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  addressType: 'delivery' | 'billing';
  label?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  accessInstructions?: string;
  isDefault: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  itemType: 'appetizer' | 'main' | 'side' | 'dessert' | 'beverage';
  basePrice: number;
  pricePerServing: number;
  minServings: number;
  preparationTime?: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isNutFree: boolean;
  allergens: string[];
  ingredients?: string;
  nutritionalInfo?: Record<string, any>;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  popularityScore: number;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  eventType: string;
  basePrice: number;
  minGuests: number;
  maxGuests?: number;
  imageUrl?: string;
  images?: Array<{ url: string; alt: string }>;
  isCustomizable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  popularityScore: number;
  ratingAverage: number;
  ratingCount: number;
  items?: PackageItem[];
}

export interface PackageItem {
  id: string;
  packageId: string;
  menuItemId: string;
  menuItem?: MenuItem;
  quantity: number;
  servingsPerGuest: number;
  isOptional: boolean;
  isSwappable: boolean;
  displayOrder: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  eventType: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  deliveryAddress: Address;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  serviceFee: number;
  discountAmount: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  specialInstructions?: string;
  dietaryRestrictions?: string;
  setupRequirements?: string;
  promoCode?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId?: string;
  packageId?: string;
  itemName: string;
  itemDescription?: string;
  itemType: string;
  quantity: number;
  servings: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: Record<string, any>;
}

export interface CartItem {
  id: string;
  type: 'package' | 'menu_item';
  packageId?: string;
  menuItemId?: string;
  name: string;
  quantity: number;
  guestCount?: number;
  basePrice: number;
  customizations?: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  promoCode?: string;
}

export interface Review {
  id: string;
  userId: string;
  orderId: string;
  packageId?: string;
  rating: number;
  title?: string;
  comment: string;
  foodQualityRating?: number;
  serviceRating?: number;
  valueRating?: number;
  isVerified: boolean;
  isApproved: boolean;
  userName?: string;
  createdAt: string;
}

export interface SavedPackage {
  id: string;
  userId: string;
  name: string;
  basePackageId?: string;
  customizations: Record<string, any>;
  estimatedPrice: number;
  guestCount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount' | 'free_delivery';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'menu_item' | 'package' | 'event';
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
}
