# System Architecture - How Everything Works Together

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js App)                            │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Login Page   │  │  Dashboard   │  │  Admin Pages │             │
│  │              │  │              │  │              │             │
│  │ - Email      │  │ - Stats      │  │ - Orders     │             │
│  │ - Password   │  │ - Actions    │  │ - Packages   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│         │                  │                  │                      │
│         └──────────────────┴──────────────────┘                     │
│                            │                                         │
│                            ▼                                         │
│                  ┌──────────────────┐                               │
│                  │ Supabase Client  │                               │
│                  │ (JWT Manager)    │                               │
│                  └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTPS + JWT Token
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                                │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    AUTH SERVICE                             │    │
│  │                                                             │    │
│  │  1. Validate Credentials                                   │    │
│  │  2. Generate JWT Token                                     │    │
│  │  3. Store in httpOnly Cookie                               │    │
│  │  4. Manage Session                                         │    │
│  │  5. Refresh Tokens                                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                  │                                   │
│                                  ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                  POSTGRESQL DATABASE                        │    │
│  │                                                             │    │
│  │  ┌──────────────┐         ┌──────────────────┐            │    │
│  │  │  auth.users  │────────▶│  user_profiles   │            │    │
│  │  │  (Managed)   │  1:1    │  (Custom)        │            │    │
│  │  └──────────────┘         └──────────────────┘            │    │
│  │                                     │                       │    │
│  │                                     │ 1:Many                │    │
│  │                    ┌────────────────┼────────────────┐     │    │
│  │                    │                │                │     │    │
│  │                    ▼                ▼                ▼     │    │
│  │            ┌──────────┐    ┌──────────┐    ┌──────────┐  │    │
│  │            │addresses │    │  orders  │    │ payments │  │    │
│  │            └──────────┘    └──────────┘    └──────────┘  │    │
│  │                                   │                        │    │
│  │                                   │ 1:Many                 │    │
│  │                                   ▼                        │    │
│  │                            ┌──────────────┐               │    │
│  │                            │ order_items  │               │    │
│  │                            └──────────────┘               │    │
│  │                                                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                  │                                   │
│                                  ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              ROW LEVEL SECURITY (RLS)                       │    │
│  │                                                             │    │
│  │  - Checks JWT token                                        │    │
│  │  - Verifies user permissions                               │    │
│  │  - Filters data based on policies                          │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## JWT Token Flow

### 1. Login Process

```
User enters credentials
        │
        ▼
┌─────────────────────┐
│  Admin Login Page   │
│  /admin/login       │
└─────────────────────┘
        │
        │ supabase.auth.signInWithPassword()
        ▼
┌─────────────────────┐
│  Supabase Auth API  │
│  - Validates email  │
│  - Checks password  │
│  - Generates JWT    │
└─────────────────────┘
        │
        │ Returns JWT + Session
        ▼
┌─────────────────────┐
│  Browser Cookie     │
│  sb-xxx-auth-token  │
│  (httpOnly)         │
└─────────────────────┘
        │
        │ Redirect
        ▼
┌─────────────────────┐
│  Admin Dashboard    │
│  /admin/dashboard   │
└─────────────────────┘
```

### 2. Protected Page Access

```
User visits /admin/dashboard
        │
        ▼
┌─────────────────────┐
│  Dashboard Page     │
│  useEffect()        │
└─────────────────────┘
        │
        │ supabase.auth.getSession()
        ▼
┌─────────────────────┐
│  Read JWT Cookie    │
│  Verify Signature   │
│  Check Expiration   │
└─────────────────────┘
        │
        ├─ Valid? ──────────┐
        │                   │
        ▼ No                ▼ Yes
┌─────────────┐    ┌─────────────────┐
│ Redirect to │    │ Query Database  │
│   /login    │    │ Check role      │
└─────────────┘    └─────────────────┘
                            │
                            ├─ Admin? ────┐
                            │              │
                            ▼ No           ▼ Yes
                    ┌─────────────┐  ┌──────────┐
                    │ Sign Out    │  │  Allow   │
                    │ Redirect    │  │  Access  │
                    └─────────────┘  └──────────┘
```

### 3. Database Query with JWT

