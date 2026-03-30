# Security Guide - CaterSmart System

## Overview
Comprehensive security recommendations and implementations for production deployment.

---

## 🔴 Critical - Must Implement Before Production

### 1. Environment Variables Security

**Current Risk:** `.env` file might be committed to git

**Fix:**
```bash
# Add to .gitignore (if not already there)
.env
.env.local
.env.*.local
```

**Verify:**
```bash
git status  # Should NOT show .env files
```

**Best Practice:**
- Use different credentials for dev/staging/production
- Store production secrets in Vercel/hosting platform
- Never hardcode secrets in code
- Rotate secrets regularly (every 90 days)

---

### 2. Admin Password Security

**Current Risk:** Default password `admin123` is weak

**Fix Immediately:**
```sql
-- In Supabase Dashboard → Authentication → Users
-- Click on admin user → Reset Password
-- Set strong password: Min 16 chars, mixed case, numbers, symbols
```

**Password Requirements:**
```typescript
// Add to src/lib/validations.ts
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push("Password must be at least 12 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

### 3. Rate Limiting

**Current Risk:** No protection against brute force attacks

**Implementation:**

```typescript
// src/lib/rate-limit.ts
import { createClient } from '@/lib/supabase/server';

const RATE_LIMITS = {
  login: { max: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 min
  api: { max: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 min
};

export async function checkRateLimit(
  identifier: string,
  type: 'login' | 'api'
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = await createClient();
  const limit = RATE_LIMITS[type];
  const now = Date.now();
  const windowStart = now - limit.window;

  // Get recent attempts
  const { data: attempts } = await supabase
    .from('rate_limit_log')
    .select('created_at')
    .eq('identifier', identifier)
    .eq('type', type)
    .gte('created_at', new Date(windowStart).toISOString());

  const attemptCount = attempts?.length || 0;

  if (attemptCount >= limit.max) {
    return { allowed: false, remaining: 0 };
  }

  // Log this attempt
  await supabase.from('rate_limit_log').insert({
    identifier,
    type,
    created_at: new Date().toISOString()
  });

  return { allowed: true, remaining: limit.max - attemptCount - 1 };
}
```

**Database Table:**
```sql
CREATE TABLE rate_limit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL, -- IP or user ID
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rate_limit_identifier ON rate_limit_log(identifier, type, created_at);

-- Auto-cleanup old entries (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_log()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limit_log
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
```

---

### 4. Input Validation & Sanitization

**Current Risk:** No validation on user inputs

**Implementation:**

```typescript
// src/lib/validations.ts
import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email().max(255);

// Phone validation
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]{10,}$/);

// Order validation
export const orderSchema = z.object({
  guestCount: z.number().min(1).max(1000),
  eventDate: z.string().refine((date) => {
    const eventDate = new Date(date);
    const today = new Date();
    return eventDate > today;
  }, "Event date must be in the future"),
  specialInstructions: z.string().max(1000).optional(),
  dietaryRestrictions: z.string().max(500).optional(),
});

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
```

**Install Zod:**
```bash
npm install zod
```

---

### 5. SQL Injection Protection

**Current Risk:** Direct SQL queries could be vulnerable

**Best Practice:**
✅ **Always use Supabase query builder** (parameterized queries)

```typescript
// ❌ NEVER DO THIS (vulnerable to SQL injection)
const { data } = await supabase.rpc('raw_query', {
  query: `SELECT * FROM orders WHERE id = '${orderId}'`
});

// ✅ DO THIS (safe, parameterized)
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('id', orderId)
  .single();
```

---

### 6. CSRF Protection

**Current Risk:** Cross-Site Request Forgery attacks

**Implementation:**

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for CSRF token on state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token');
    const cookieToken = request.cookies.get('csrf-token')?.value;

    if (!csrfToken || csrfToken !== cookieToken) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

---

### 7. Content Security Policy (CSP)

**Current Risk:** XSS attacks through injected scripts

**Implementation:**

```typescript
// src/app/layout.tsx - Add to metadata
export const metadata = {
  // ... other metadata
  other: {
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://*.supabase.co;
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim()
  }
};
```

---

### 8. Session Management

**Current Risk:** Sessions never expire

**Implementation:**

```typescript
// src/lib/auth.ts
export async function refreshSession() {
  const supabase = createClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return null;
  }

  // Check if token is about to expire (within 5 minutes)
  const expiresAt = session.expires_at || 0;
  const now = Math.floor(Date.now() / 1000);
  
  if (expiresAt - now < 300) {
    // Refresh the token
    const { data: { session: newSession } } = await supabase.auth.refreshSession();
    return newSession;
  }

  return session;
}

