# Product Requirements Document: Timber Marketplace

## Executive Summary

**Timber** is a premium marketplace connecting private landowners with hunters seeking quality hunting lease opportunities. The platform facilitates discovery, communication, and booking of private land hunting leases across the United States.

**Version:** 0.1.0
**Last Updated:** 2026-02-13
**Status:** MVP / Prototype

---

## Product Vision

Create a trusted, premium marketplace that makes private land hunting accessible while providing landowners with a streamlined way to monetize their property. The platform emphasizes quality, verification, and transparency in the hunting lease market.

---

## Target Users

### Primary User Personas

#### 1. Landowner
- **Profile**: Property owner with 100+ acres of huntable land
- **Goals**:
  - Generate supplemental income from land
  - Maintain control over property access
  - Connect with responsible hunters
- **Pain Points**:
  - Finding trustworthy hunters
  - Managing bookings and communication
  - Setting appropriate pricing

#### 2. Hunter
- **Profile**: Recreational or serious hunter seeking quality hunting grounds
- **Goals**:
  - Discover quality hunting properties
  - Access diverse game types and locations
  - Secure reliable, verified hunting leases
- **Pain Points**:
  - Limited access to private land
  - Finding properties that match specific needs
  - Verifying property quality and legitimacy

---

## Core Features

### 1. User Authentication & Onboarding

#### Authentication
- Email & Password authentication via Supabase Auth
- OAuth integration (Google)
- Simulation mode for development/demo purposes

#### Signup Flow
1. **Role Selection**: User clicks "Join", prompted to select "Hunter" or "Landowner".
2. **Credentials**: User enters email and creates a password.
3. **Account Creation**: Account created with selected role attached automatically.

#### Login Flow
- Email and Password entry.
- No role selection required (already exists).

**Success Criteria**:
- New users can sign up and select a role in < 2 minutes
- Clear value proposition communicated during onboarding

---

### 2. Property Listings Management

#### Landowner Capabilities
- **Create Listings** with:
  - Title and description
  - Location (city, state)
  - Acreage
  - Daily pricing
  - Available game types (Whitetail Deer, Elk, Turkey, Duck, Goose, Quail, etc.)
  - Permitted sporting arms (Bow, Rifle, Shotgun, Muzzleloader, Crossbow)
  - Property features (Blind Provided, Water Source, Mountainous, etc.)
  - Accommodations (Lodging, Electricity, Well Water, Camping Area, etc.)
  - Multiple property images
  - Geographic coordinates for map display
- **Verification Status**: Properties can be marked as verified (trust badge)
- **Dashboard View**: See all owned listings, booking status, inquiries

**Data Requirements**:
- Persistent storage in Supabase `listings` table
- Row-level security policies ensuring owners can only edit their properties
- Image hosting via URLs (currently using placeholder images)

---

### 3. Search & Discovery

#### Hunter Search Capabilities
- **Text Search**: Search by title, description, location
- **Filters**:
  - Location (city/state)
  - Game types (multi-select)
  - Price range (slider, $0-$1500/day)
  - Acreage range (slider, 0-5000 acres)
  - Sporting arms (multi-select)
  - Accommodations (multi-select)
  - Search radius (miles)
- **View Modes**:
  - **List View**: Grid of listing cards with images, pricing, key details
  - **Map View**: Interactive map with property markers
- **Saved Listings**: Ability to save/favorite listings for later

**Performance Requirements**:
- Search results render in < 500ms
- Filters update results in real-time (client-side filtering)

---

### 4. Listing Details & Inquiry

#### Listing Modal
- Full property details display
- Image gallery with navigation
- Landowner profile card (name, avatar, rating, listing count)
- Property rating and review count
- Available dates and pricing
- "Contact Landowner" button (triggers messaging)
- "Save Listing" functionality

#### Inquiry Flow
1. Hunter views listing details
2. Clicks "Contact Landowner"
3. Redirected to messaging center with pre-populated conversation
4. Can send inquiry directly to landowner

---

### 5. Communication System

