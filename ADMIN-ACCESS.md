# Admin Access Guide

## Admin Login

The admin panel is accessible at a hidden URL that is not exposed in the main navigation.

### Access URL
```
http://localhost:3001/admin/login
```

### Development Credentials
```
Email: admin@catersmart.com
Password: admin123
```

## Admin Routes

Once logged in, you can access:

- **Dashboard:** `/admin/dashboard`
  - Overview statistics
  - Recent orders
  - Quick actions

- **Orders Management:** `/admin/orders`
  - View all orders
  - Update order status
  - Manage deliveries

- **Packages Management:** `/admin/packages`
  - Create/edit packages
  - Set pricing
  - Manage availability

- **Menu Management:** `/admin/menu`
  - Add/edit menu items
  - Update pricing
  - Manage inventory

## Security Notes

### Current Implementation (Development)
- Uses localStorage for session management
- Hardcoded credentials for testing
- No encryption on credentials

### Production Requirements
⚠️ **IMPORTANT:** Before deploying to production, implement:

1. **Proper Authentication**
   - Use NextAuth.js or similar
   - JWT tokens with secure httpOnly cookies
   - Password hashing (bcrypt/argon2)

2. **Database Integration**
   - Store admin users in database
   - Implement role-based access control (RBAC)
   - Add audit logging

3. **Security Measures**
   - Rate limiting on login attempts
   - Two-factor authentication (2FA)
   - Session timeout
   - CSRF protection
   - IP whitelisting (optional)

4. **Environment Variables**
   ```env
   ADMIN_JWT_SECRET=your-secure-secret
   ADMIN_SESSION_TIMEOUT=3600
   ENABLE_2FA=true
   ```

## Features

### Dashboard
- Real-time statistics
- Revenue tracking
- Order status overview
- Quick action buttons

### Authentication Flow
1. User visits `/admin/login`
2. Enters credentials
3. System validates (currently hardcoded)
4. On success: redirects to `/admin/dashboard`
5. On failure: shows error message
6. Session stored in localStorage

### Protected Routes
All admin routes check for authentication:
- If not authenticated → redirect to `/admin/login`
- If authenticated → show admin content

## Logout
Click the "Logout" button in the header to:
- Clear localStorage
- Redirect to login page

## Future Enhancements

- [ ] Database-backed authentication
- [ ] Role-based permissions (admin, staff, manager)
- [ ] Activity logging
- [ ] Email notifications for admin actions
- [ ] Multi-factor authentication
- [ ] Password reset functionality
- [ ] Admin user management
- [ ] API key management
- [ ] Webhook configuration
- [ ] System settings panel

## Development Tips

### Testing Different Users
To test different admin roles (future):
```javascript
// In browser console
localStorage.setItem('adminAuth', 'true');
localStorage.setItem('adminEmail', 'test@admin.com');
localStorage.setItem('adminRole', 'manager');
```

### Clear Session
```javascript
// In browser console
localStorage.clear();
```

### Check Current Session
```javascript
// In browser console
console.log({
  auth: localStorage.getItem('adminAuth'),
  email: localStorage.getItem('adminEmail')
});
```

## API Integration (Future)

When implementing backend authentication:

```typescript
// Example API route: /api/admin/login
export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Validate credentials against database
  const admin = await db.admin.findUnique({ where: { email } });
  
  if (!admin || !await bcrypt.compare(password, admin.passwordHash)) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return Response.json({ token, admin });
}
```

## Troubleshooting

### Can't Access Admin Panel
1. Make sure dev server is running
2. Navigate to: `http://localhost:3001/admin/login`
3. Use correct credentials

### Stuck on Login Page
1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Refresh page and try again

### Redirected to Login After Login
1. Check if localStorage is enabled in browser
2. Try incognito/private mode
3. Check browser console for errors

---

**Note:** This is a development implementation. Always implement proper security measures before deploying to production.