// Set session timeout in Supabase Dashboard:
// Authentication → Settings → JWT Expiry: 3600 (1 hour)
```

---

### 9. Audit Logging

**Current Risk:** No tracking of admin actions

**Implementation:**

```sql
-- Create audit log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
```

```typescript
// src/lib/audit.ts
export async function logAuditEvent(
  action: string,
  entityType: string,
  entityId: string,
  oldValues?: any,
  newValues?: any
) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  await supabase.from('audit_log').insert({
    user_id: session?.user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_values: oldValues,
    new_values: newValues,
    ip_address: await getClientIP(),
    user_agent: navigator.userAgent
  });
}

// Usage example:
await logAuditEvent('UPDATE', 'package', packageId, oldData, newData);
```

---

### 10. API Route Protection

**Current Risk:** API routes not protected

**Implementation:**

```typescript
// src/lib/auth-middleware.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function requireAuth() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return { session, supabase };
}

export async function requireAdmin() {
  const result = await requireAuth();
  
  if (result instanceof NextResponse) {
    return result;
  }

  const { session, supabase } = result;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  return { session, supabase, profile };
}

// Usage in API routes:
// src/app/api/admin/orders/route.ts
export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  // Admin is authenticated, proceed...
}
```

---

### 11. Data Encryption

**Current Risk:** Sensitive data stored in plain text

**Implementation:**

```typescript
// src/lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Usage: Encrypt sensitive data before storing
const encryptedPhone = encrypt(phoneNumber);
await supabase.from('user_profiles').update({ phone: encryptedPhone });
```

**Add to .env:**
```env
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-64-character-hex-key-here
```

---

### 12. Payment Security

**Current Risk:** Payment data handling

**Best Practices:**

```typescript
// src/lib/payment.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// ✅ NEVER store card numbers
// ✅ Use Stripe tokens/payment methods
export async function createPaymentIntent(amount: number, orderId: string) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: { orderId },
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent.client_secret;
}

// ✅ Verify webhook signatures
export function verifyStripeWebhook(
  payload: string,
  signature: string
): Stripe.Event | null {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed');
    return null;
  }
}
```

**Rules:**
- ❌ Never store credit card numbers
- ❌ Never log payment details
- ✅ Use Stripe Elements for card input
- ✅ Verify webhook signatures
- ✅ Use HTTPS only in production

---

### 13. Row Level Security (RLS) Policies

**Current Risk:** Incomplete RLS policies

**Complete Implementation:**

```sql
-- Enable RLS on ALL tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- User Profiles
CREATE POLICY "Users view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Addresses
CREATE POLICY "Users view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Order Items (inherit from orders)
CREATE POLICY "Users view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Payment Methods
CREATE POLICY "Users view own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users manage own payment methods" ON payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Public tables (no RLS needed)
-- menu_items, packages, categories - publicly readable
```

---

### 14. Email Security

**Current Risk:** Email spoofing, spam

**Implementation:**

```typescript
// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // Validate email
  if (!isValidEmail(to)) {
    throw new Error('Invalid email address');
  }

  // Rate limit emails per user
  // ... implement rate limiting

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
    // Security headers
    headers: {
      'X-Priority': '3',
      'X-Mailer': 'CaterSmart',
    },
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**Email Best Practices:**
- ✅ Use SPF, DKIM, DMARC records
- ✅ Rate limit emails per user
- ✅ Validate email addresses
- ✅ Use email templates (prevent injection)
- ✅ Include unsubscribe links

---

### 15. File Upload Security

**Current Risk:** Malicious file uploads

**Implementation:**

```typescript
// src/lib/upload.ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function validateFile(file: File): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }

  // Check file size
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File too large (max 5MB)' };
  }

  // Check file extension matches MIME type
  const ext = file.name.split('.').pop()?.toLowerCase();
  const mimeExt = file.type.split('/')[1];
  
  if (ext !== mimeExt && !(ext === 'jpg' && mimeExt === 'jpeg')) {
    return { valid: false, error: 'File extension mismatch' };
  }

  return { valid: true };
}

export async function uploadImage(file: File, bucket: string) {
  const validation = await validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const supabase = createClient();
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${file.name.split('.').pop()}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  return data.path;
}
```

---

### 16. API Security Headers