#### Messaging Center
- **Conversation Threads**: One thread per listing/landowner pair
- **Real-time Messaging**: Send and receive messages
- **Conversation List**: See all active conversations
- **Participant Info**: Display hunter/landowner names, avatars
- **Listing Context**: Each conversation linked to specific listing

**Technical Implementation**:
- **Database**: Messages stored in Supabase `messages` table
- **Real-time**: Polling implemented for MVP (5s interval); ready for Supabase Realtime subscriptions

---

### 6. Dashboard Experience

#### Landowner Dashboard
- View all property listings
- Add new property (opens modal)
- See booking inquiries
- Request property verification
- Navigate back to marketplace

#### Hunter Dashboard
- View saved listings
- See booking history (future)
- Upgrade to membership (premium features)
- Navigate back to marketplace

---

### 7. Membership & Payments

#### Hunter Membership Tiers
- **Free**: Browse listings, limited inquiries
- **Premium Member**: Unlimited inquiries, priority support, early access to new listings

#### Payment Modal
- Simulated Stripe-style checkout
- Captures payment intent
- Updates user membership status
- Success confirmation

**Future Integration**:
- Real Stripe payment processing
- Recurring subscription management
- Payout system for landowners

---

### 8. Simulation Mode

#### Development/Demo Features
- **Toggle Simulation**: Connection manager badge in bottom-left
- **Local Storage Persistence**: User data and listings saved locally
- **Mock Data**: Seeded with sample listings
- **Supabase Detection**: Automatically switches to simulation if keys missing
- **Forced Simulation**: Can manually toggle even when keys present

**Purpose**: Enables development, testing, and demo without backend dependencies

---

### 9. Admin Portal & Business Management

#### Admin Role
- **Super Admin**: Full access to all platform features and data
- **Business Manager**: Can view analytics, manage listings, communicate with users
- **Support Staff**: Limited access for customer support tasks

#### Business Dashboard
- **Revenue Metrics**:
  - Total revenue (daily, weekly, monthly, yearly)
  - Revenue by property
  - Revenue trends and projections
  - Commission tracking
- **Booking Analytics**:
  - Total bookings count
  - Booking status breakdown (pending, confirmed, completed, cancelled)
  - Booking trends over time
  - Popular properties and game types
  - Average booking duration and value
- **User Statistics**:
  - Total users (hunters, landowners, admins)
  - New user signups over time
  - User engagement metrics
  - Active vs. inactive users

#### Listing Management (Admin Privileges)
- **View All Listings**: Access to all properties regardless of owner
- **Create Listings**: Add properties on behalf of landowners
- **Update Listings**: Modify any listing (title, description, pricing, features)
- **Delete Listings**: Remove inappropriate or inactive properties
- **Verify Properties**: Mark listings as verified with trust badge
- **Bulk Operations**: Mass update or delete multiple listings

#### Communication Management
- **View All Messages**: Access to all conversations between users
- **Intervene in Conversations**: Admin can send messages in any thread
- **User Support**: Respond to user inquiries and resolve disputes
- **Broadcast Messages**: Send announcements to all users or specific segments
- **Moderation Tools**: Flag inappropriate content, warn or ban users

#### Financial Operations
- **Payout Management**: Process landowner payouts
- **Transaction History**: View all platform transactions
- **Refund Processing**: Issue refunds for cancelled bookings
- **Commission Adjustment**: Override platform fees for special cases

#### Admin-Specific UI/UX
- **Separate Admin Dashboard**: Dedicated interface for admin functions
- **Data Visualizations**: Charts and graphs for metrics
- **Search & Filter**: Powerful tools to find specific listings or users
- **Audit Logs**: Track all admin actions for accountability
- **Quick Actions**: Shortcuts for common admin tasks

**Security Requirements**:
- Admin role stored in Supabase Auth user metadata
- Database-level RLS policies for admin-only operations
- Admin actions logged for audit trail
- Two-factor authentication required for admin accounts
- IP restrictions for admin access (optional)

**Success Criteria**:
- Admins can view key business metrics in < 5 seconds
- Listing management operations complete in < 3 seconds
- All admin actions are logged and auditable
- Non-admin users cannot access admin-only features