```
Frontend makes query
        │
        ▼
┌─────────────────────────────────┐
│  supabase.from('orders')        │
│    .select('*')                 │
└─────────────────────────────────┘
        │
        │ Automatically includes JWT in header:
        │ Authorization: Bearer eyJhbGc...
        ▼
┌─────────────────────────────────┐
│  Supabase API                   │
│  - Extracts JWT                 │
│  - Verifies signature           │
│  - Gets user ID from JWT        │
└─────────────────────────────────┘
        │
        │ auth.uid() = user-uuid
        ▼
┌─────────────────────────────────┐
│  Row Level Security             │
│  - Applies policies             │
│  - Filters data                 │
│  - Returns only allowed rows    │
└─────────────────────────────────┘
        │
        │ Filtered results
        ▼
┌─────────────────────────────────┐
│  Frontend receives data         │
└─────────────────────────────────┘
```

---

## Data Flow Examples

### Example 1: Customer Places Order

```
1. Customer (JWT: user-123) creates order
   ↓
2. Frontend: supabase.from('orders').insert({
     user_id: 'user-123',
     total: 500,
     ...
   })
   ↓
3. Supabase extracts JWT → auth.uid() = 'user-123'
   ↓
4. RLS Policy checks: auth.uid() = user_id ✅
   ↓
5. Order created in database
   ↓
6. Order items created (references order_id)
   ↓
7. Payment processed
   ↓
8. Email confirmation sent
```

### Example 2: Admin Views All Orders

```
1. Admin (JWT: admin-456, role: admin) queries orders
   ↓
2. Frontend: supabase.from('orders').select('*')
   ↓
3. Supabase extracts JWT → auth.uid() = 'admin-456'
   ↓
4. RLS Policy checks:
   - Is user_id = 'admin-456'? ❌
   - Is user role = 'admin'? ✅
   ↓
5. Returns ALL orders (admin privilege)
   ↓
6. Admin sees all customer orders
```

### Example 3: Customer Tries to View Another's Order

```
1. Customer (JWT: user-123) tries to access order-999
   ↓
2. Frontend: supabase.from('orders')
     .select('*')
     .eq('id', 'order-999')
   ↓
3. Supabase extracts JWT → auth.uid() = 'user-123'
   ↓
4. RLS Policy checks: auth.uid() = user_id
   ↓
5. order-999.user_id = 'user-789' ❌
   ↓
6. Returns empty result (blocked by RLS)
   ↓
7. Customer cannot see other's order ✅
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: HTTPS/TLS                     │  ← Encrypted transport
├─────────────────────────────────────────┤
│  Layer 2: JWT Authentication            │  ← Who are you?
├─────────────────────────────────────────┤
│  Layer 3: Role-Based Access (RBAC)      │  ← What can you do?
├─────────────────────────────────────────┤
│  Layer 4: Row Level Security (RLS)      │  ← What can you see?
├─────────────────────────────────────────┤
│  Layer 5: Input Validation              │  ← Is data safe?
├─────────────────────────────────────────┤
│  Layer 6: Output Sanitization           │  ← Prevent XSS
├─────────────────────────────────────────┤
│  Layer 7: Rate Limiting                 │  ← Prevent abuse
├─────────────────────────────────────────┤
│  Layer 8: Audit Logging                 │  ← Track everything
└─────────────────────────────────────────┘
```

---

## File Structure for Security

```
src/
├── lib/
│   ├── auth.ts              # Authentication helpers
│   ├── auth-middleware.ts   # API route protection
│   ├── rate-limit.ts        # Rate limiting
│   ├── validations.ts       # Input validation
│   ├── encryption.ts        # Data encryption
│   ├── audit.ts             # Audit logging
│   ├── error-handler.ts     # Safe error handling
│   └── supabase/
│       ├── client.ts        # Browser client
│       └── server.ts        # Server client
│
├── middleware.ts            # Next.js middleware (CSRF, headers)
│
└── app/
    └── api/
        └── admin/
            └── [...]/
                └── route.ts # Protected with requireAdmin()
```

---

## Summary

### What Protects Your System:

1. **JWT Tokens** - Secure, signed, expiring tokens
2. **httpOnly Cookies** - JavaScript can't access them
3. **Row Level Security** - Database-level protection
4. **Role-Based Access** - Admin vs Customer permissions
5. **Input Validation** - Prevent malicious data
6. **Rate Limiting** - Prevent brute force
7. **Audit Logging** - Track all actions
8. **Encryption** - Protect sensitive data

### Current Security Status:

✅ JWT authentication implemented
✅ Supabase Auth integration
✅ Basic RLS policies
⚠️ Need to add rate limiting
⚠️ Need to add input validation
⚠️ Need to change default password
⚠️ Need to add audit logging

---

**Next Priority:** Implement rate limiting and input validation
**Time to Secure:** ~1-2 days for production-ready security