**Implementation:**

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}
```

---

### 17. Sensitive Data Masking

**Implementation:**

```typescript
// src/lib/utils.ts
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  const maskedLocal = local.slice(0, 2) + '***' + local.slice(-1);
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  return phone.replace(/\d(?=\d{4})/g, '*');
}

export function maskCardNumber(cardNumber: string): string {
  return '**** **** **** ' + cardNumber.slice(-4);
}

// Usage in admin dashboard:
console.log(maskEmail('user@example.com')); // us***r@example.com
console.log(maskPhone('+12345678901')); // +1******8901
```

---

### 18. Database Backup Strategy

**Supabase Automatic Backups:**
- Daily backups (retained for 7 days on free tier)
- Point-in-time recovery (paid plans)

**Additional Protection:**
```bash
# Manual backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20240331.sql
```

---

### 19. Error Handling (Don't Leak Info)

**Current Risk:** Detailed errors expose system info

**Implementation:**

```typescript
// src/lib/error-handler.ts
export function handleError(error: any) {
  // Log full error server-side
  console.error('Error:', error);

  // Return sanitized error to client
  if (process.env.NODE_ENV === 'production') {
    return {
      error: 'An error occurred',
      code: 'INTERNAL_ERROR'
    };
  }

  // In development, show more details
  return {
    error: error.message,
    code: error.code || 'UNKNOWN_ERROR'
  };
}

// Usage in API routes:
try {
  // ... your code
} catch (error) {
  return NextResponse.json(handleError(error), { status: 500 });
}
```

---

### 20. Two-Factor Authentication (2FA)

**Implementation:**

```typescript
// src/lib/2fa.ts
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function generate2FASecret(email: string) {
  const secret = speakeasy.generateSecret({
    name: `CaterSmart (${email})`,
    issuer: 'CaterSmart'
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32,
    qrCode
  };
}

export function verify2FAToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2 // Allow 2 time steps (60 seconds)
  });
}
```

**Database:**
```sql
ALTER TABLE user_profiles ADD COLUMN two_factor_secret VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN two_factor_enabled BOOLEAN DEFAULT false;
```

---

## Security Checklist

### Before Production:

- [ ] Change all default passwords
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy
- [ ] Enable audit logging
- [ ] Set up error monitoring (Sentry)
- [ ] Configure session timeouts
- [ ] Enable 2FA for admins
- [ ] Set up database backups
- [ ] Review all RLS policies
- [ ] Validate all user inputs
- [ ] Sanitize all outputs
- [ ] Use environment-specific secrets
- [ ] Enable API route protection
- [ ] Set up WAF (Web Application Firewall)
- [ ] Configure CORS properly
- [ ] Add security headers
- [ ] Encrypt sensitive data
- [ ] Set up monitoring/alerts

### Ongoing:

- [ ] Regular security audits
- [ ] Dependency updates (npm audit)
- [ ] Review access logs
- [ ] Rotate secrets quarterly
- [ ] Monitor for suspicious activity
- [ ] Keep Supabase updated
- [ ] Review and update RLS policies
- [ ] Penetration testing
- [ ] Security training for team

---

## Monitoring & Alerts

### Set Up Alerts For:

1. **Failed login attempts** (>5 in 15 min)
2. **Unusual order patterns** (high value, bulk orders)
3. **Database errors** (connection issues, query failures)
4. **API errors** (500 errors, timeouts)
5. **Payment failures** (declined cards, fraud alerts)
6. **Admin actions** (deletions, bulk updates)

### Tools to Use:

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Supabase Logs** - Database queries
- **Vercel Analytics** - Performance monitoring

---

## Compliance

### GDPR (if serving EU customers):
- [ ] Cookie consent banner
- [ ] Data export functionality
- [ ] Right to be forgotten (delete account)
- [ ] Privacy policy
- [ ] Data processing agreements

### PCI DSS (for payment processing):
- [ ] Use Stripe (PCI compliant)
- [ ] Never store card numbers
- [ ] Use HTTPS only
- [ ] Regular security audits

---

## Quick Wins (Implement Now):

1. **Change admin password** (5 min)
2. **Add .env to .gitignore** (1 min)
3. **Enable RLS on all tables** (10 min)
4. **Add input validation** (30 min)
5. **Set session timeout** (5 min)

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Stripe Security](https://stripe.com/docs/security)

---

**Priority:** 🔴 High - Implement critical items before production
**Effort:** ~2-3 days for complete implementation
**Impact:** Protects user data, prevents attacks, ensures compliance