---

## Technical Architecture

### Frontend Stack
- **Framework**: React 19
- **Language**: TypeScript
- **Routing**: React Router DOM 6
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: React hooks (useState, useMemo, useEffect)

### Backend Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (future for images)
- **Real-time**: Supabase Subscriptions (future for messaging)

### Data Models

#### Listing
```typescript
{
  id: string
  title: string
  location: string
  pricePerDay: number
  description: string
  gameTypes: string[]
  sportingArms: string[]
  acreage: number
  features: string[]
  accommodations: string[]
  images: string[]
  landowner: Landowner
  rating: number
  reviews: number
  isVerified: boolean
  coordinates: { lat: number, lng: number }
}
```

#### User
```typescript
{
  id: string
  name: string
  email: string
  role: 'landowner' | 'hunter' | 'admin' | null
  isMember: boolean  // Only relevant for hunters
  isAdmin: boolean   // Quick check for admin privileges
}
```

### Database Schema

#### `listings` Table
```sql
- id: UUID (PK)
- created_at: TIMESTAMPTZ
- title: TEXT
- location: TEXT
- price_per_day: INTEGER
- description: TEXT
- game_types: TEXT[]
- sporting_arms: TEXT[]
- acreage: INTEGER
- features: TEXT[]
- accommodations: TEXT[]
- images: TEXT[]
- is_verified: BOOLEAN
- coordinates: JSONB
- landowner_id: UUID (FK to auth.users)
```

#### Row-Level Security Policies
- Public read access to all listings
- Authenticated users can create listings (must own)
- Users can only update their own listings

---

## Scaling & Optimization

To transition from MVP to a production-ready scale, the following technical improvements are prioritized:

### 1. Frontend Architecture
- **Refactor Monolith**: Deconstruct `App.tsx` by extracting the Marketplace view, Dashboard, and Messaging into dedicated page components.
- **State Management**: Move global state out of the root component into React Context providers or a lightweight state manager (e.g., Zustand) to prevent unnecessary re-renders.

### 2. Data Performance
- **Server-Side Filtering**: Migrate search and filter logic from client-side JavaScript to Supabase SQL queries. This is critical for supporting 10,000+ listings without browser performance degradation.
- **Data Fetching**: Replace manual `useEffect` hooks with **TanStack Query (React Query)** for robust caching, automatic background refetching, and better loading state management.

### 3. Real-time Efficiency
- **Event-Driven Updates**: Replace `setInterval` polling for messages with **Supabase Realtime** subscriptions (WebSockets). This reduces unnecessary network requests and improves battery life for mobile users.

### 4. Code Quality
- **Strict Typing**: Eliminate usage of `any` types in service layers to ensure type safety across the full stack, especially when mapping database responses to UI components.

---

## User Flows

### Landowner Flow: List a Property
1. Sign up / Log in
2. Select "Landowner" role during onboarding
3. Navigate to dashboard
4. Click "Add Property"
5. Fill out listing form (title, location, price, details)
6. Upload images
7. Submit listing
8. Listing appears in dashboard and marketplace

### Hunter Flow: Find and Inquire
1. Sign up / Log in
2. Select "Hunter" role during onboarding
3. Browse marketplace listings
4. Apply filters (location, game type, price)
5. Click listing card to view details
6. Save listing or contact landowner
7. Send inquiry via messaging center
8. Await response from landowner

### Inquiry to Booking (Future)
1. Hunter and landowner negotiate via messaging
2. Hunter selects dates
3. Hunter pays deposit
4. Landowner confirms booking
5. Both parties receive confirmation
6. Post-hunt: Leave reviews

---

## Design Principles

### Visual Identity
- **Color Palette**:
  - Primary: Emerald 900 (forest green)
  - Neutral: Stone 50-900
  - Accent: Amber (for warnings/simulation mode)
- **Typography**:
  - Headings: Serif font family
  - Body: Sans-serif font family
- **Imagery**: Nature-focused, high-quality property photos

