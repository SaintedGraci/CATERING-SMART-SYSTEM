// Application Constants

export const APP_NAME = "CaterSmart";
export const APP_DESCRIPTION = "Catering Made Simple";

export const CONTACT_INFO = {
  email: "hello@catersmart.com",
  phone: "(555) 123-4567",
  hours: "Mon-Fri 9AM-6PM"
};

export const ROUTES = {
  HOME: "/",
  PACKAGES: "/packages",
  MENU: "/menu",
  CUSTOMIZE: "/customize",
  CART: "/cart",
  CHECKOUT: "/checkout",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ACCOUNT: "/account",
  ORDERS: "/account/orders",
  SAVED_PACKAGES: "/account/saved",
  SETTINGS: "/account/settings",
  GALLERY: "/gallery",
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  BLOG: "/blog",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  REFUND: "/refund"
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded"
} as const;

export const ITEM_TYPES = {
  APPETIZER: "appetizer",
  MAIN: "main",
  SIDE: "side",
  DESSERT: "dessert",
  BEVERAGE: "beverage"
} as const;

export const EVENT_TYPES = [
  "Corporate",
  "Wedding",
  "Birthday",
  "Anniversary",
  "Baby Shower",
  "Graduation",
  "Holiday Party",
  "Other"
] as const;

export const DIETARY_FILTERS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "glutenFree", label: "Gluten-Free" },
  { id: "dairyFree", label: "Dairy-Free" },
  { id: "nutFree", label: "Nut-Free" }
] as const;

export const SORT_OPTIONS = [
  { value: "popularity", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" }
] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
} as const;
