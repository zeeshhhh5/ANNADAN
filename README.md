# AnnaDaan - Food Waste Redistribution Platform

A production-grade, multi-stakeholder platform built on Next.js 14 + Prisma + PostgreSQL that connects food donors, NGOs, waste collectors, farmers, and beneficiaries into one intelligent ecosystem with real-time bidding, shelf-life tracking, and a carbon credit marketplace.

## 🌟 Features

### For Food Donors (Hotels/Restaurants/Events)
- Post food listings with automatic shelf-life calculation
- Free decomposition service (save on disposal costs)
- Earn carbon credits for every kg diverted
- Auto-generated tax deduction certificates (80G/CSR)
- AI-powered food classification via image upload

### For NGOs
- Post food requirements with urgency levels
- AI-powered matching with donor listings
- NGO-to-NGO network for surplus sharing
- Beneficiary management and meal tracking
- Impact analytics dashboard

### For Waste Collectors
- Map-based pickup assignments with route optimization
- Footpath distribution logging with location proof
- Sort food: edible → redistribute, organic → biogas/farmers
- Gamified impact scoring and leaderboard

### For Farmers
- Organic waste marketplace with bidding
- ROI calculator (organic vs chemical fertilizers)
- Compost batch tracking
- Sustainability impact reports

### For Beneficiaries
- Mobile-first food search
- Connect with nearby NGOs
- Request food assistance

### For Admin
- KYC verification queue
- Carbon credit minting and marketplace
- Platform analytics and geo heatmaps
- Revenue dashboard

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | NextAuth.js v5 |
| AI | OpenAI GPT-4o |
| File Storage | Cloudinary |
| Payments | Stripe |
| Email | Resend |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Supabase)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd annadan
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Configure your `.env` file with the following:

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@localhost:5432/annadan"

# NextAuth (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-key"

# Google OAuth (Optional - for Google Sign In)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# OpenAI (Required for AI features)
OPENAI_API_KEY=""

# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Stripe (Required for payments)
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

# Google Maps (Required for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""
```

5. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
/src
  /app
    /(auth)           → Login, Register pages
    /(dashboard)      → Role-specific dashboards
      /dashboard      → Main dashboard (role-based)
      /donor          → Donor-specific pages
      /ngo            → NGO-specific pages
      /collector      → Collector-specific pages
      /farmer         → Farmer-specific pages
      /beneficiary    → Beneficiary-specific pages
      /admin          → Admin panel
    /api              → API routes
      /auth           → Authentication endpoints
      /listings       → Food listing CRUD
      /bids           → Bidding system
      /carbon         → Carbon credit management
  /components
    /ui               → shadcn/ui components
    /dashboard        → Dashboard components
    /shared           → Reusable components
  /lib
    /prisma.ts        → Prisma client
    /auth.ts          → NextAuth configuration
    /ai.ts            → OpenAI helpers
    /shelf-life.ts    → Shelf-life calculation engine
    /carbon.ts        → Carbon credit calculations
    /validations.ts   → Zod schemas
  /types              → TypeScript types
/prisma
  /schema.prisma      → Database schema
```

## 🔑 API Keys Required

| Service | Purpose | Get API Key |
|---------|---------|-------------|
| PostgreSQL | Database | [Supabase](https://supabase.com) (free tier) |
| OpenAI | AI food classification & matching | [OpenAI Platform](https://platform.openai.com) |
| Cloudinary | Image uploads | [Cloudinary](https://cloudinary.com) (free tier) |
| Google Maps | Location & routing | [Google Cloud Console](https://console.cloud.google.com) |
| Stripe | Payments | [Stripe Dashboard](https://dashboard.stripe.com) |
| Google OAuth | Social login | [Google Cloud Console](https://console.cloud.google.com) |

## 🌱 Carbon Credit System

The platform calculates carbon credits based on:
- **2.5 kg CO₂** saved per kg of food diverted from landfill
- **30% bonus** for waste processed through biogas plants
- Credits are minted, verified by admin, and tradeable on the marketplace

## 📱 User Roles

| Role | Access |
|------|--------|
| DONOR | Post listings, view bids, earn credits |
| NGO | Post requirements, bid on listings, manage beneficiaries |
| COLLECTOR | Accept pickups, log distributions, deliver to biogas |
| FARMER | Browse waste marketplace, place bids, track compost |
| BENEFICIARY | Search food, request assistance |
| ADMIN | Full platform management |

## 🔒 Security

- Role-based access control (RBAC) on all routes
- KYC verification required for transactions
- Rate limiting on bid APIs
- Audit logging for all state changes
- HTTPS-only in production

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

Built with ❤️ to reduce food waste and feed the hungry.