### UX Principles
- **Trust & Transparency**: Verification badges, ratings, reviews
- **Simplicity**: Clean layouts, minimal cognitive load
- **Premium Feel**: High-quality imagery, subtle animations, refined UI
- **Accessibility**: High contrast, readable fonts, semantic HTML

---

## Success Metrics (Future)

### Engagement Metrics
- Monthly Active Users (MAU)
- Listings created per month
- Inquiries sent per listing
- Conversion rate (inquiry → booking)

### Business Metrics
- Revenue per booking
- Landowner retention rate
- Hunter membership conversion rate
- Average booking value

### Quality Metrics
- Listing verification rate
- Average property rating
- Response time to inquiries
- Support ticket volume

---

## Roadmap & Future Enhancements

### Phase 1 (Current - MVP)
- [x] Basic listing creation and browsing
- [x] User authentication and role-based onboarding
- [x] Search and filtering
- [x] Map view
- [x] Messaging foundation
- [x] Client-side routing (React Router)
- [x] Persistent messaging (Supabase tables)
- [ ] Admin portal & business management

### Phase 2 (Near-term)
- [ ] Real payment integration (Stripe)
- [ ] Google OAuth Integration
- [ ] Booking calendar system
- [ ] Date availability management
- [ ] Review and rating system
- [ ] Email notifications
- [ ] Image upload to Supabase Storage
- [ ] Advanced search (radius-based geospatial queries)

### Phase 3 (Mid-term)
- [ ] Mobile app (React Native)
- [ ] Landowner payout system
- [ ] Insurance/liability integration
- [ ] Background checks for hunters
- [ ] Property verification service
- [ ] Automated pricing suggestions (AI)

### Phase 4 (Long-term)
- [ ] AI Concierge (chatbot for recommendations)
- [ ] Dynamic pricing based on demand
- [ ] Multi-property packages
- [ ] Corporate/group bookings
- [ ] Marketplace for hunting gear
- [ ] Social features (hunter profiles, leaderboards)

---

## Security & Compliance

### Data Protection
- User authentication via Supabase Auth (industry-standard)
- Row-level security on all database tables
- HTTPS-only communication
- Environment variables for sensitive keys

### Legal Considerations
- Terms of Service (required)
- Privacy Policy (required)
- Liability waivers for hunters and landowners
- State-specific hunting regulations (informational)
- Insurance requirements (future)

### Content Moderation
- Listing approval process (manual or automated)
- User reporting system
- Fraudulent listing detection
- Review authenticity verification

---

## Open Questions & Risks

### Technical Risks
- **Scalability**: How will filtering perform with 10,000+ listings?
- **Image Hosting**: Need robust CDN solution for property images
- **Real-time Messaging**: Supabase real-time subscriptions may hit limits at scale

### Product Risks
- **Supply-Side**: Will enough landowners list properties?
- **Demand-Side**: Is there sufficient hunter interest?
- **Trust & Safety**: How to prevent fraud and ensure quality?
- **Regulatory**: Do we need licenses/permits to operate in certain states?

### Business Risks
- **Competition**: Existing hunting lease platforms (OnX, HuntStand, etc.)
- **Seasonality**: Hunting is seasonal; how to maintain engagement year-round?
- **Monetization**: What's the optimal pricing model (commission vs. subscription)?

---

## Appendix

### Game Types Supported
Whitetail Deer, Mule Deer, Elk, Turkey, Duck, Goose, Quail, Pheasant, Hog

### Sporting Arms Categories
Bow, Rifle, Shotgun, Muzzleloader, Crossbow

### Accommodations Options
Lodging, Well Water, Outhouse, Electricity, Camping Area

### Property Features
Blind Provided, Water Source, Dog Kennels, Vehicle Access, Pit Blinds, Decoys Included, Boat Access, Mountainous, Primitive Camping, Pack-in Only

---

## Document Control

**Maintained By**: Product Team
**Review Frequency**: Quarterly or as needed
**Approval**: Product Owner, Engineering Lead

This PRD serves as the single source of truth for Timber Marketplace features and priorities. All development work should reference this document to ensure alignment with product vision and user needs.
