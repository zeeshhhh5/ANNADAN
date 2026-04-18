# AnnaDaan Features Guide

This document provides a comprehensive overview of all implemented features, their locations, and which user roles have access to them.

## Table of Contents
- [User Roles & Access Matrix](#user-roles--access-matrix)
- [Core Features](#core-features)
- [QR Code Scanner Implementation](#qr-code-scanner-implementation)
- [Theme System](#theme-system)
- [Profile & Settings](#profile--settings)
- [Dashboard Features by Role](#dashboard-features-by-role)
- [API Routes](#api-routes)
- [Database Operations](#database-operations)

---

## User Roles & Access Matrix

| Feature | DONOR | NGO | COLLECTOR | FARMER | BENEFICIARY | ADMIN |
|---------|-------|-----|-----------|--------|-------------|-------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| QR Scanner | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| QR Generator | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Post Listings | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Place Bids | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Collect Pickups | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| View Stats | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Impact Reports | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Carbon Credits | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Theme Toggle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profile Edit | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## QR Code Scanner Implementation

### Which Roles Have QR Scanner?

| Role | Location | Purpose |
|------|----------|---------|
| **COLLECTOR** | `@/src/components/dashboard/collector-dashboard.tsx` | Scan pickup QR codes to verify and accept pickups |
| **BENEFICIARY** | `@/src/components/dashboard/beneficiary-dashboard.tsx` | Scan food QR codes to verify and receive food |

### QR Scanner Component

**File:** `@/src/components/qr-code.tsx`

**Exports:**
- `QRCodeGenerator` - Generates QR codes for listings, pickups, contacts
- `QRCodeScanner` - Full QR scanner with camera, decoding, and result display
- `QRScannerButton` - Simple button component that opens scanner in modal

**Features:**
- Camera access with back-facing camera preference
- Real-time QR code detection using `jsQR` library
- Scan result display with JSON formatting
- Error handling for camera permissions
- "Scan Again" functionality
- Modal dialog support

**Usage Example:**
```tsx
import { QRScannerButton } from "@/components/qr-code";

<QRScannerButton 
  onScan={(result) => {
    if (result.success) {
      console.log("Scanned data:", result.data);
    }
  }}
/>
```

---

## Theme System

**File:** `@/src/app/(dashboard)/settings/page.tsx`

**Implementation:**
- Dark/Light mode toggle button in settings
- Uses `localStorage` for persistence
- Toggles `dark` class on `document.documentElement`
- Default theme: Dark mode

**How to Use:**
1. Go to Settings page
2. Click "Appearance" card
3. Toggle between Dark/Light mode

---

## Profile & Settings

**Main File:** `@/src/app/(dashboard)/settings/page.tsx`

**Features Implemented:**

### Profile Section
- Avatar upload with preview
- Full name editing
- Phone number field
- Organization name
- Address (street, city, state, pincode)
- Role badge display
- Loading skeleton states
- Refresh button to reload data

### API Integration
- **GET:** `/api/user/profile` - Fetch profile data
- **PUT:** `/api/user/profile` - Update profile

**File:** `@/src/app/api/user/profile/route.ts`

### Notification Preferences
- Email notifications toggle
- Push notifications toggle
- SMS notifications toggle
- Bid notifications
- Status update notifications

### Appearance
- Dark/Light theme toggle
- Persists to localStorage

---

## Dashboard Features by Role

### DONOR Dashboard
**File:** `@/src/components/dashboard/donor-dashboard.tsx`

**Features:**
- Stats cards (Active Listings, Bids, Carbon Credits, Impact)
- Recent listings with status badges
- Quick actions: Post new listing, View impact
- Refresh data button
- API integration with fallback to mock data

### NGO Dashboard
**File:** `@/src/components/dashboard/ngo-dashboard.tsx`

**Features:**
- AI-matched listings
- Active requirements display
- Stats cards
- Quick actions: Post requirement, View matches

### COLLECTOR Dashboard
**File:** `@/src/components/dashboard/collector-dashboard.tsx`

**Features:**
- Available pickups nearby
- Today's stats (pickups, kg collected, portions distributed)
- **QR Scanner for pickup verification**
- Quick actions: Footpath distribution, Waste order, Biogas delivery
- Impact score display
- Biogas partnership banner

### BENEFICIARY Dashboard
**File:** `@/src/components/dashboard/beneficiary-dashboard.tsx`

**Features:**
- Available food listings
- Nearby NGOs with contact info
- Stats cards
- **QR Scanner for food pickup**
- Help banner with helpline

### FARMER Dashboard
**File:** `@/src/components/dashboard/farmer-dashboard.tsx`

**Features:**
- Organic waste listings
- ROI calculator display
- Active compost batches
- Quick actions: View listings, Compost tracker

### ADMIN Dashboard
**File:** `@/src/components/dashboard/admin-dashboard.tsx`

**Features:**
- Platform statistics
- Pending KYC verifications
- Recent carbon trades
- System alerts
- Quick actions: User management, KYC review

---

## API Routes

### User Management
| Route | Method | Description |
|-------|--------|-------------|
| `/api/user/profile` | GET | Fetch user profile |
| `/api/user/profile` | PUT | Update user profile |
| `/api/auth/*` | ALL | NextAuth.js authentication |

### Listings
| Route | Method | Description |
|-------|--------|-------------|
| `/api/listings` | GET | Get all/listings with filters |
| `/api/listings` | POST | Create new listing (DONOR only) |
| `/api/listings/[id]` | GET | Get single listing |
| `/api/listings/[id]` | PUT | Update listing |

### Bids
| Route | Method | Description |
|-------|--------|-------------|
| `/api/bids` | GET | Get bids |
| `/api/bids` | POST | Place bid (NGO only) |
| `/api/bids/[id]/accept` | POST | Accept bid (DONOR only) |
| `/api/bids/[id]/reject` | POST | Reject bid (DONOR only) |

### Stats
| Route | Method | Description |
|-------|--------|-------------|
| `/api/stats` | GET | Get dashboard stats by role |

### Collector
| Route | Method | Description |
|-------|--------|-------------|
| `/api/collector/pickups` | GET | Get assigned pickups |
| `/api/collector/collections` | POST | Log collection |

### NGO
| Route | Method | Description |
|-------|--------|-------------|
| `/api/ngo/requests` | GET | Get NGO food requests |
| `/api/ngo/requests` | POST | Create food request |

### Admin
| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/users` | GET | List all users |
| `/api/admin/users/[id]/kyc` | PUT | Update KYC status |
| `/api/admin/analytics` | GET | Platform analytics |

---

## Database Operations

**Data Store:** `@/src/lib/data-store.ts`

**Storage Type:** In-memory with JSON file persistence
**File Location:** `data/store.json`

### Entities
- Users (with roles, organization, KYC status)
- Food Listings
- Bids
- Collections
- Carbon Credits
- Distributions
- Notifications
- Compost Batches
- Food Requests
- Waste Orders

### Key Functions
- `getUserByEmail(email)` - Fetch user by email
- `updateUser(id, updates)` - Update user data
- `addListing(listing)` - Create new listing
- `getActiveListings()` - Get active listings
- `addBid(bid)` - Place bid
- `saveData()` - Persist to JSON file
- `loadData()` - Load from JSON file

### Stats Functions
- `getDonorStats(donorId)` - Donor dashboard stats
- `getNgoStats(ngoId)` - NGO dashboard stats
- `getCollectorStats(collectorId)` - Collector stats
- `getAdminStats()` - Admin platform stats

---

## Recent Enhancements

### Completed Features
1. ✅ **Settings/Profile Page** - Full profile editing with API integration
2. ✅ **QR Scanner** - Implemented for COLLECTOR and BENEFICIARY roles
3. ✅ **Theme System** - Dark/Light mode toggle with persistence
4. ✅ **Dashboard Components** - Enhanced with loading states and API integration
5. ✅ **Database Operations** - Verified working with JSON persistence
6. ✅ **API Routes** - Profile API fixed and working

---

## Quick Reference: QR Scanner Locations

| Role | Component | File Path |
|------|-----------|-----------|
| COLLECTOR | Dashboard Quick Actions | `src/components/dashboard/collector-dashboard.tsx` |
| BENEFICIARY | Dashboard CTA Banner | `src/components/dashboard/beneficiary-dashboard.tsx` |

**QR Scanner Component:** `src/components/qr-code.tsx`

**Dependencies:**
- `jsqr` - QR code decoding
- `qrcode` - QR code generation
