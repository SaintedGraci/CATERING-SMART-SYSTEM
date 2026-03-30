# Catering Smart System - User Flow Documentation

## Primary User Flow: Booking Catering Services

### Flow Overview
This document outlines the complete journey a customer takes from discovering the service to completing a catering order.

---

## Flow 1: New Customer - Browse & Book Pre-made Package

### Step 1: Discovery & Landing
**Page:** Home (`/`)
- Customer arrives at homepage
- Views hero section with value proposition
- Sees featured packages
- Reads "How It Works" section

**Actions Available:**
- Click "Browse Packages" CTA
- Click "Customize Your Package" CTA
- Scroll to view featured packages
- Click specific featured package

**Decision Point:** Browse existing packages OR start customizing

---

### Step 2: Browse Packages
**Page:** Packages (`/packages`)
- Customer views all available packages
- Applies filters (event type, budget, guest count)
- Sorts by price/popularity/rating
- Uses search to find specific items

**Actions Available:**
- Click on package card to view details
- Add package to favorites (requires login)
- Use filters and search
- Compare packages

**User Input:**
- Event type selection
- Budget range
- Number of guests
- Dietary preferences

---

### Step 3: View Package Details
**Page:** Package Details (`/packages/[id]`)
- Customer reviews package contents
- Views pricing breakdown
- Checks included items
- Reads reviews and ratings
- Views sample images

**Actions Available:**
- Add to cart (as-is)
- Customize this package
- View similar packages
- Share package
- Save for later (requires login)

**Decision Point:** Order as-is OR customize package

---

### Step 4A: Add to Cart (No Customization)
**Page:** Package Details → Cart
- Customer clicks "Add to Cart"
- Modal appears confirming addition
- Option to continue shopping or checkout

**User Input:**
- Delivery date and time
- Number of guests/servings
- Special instructions (optional)

**Actions Available:**
- Continue shopping
- Proceed to checkout
- View cart

---

### Step 4B: Customize Package
**Page:** Customize (`/customize`)

#### Substep 4B.1: Select Base
- Customer confirms base package selection
- Views customization options overview
- Sees starting price

#### Substep 4B.2: Customize Menu Items
- **Appetizers Section:**
  - View included appetizers
  - Add/remove items
  - Adjust quantities
  - See price changes in real-time

- **Main Courses Section:**
  - View included mains
  - Swap items
  - Add extra options
  - Adjust portions

- **Sides Section:**
  - Select side dishes
  - Adjust quantities

- **Desserts Section:**
  - Choose dessert options
  - Customize servings

- **Beverages Section:**
  - Select drinks
  - Specify quantities

**User Input:**
- Item selections
- Quantity adjustments
- Dietary restrictions
- Allergen information

#### Substep 4B.3: Event Details
- Delivery date and time
- Event location
- Number of guests
- Event type
- Setup requirements

**User Input:**
- Date picker selection
- Time slot selection
- Address input
- Guest count
- Special requests

#### Substep 4B.4: Review Customization
- Summary of all selections
- Final price breakdown
- Estimated delivery time
- Terms and conditions

**Actions Available:**
- Edit any section
- Save customization for later (requires login)
- Add to cart
- Start over

---

### Step 5: Shopping Cart
**Page:** Cart (`/cart`)
- Customer reviews cart contents
- Sees itemized pricing
- Views delivery details

**Actions Available:**
- Adjust quantities
- Remove items
- Apply promo code
- Continue shopping
- Proceed to checkout

**User Input:**
- Promo code (optional)
- Quantity adjustments

**Decision Point:** Continue shopping OR proceed to checkout

---

### Step 6: Checkout Process
**Page:** Checkout (`/checkout`)

#### Substep 6.1: Account Check
**If Not Logged In:**
- Prompt to login or continue as guest
- Option to create account

**If Logged In:**
- Pre-filled customer information
- Saved addresses available

**Actions Available:**
- Login
- Sign up
- Continue as guest

#### Substep 6.2: Customer Information
**User Input:**
- Full name
- Email address
- Phone number
- Company name (optional)

#### Substep 6.3: Delivery Details
**User Input:**
- Delivery address
- Delivery date and time
- Access instructions
- Contact person on-site

**Actions Available:**
- Use saved address (if logged in)
- Add new address
- Save address for future (if logged in)

#### Substep 6.4: Event Information
**User Input:**
- Event type
- Number of guests
- Setup requirements (self-service, full-service, staff needed)
- Special instructions
- Dietary restrictions summary

#### Substep 6.5: Payment Information
**User Input:**
- Payment method selection (credit card, debit, PayPal, etc.)
- Card details
- Billing address

