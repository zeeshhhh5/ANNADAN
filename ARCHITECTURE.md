# AnnaDaan Platform Architecture

## System Overview
AnnaDaan is a food waste redistribution platform connecting donors, NGOs, collectors, and beneficiaries.

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui

### Backend
- Next.js API Routes
- In-Memory Data Store (for speed)
- JWT Authentication (NextAuth v5)

### Data Storage
- In-Memory HashMap (O(1) operations)
- Future: MongoDB for persistence

---

## User Roles & Permissions

| Role | Description | Key Features |
|------|-------------|--------------|
| **ADMIN** | Platform management | User management, KYC verification, Analytics, System settings |
| **DONOR** | Food donors | Create listings, manage bids, track impact, carbon credits |
| **NGO** | Food distributors | Browse listings, place requests, manage distributions, track beneficiaries |
| **COLLECTOR** | Logistics & composting | Manage pickups, waste processing, composting, earnings |
| **BENEFICIARY** | Food recipients | Find food, request assistance, track distributions |

---

## Feature Map by Dashboard

### 1. Admin Dashboard
```
/users
  - GET    - List all users with filters (role, status, date range)
  - POST   - Create new user
  - GET /:id - Get user details
  - PUT /:id - Update user
  - DELETE /:id - Deactivate user

/kyc
  - GET    - List pending KYC requests
  - POST /:id/approve - Approve KYC
  - POST /:id/reject - Reject KYC

/listings
  - GET    - All listings across platform
  - DELETE /:id - Remove listing

/collections
  - GET    - All collections
  - PUT /:id - Update collection status

/carbon
  - GET    - Carbon credits overview
  - POST /trade - Record carbon credit trade

/analytics
  - GET /stats - Platform statistics
  - GET /impact - Environmental impact metrics
  - GET /trends - Usage trends over time
```

### 2. Donor Dashboard
```
/listings
  - GET    - My listings
  - POST   - Create new listing
  - GET /:id - Get listing details
  - PUT /:id - Update listing
  - DELETE /:id - Cancel listing
  - POST /:id/expire - Mark as expired

/bids
  - GET    - Received bids on my listings
  - POST /:id/accept - Accept a bid
  - POST /:id/reject - Reject a bid

/carbon
  - GET    - My carbon credits
  - GET /history - Carbon credit history
  - GET /certificates - Tax certificates

/impact
  - GET    - My impact metrics
  - GET /history - Historical impact data
```

### 3. NGO Dashboard
```
/listings
  - GET    - Browse available food listings
  - GET /:id - Get listing details

/requests
  - GET    - My food requests
  - POST   - Create new request
  - PUT /:id - Update request
  - DELETE /:id - Cancel request

/distributions
  - GET    - Distribution records
  - POST   - Record new distribution
  - PUT /:id - Update distribution

/beneficiaries
  - GET    - Manage beneficiaries
  - POST   - Add beneficiary
  - PUT /:id - Update beneficiary
  - DELETE /:id - Remove beneficiary

/impact
  - GET    - NGO impact metrics
  - GET /reports - Distribution reports
```

### 4. Collector Dashboard
```
/pickups
  - GET    - Available pickups
  - POST /:id/claim - Claim a pickup
  - PUT /:id/schedule - Schedule pickup time
  - PUT /:id/complete - Mark pickup complete

/collections
  - GET    - My collections
  - POST   - Create collection record
  - PUT /:id - Update collection

/waste
  - GET    - Waste inventory
  - POST   - Add waste batch
  - PUT /:id - Update waste

/compost
  - GET    - Composting batches
  - POST   - Start new batch
  - PUT /:id - Update batch status

/earnings
  - GET    - Earnings overview
  - GET /history - Earnings history
  - POST /withdraw - Request withdrawal
```

### 5. Beneficiary Dashboard
```
/search
  - GET    - Search available food
  - GET /nearby - Food nearby

/requests
  - GET    - My requests
  - POST   - Create request
  - DELETE /:id - Cancel request

/ngos
  - GET    - Nearby NGOs
  - GET /:id - NGO details

/history
  - GET    - Distribution history
```

---

## Data Models

### User
```typescript
{
  id: string
  name: string
  email: string
  password: string (hashed)
  phone?: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  organization?: {
    name: string
    type: string
    address: string
    city: string
    state: string
    pincode: string
  }
  kycStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'
  kycDocuments?: string[]
  createdAt: Date
  updatedAt: Date
}
```

### FoodListing
```typescript
{
  id: string
  donorId: string
  title: string
  description?: string
  category: FoodCategory
  quantityKg: number
  servings?: number
  preparedAt: Date
  bestBefore: Date
  canFreeze: boolean
  isVegetarian: boolean
  allergens: string[]
  cuisineType?: string
  images: string[]
  address: string
  lat: number
  lng: number
  pickupInstructions?: string
  status: ListingStatus
  assignedTo?: string (collectorId)
  carbonCredits?: number
  createdAt: Date
  updatedAt: Date
}
```

### Bid
```typescript
{
  id: string
  listingId: string
  bidderId: string
  bidAmount?: number
  message?: string
  status: BidStatus
  isUrgent: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Collection
```typescript
{
  id: string
  listingId: string
  collectorId: string
  ngoId?: string
  scheduledAt: Date
  pickedUpAt?: Date
  completedAt?: Date
  status: CollectionStatus
  totalKgCollected?: number
  edibleKg?: number
  wasteKg?: number
  qualityNotes?: string
  photos: string[]
  createdAt: Date
  updatedAt: Date
}
```

### CarbonCredit
```typescript
{
  id: string
  userId: string
  listingId: string
  credits: number
  kgDiverted: number
  co2Saved: number
  status: 'PENDING' | 'VERIFIED' | 'TRADED'
  tradedAt?: Date
  price?: number
  createdAt: Date
}
```

### Distribution
```typescript
{
  id: string
  ngoId: string
  listingId: string
  beneficiaryIds: string[]
  distributedAt: Date
  mealsProvided: number
  notes?: string
  photos: string[]
  createdAt: Date
}
```

### CompostBatch
```typescript
{
  id: string
  collectorId: string
  wasteKg: number
  startDate: Date
  endDate?: Date
  status: 'ACTIVE' | 'COMPLETED'
  compostKg?: number
  earnings?: number
  createdAt: Date
}
```

---

## API Response Format

### Success Response
```typescript
{
  success: true
  data: T
  message?: string
}
```

### Error Response
```typescript
{
  success: false
  error: string
  code?: string
  details?: unknown
}
```

---

## Authentication Flow

1. **Login**: POST /api/auth/callback/credentials
2. **Session**: GET /api/auth/session
3. **Logout**: POST /api/auth/signout

## Security
- JWT tokens for session management
- Password hashing with bcrypt (cost: 10)
- Role-based access control (RBAC)
- Input validation on all endpoints
