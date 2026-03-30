# Project Structure

## Overview
This document outlines the professional folder structure for the CaterSmart catering system built with Next.js 14+ (App Router).

## Directory Structure

```
catering-smart-system/
├── public/                      # Static assets
│   ├── images/                  # Image files
│   ├── icons/                   # Icon files
│   └── fonts/                   # Custom fonts
│
├── src/                         # Source code
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/             # Auth route group
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (main)/             # Main route group
│   │   │   ├── packages/
│   │   │   ├── menu/
│   │   │   ├── customize/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── gallery/
│   │   ├── account/            # User account pages
│   │   │   ├── orders/
│   │   │   ├── saved/
│   │   │   └── settings/
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── packages/
│   │   │   ├── menu-items/
│   │   │   └── customers/
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   ├── packages/
│   │   │   ├── menu-items/
│   │   │   ├── orders/
│   │   │   └── cart/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── layout/            # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── home/              # Home page components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── FeaturedPackages.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CTASection.tsx
│   │   ├── packages/          # Package components
│   │   │   ├── PackageCard.tsx
│   │   │   ├── PackageGrid.tsx
│   │   │   ├── PackageFilters.tsx
│   │   │   └── PackageDetails.tsx
│   │   ├── menu/              # Menu components
│   │   │   ├── MenuItemCard.tsx
│   │   │   ├── MenuGrid.tsx
│   │   │   └── MenuFilters.tsx
│   │   ├── cart/              # Cart components
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── PromoCodeInput.tsx
│   │   ├── checkout/          # Checkout components
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Toast.tsx
│   │   └── shared/            # Shared components
│   │       ├── SearchBar.tsx
│   │       ├── Pagination.tsx
│   │       └── Rating.tsx
│   │
│   ├── lib/                   # Utility functions and configs
│   │   ├── api.ts            # API client
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── utils.ts          # General utilities
│   │   ├── constants.ts      # App constants
│   │   ├── validations.ts    # Form validations
│   │   └── db.ts             # Database client
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── usePackages.ts
│   │   ├── useOrders.ts
│   │   └── useDebounce.ts
│   │
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── database.ts
│   │
│   ├── services/             # Business logic services
│   │   ├── packageService.ts
│   │   ├── orderService.ts
│   │   ├── cartService.ts
│   │   └── userService.ts
│   │
│   └── middleware.ts         # Next.js middleware
│
├── supabase/                 # Supabase configuration
│   ├── migrations/           # Database migrations
│   └── seed.sql             # Seed data
│
├── .env.local               # Environment variables
├── .env.example             # Example environment variables
├── .gitignore
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json
└── README.md
```

## Key Directories Explained

### `/src/app`
Next.js App Router directory. Each folder represents a route. Uses route groups `(auth)` and `(main)` for organization without affecting URLs.

### `/src/components`
Organized by feature/page for better maintainability:
- `layout/` - Persistent layout components
- `home/`, `packages/`, etc. - Page-specific components
- `ui/` - Reusable, generic UI components
- `shared/` - Shared business components

### `/src/lib`
Utility functions, configurations, and helpers:
- API clients
- Authentication logic
- Common utilities
- Constants and configurations

### `/src/hooks`
Custom React hooks for reusable stateful logic.

### `/src/context`
React Context providers for global state management.

### `/src/types`
TypeScript type definitions and interfaces.

### `/src/services`
Business logic layer that interacts with APIs and handles data transformations.

## Naming Conventions

### Files
- Components: PascalCase (e.g., `PackageCard.tsx`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Types: camelCase (e.g., `index.ts`)
- Constants: camelCase (e.g., `constants.ts`)

### Components
- Use named exports for components
- One component per file
- Co-locate component-specific types

### Routes
- Use lowercase with hyphens (e.g., `/menu-items`)
- Group related routes with route groups `(groupName)`

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Extract reusable logic into hooks
   - Use composition over inheritance

2. **State Management**
   - Use React Context for global state
   - Keep local state when possible
   - Consider Zustand or Redux for complex state

3. **API Routes**
   - Follow RESTful conventions
   - Use proper HTTP methods
   - Implement error handling

4. **Type Safety**
   - Define types for all data structures
   - Use TypeScript strict mode
   - Avoid `any` type

5. **Performance**
   - Use Next.js Image component
   - Implement lazy loading
   - Optimize bundle size

6. **Code Quality**
   - Follow ESLint rules
   - Write meaningful comments
   - Keep functions pure when possible

## Environment Variables

Required environment variables (add to `.env.local`):

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Payment
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# Storage
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