**Actions Available:**
- Use saved payment method (if logged in)
- Add new payment method
- Save payment method (if logged in)

#### Substep 6.6: Order Review
- Complete order summary
- All details displayed
- Final price with taxes and fees
- Terms and conditions checkbox

**Actions Available:**
- Edit any section
- Apply final promo code
- Agree to terms
- Place order

**User Input:**
- Terms acceptance checkbox
- Marketing opt-in (optional)

---

### Step 7: Order Confirmation
**Page:** Order Confirmation (`/order/[id]/confirmation`)
- Order number displayed
- Confirmation email sent
- Order summary shown
- Next steps outlined
- Estimated delivery time

**Actions Available:**
- Download invoice
- Print confirmation
- Add to calendar
- Create account (if guest checkout)
- Return to home
- Browse more packages

**Automatic Actions:**
- Confirmation email sent
- SMS notification (if opted in)
- Calendar invite sent

---

## Flow 2: Returning Customer - Quick Reorder

### Step 1: Login
**Page:** Login (`/login`)
- Customer enters credentials
- Logs into account

---

### Step 2: Access Order History
**Page:** My Account → Order History (`/account/orders`)
- Views past orders
- Sees order status
- Reviews order details

**Actions Available:**
- View order details
- Reorder
- Download invoice
- Leave review

---

### Step 3: Reorder
- Customer clicks "Reorder" on previous order
- System loads previous order into cart
- Option to modify before checkout

**Actions Available:**
- Modify items
- Update delivery details
- Proceed to checkout

---

### Step 4: Quick Checkout
**Page:** Checkout (`/checkout`)
- Pre-filled information from account
- Saved payment methods available
- Faster checkout process

**User Input:**
- Confirm/update delivery date
- Confirm/update guest count
- Select saved payment method

---

### Step 5: Confirmation
- Same as Flow 1, Step 7

---

## Flow 3: Save for Later & Resume

### Step 1: Start Customization
**Page:** Customize (`/customize`)
- Customer begins customizing package
- Makes partial selections

---

### Step 2: Save Progress
- Customer clicks "Save for Later"
- Prompted to login/signup if not logged in
- Customization saved to account

**User Input:**
- Custom name for saved package (optional)

---

### Step 3: Resume Later
**Page:** My Account → Saved Packages (`/account/saved`)
- Customer logs back in
- Views saved customizations
- Clicks on saved package

**Actions Available:**
- Continue editing
- Order as-is
- Delete saved package
- Duplicate and modify

---

### Step 4: Complete Order
- Resumes at customization page with saved selections
- Continues to cart and checkout
- Follows standard checkout flow

---

## Flow 4: Guest Checkout (No Account)

### Simplified Flow:
1. Browse/Customize → Cart → Checkout (as guest)
2. Enter all information manually
3. No saved preferences or history
4. Option to create account after order
5. Confirmation email with order tracking link

**Limitations:**
- No order history access
- No saved addresses or payment methods
- Cannot save customizations
- Must track order via email link

---

## Alternative Entry Points

### Entry Point A: Direct Link to Package
- Customer receives shared package link
- Lands directly on package details page
- Continues from Step 3 of Flow 1

### Entry Point B: Email Campaign
- Customer clicks email promotion
- Lands on specific package or offer page
- Promo code pre-applied
- Continues standard flow

### Entry Point C: Social Media
- Customer clicks social media post
- Lands on gallery or specific package
- Explores and enters main flow

---

## Error Handling & Edge Cases

### Out of Stock Items
- System notifies customer during customization
- Suggests alternatives
- Allows customer to proceed without item or choose substitute

### Unavailable Delivery Date
- Calendar shows available dates only
- If selected date becomes unavailable, customer notified immediately
- Prompted to select alternative date

### Payment Failure
- Customer returned to payment step
- Error message displayed
- Option to try different payment method
- Order held for 15 minutes

### Session Timeout
- Cart saved for 24 hours (guest)
- Cart saved indefinitely (logged in)
- Customer can resume where they left off

---

## Key Decision Points Summary

1. **Browse vs Customize** - Choose pre-made or build custom
2. **Order As-Is vs Modify** - Accept package or customize
3. **Continue Shopping vs Checkout** - Add more or complete order
4. **Login vs Guest** - Create account or quick checkout
5. **Save vs Order Now** - Complete order or save for later

---

## Success Metrics

- Time to complete booking
- Cart abandonment rate at each step
- Customization completion rate
- Guest vs registered user conversion
- Reorder rate
- Average order value

---

## Mobile Considerations

- Simplified navigation
- Sticky "Add to Cart" button
- Collapsible sections in customization
- Mobile-optimized payment forms
- Touch-friendly date/time pickers
- Quick guest checkout option
