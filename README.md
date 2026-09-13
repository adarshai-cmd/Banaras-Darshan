# 🛕 BANARAS DARSHAN (बनारस दर्शन)
### *“Discover Banaras. Your Way.”*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

> **The all-in-one digital travel companion, route navigator, real-time community, live weather radar, and AI guide for Varanasi (Banaras / Kashi).**
>
> 🔗 **Repository**: [https://github.com/adarshai-cmd/Banaras-Darshan](https://github.com/adarshai-cmd/Banaras-Darshan)

---

## 📖 Overview

**Banaras Darshan** is a modern, production-grade travel-tech platform crafted specifically to help pilgrims, backpackers, cultural explorers, and culinary enthusiasts navigate the ancient living soul of Kashi (Varanasi).

Combining cutting-edge web engineering with deep respect for Varanasi's timeless spiritual heritage, it delivers an integrated experience blending:
* **Interactive Mapping & Transit Navigation** (Station-to-ghat realistic routing, fare benchmarks & walking advice)
* **Live Map Weather Radar & 5-Day Forecast** (Real-time meteorological metrics, floating map overlay, and travel guidance)
* **Dynamic Promotions & Cultural Highlights** (Hero auto-rotating promotional slots, mobile touch carousel, and interactive details)
* **Real-time Traveler Community & Live Dispatches** (Real-time traveler advice, channel discussions, verified contributor badges)
* **Verified Information Engine** (Automated checks verifying community recommendations against official place records)
* **Smart AI Trip Planner** (Personalized multi-day day-by-day itineraries factoring budget, pace, and zero-backtracking paths)
* **Live Spiritual Clock** (Ganga Aarti schedules for Dashashwamedh and Assi Ghat, sunrise/sunset timings, river conditions)
* **Hidden Enterprise Admin Panel (`/bd-admin`)** (Zero public traces, scrypt constant-time authentication, brute-force rate limiter, full directory CRUD, photo uploads, moderation queue, and chatbot directives)

---

## 🎨 Design Philosophy: *Kashi Glassmorphism*

- **Kashi Heritage Palette**:
  - Sacred Kashi Saffron: `#EA580C` & `#F97316`
  - Antique Temple Gold: `#D4AF37` & `#F59E0B`
  - Holy Ganga Blues: `#2563EB`, `#1E3A8A`, `#38BDF8`
  - Warm Sand & Ivory Canvas: `#FAF8F5`, `#F3EFE6`
  - Midnight Obsidian: `#040813`, `#070D1E`
- **Atmospheric Micro-Interactions**: Ambient river pulse, gentle floating icons, frosted glass panels with dynamic blur, gold-accented gradient headings, and responsive mobile-first touch targets.

---

## 🌟 Key Features

### 1. 🌅 Cinematic Hero with Dynamic Promotions & Global Search
- Immersive high-definition visuals of Dashashwamedh Ghat and evening Maha Aarti.
- **Flanking Promotional Slots**: Left and Right promotional cards flanking the search area on desktop with auto-rotation (4.5s), hover pause, and pagination dots.
- **Mobile Touch Carousel**: Swipeable touch carousel with gesture detection (`onTouchStart/Move/End`) on smaller viewports.
- **Interactive Promotion Detail Modal**: High-res imagery, Google Maps directions link, direct phone dialer, booking links, and impression/click analytics tracking.
- Smart search bar supporting instant lookup across temples, ghats, food spots, stays, and hidden lanes.

### 2. ☀️ Banaras Live Weather & 5-Day Forecast
- **Floating Map Weather Radar**: Integrated directly into OpenStreetMap (`LeafletMap.tsx`) at the top-right corner. Shows a compact glassmorphic pill that expands into a rich radar drawer with humidity, wind speed, sunset timing, smart travel advice, 5-day mini forecast, and °C / °F toggle.
- **Dedicated Weather Section**: Embedded on the Homepage and `/map` page with live temperature, "feels like", WMO condition translation, and precipitation probability.
- **Route Planner Weather Context**: Real-time weather and rain alert banner directly inside the station-to-ghat route calculator.
- **15-Minute Server Cache & Offline Fallback**: Zero external API keys exposed to visitors, powered by Open-Meteo with high-performance in-memory caching and graceful fallback.

### 3. 🗺️ Interactive Leaflet Map & Station Route Navigator
- Integrated OpenStreetMap & Leaflet mapping with category-coded pins (Temples, Ghats, Food, Stays, Hidden Gems).
- **Station-to-Ghat Route Planner**: Real-time fare benchmarks, estimated travel times, and last-mile walking lane directions from:
  - Varanasi Junction (Cantt - BSB)
  - Banaras Station (Manduadih - BSBS)
  - Kashi Station (KEI)
  - Lal Bahadur Shastri International Airport (Babatpur - VNS)

### 4. 🍽️ Curated Culinary & Heritage Catalog
- **Temples**: Kashi Vishwanath Dham (Corridor gates, locker guidelines, VIP darshan protocol), Sankat Mochan, Kaal Bhairav (Kotwal of Varanasi), Durga Kund.
- **Ghats**: Dashashwamedh, Assi, Manikarnika (cremation photography etiquette), Chet Singh Fort, Harishchandra, Kedar.
- **Iconic Street Food**: Kashi Chaat Bhandar (Tamatar Chaat), Ram Bhandar (Desi ghee kachori-jalebi), Blue Lassi Shop, Keshav Tambool (Banarasi Paan), Shreeji Sweets (Malaiyo).
- **Heritage Stays**: BrijRama Palace, Zostel Varanasi, Ganpati Guest House.
- **Hidden Galliyan**: Vishwanath Gali, Thatheri Bazaar brass guild, Sarai Mohana GI-tagged silk looms, Lolark Kund stepwell.

### 5. 🗓️ Smart "Plan My Trip" Itinerary Generator
- Configurable 1 to 3-day personalized itineraries factoring:
  - Budget Tier (Budget Backpacker / Heritage Cultural / Luxury Pilgrim)
  - Travel Style (Spiritual / Foodie / Photographer / Deep Explorer)
  - Group Configuration (Solo / Couple / Family / Friends)
- Hour-by-hour timeline schedule with estimated costs and built-in Print / PDF export.

### 6. 💬 Real-Time Traveler Community & Dispatches
- Dedicated channels: `#live-help`, `#food-chai`, `#ghats-boats`, `#stays`.
- Live polling for instantaneous updates and threaded replies.
- **Verified Fact-Checking Engine**: Scans incoming messages against the verified database, appending green `✓ Verified Place Information` badges or amber `Community Recommendation` notices.
- **Reputation Tiering**: Badges travelers based on contributions (*New Explorer*, *Helpful Traveler*, *Local Guide*, *Verified Contributor*).

### 7. 🛡️ Content Moderation & Traveler Safety Hub
- Multi-tier contextual moderation pipeline analyzing abusive terms (Hindi & English), phone number spam, commercial spam, and unsafe river advisories (`APPROVED`, `HELD_FOR_REVIEW`, `REJECTED`).
- Official Varanasi Tourist Police helplines (`0542-2508000`), National Emergency (`112`), and cyber crime reporting.
- Standardized government boat fare slabs and boatman negotiation tips.

### 8. 🤖 Banaras AI Travel Assistant
- Context-grounded conversational AI assistant with instant answers on rituals, timings, etiquette, and routes.
- Renders interactive destination cards directly inside chat responses.
- Provider-agnostic engine with seamless integration for Gemini and OpenAI models.

### 9. 🔐 Hidden Enterprise Admin Panel (`/bd-admin`)
- **Strict Secrecy**: Accessible ONLY by navigating manually to `/bd-admin`. Decommissioned old `/admin` returns HTTP 404. Zero public links or mentions in navbar, footer, sitemap, or robots.
- **Cryptographic Security**: Node.js `crypto.scryptSync` salted hashing, constant-time `crypto.timingSafeEqual` password verification, HTTP-only secure session cookies, and 15-minute brute-force lockout after 5 failed attempts.
- **Comprehensive CMS Sections**:
  - **Directory Manager**: Temples, Ghats, Food, Tourist Places with rich metadata, photos, aarti times, and pricing.
  - **Promotions & Ads**: Full CRUD, image uploads, start/end scheduling, priority weighting, and impressions/clicks CTR analytics.
  - **Weather Settings**: Coordinates configuration, cache duration tuning, and custom travel advisory overrides.
  - **Parking Infrastructure**: Dedicated Parking Stands Manager with live direct photo uploads (`/api/bd-admin/upload`), URL paste support, instant photo previews, and automated thumbnail integration on public parking cards.
  - **Nearby Places Cross-Linking**: Contextual nearby landmarks and transit hubs.
  - **Media Storage**: Upload images directly to server storage (`public/uploads/`) with instant preview.
  - **Moderation Desk**: 1-Click "Approve & Publish" for user-submitted places and report resolution.
  - **AI Directives & Content**: Configure chatbot system prompts, announcement banners, and emergency helplines.

### 10. 📜 Legal, Privacy, User-Consent & Compliance Framework
- **Full Legal Suite**:
  - **Privacy Policy (`/privacy-policy`)**: DPDP Act 2023 & GDPR aligned privacy practices, transparent data handling, storage policies, and user privacy rights.
  - **Terms & Conditions (`/terms-and-conditions`)**: Permitted platform use, IP ownership, user-generated content standards, and Varanasi court jurisdiction.
  - **Cookie Policy (`/cookie-policy`)**: Granular categorisation of strictly necessary and analytics cookies with local opt-in controls.
  - **Disclaimer (`/disclaimer`)**: Information accuracy disclaimers, spiritual rituals & Ganga Aarti schedule variability, and third-party commercial disclaimers.
  - **Community Guidelines (`/community-guidelines`)**: Respecting sacred decorum of Kashi, zero-harassment, river safety etiquette, and reporting mechanisms.
  - **Accessibility Statement (`/accessibility`)**: WCAG 2.1 AA commitments, keyboard navigation, contrast ratios, and assistive tech support.
  - **Contact & Support (`/contact`)**: Official communication channels, tourist police helplines (`0542-2508000`), emergency services, and support ticket desk.
- **Interactive Consent UI**:
  - **Floating Cookie Consent Banner**: Glassmorphic consent banner with accept/essential preferences and local storage persistence.
  - **Sign-up Consent Verification**: Mandatory explicit Terms & Privacy consent checkbox during user authentication in `AuthModal`.
  - **Compliance Footer**: Complete categorized legal navigation bar across all site pages without leaking admin endpoints.

### 11. ⚖️ Dynamic Policy CMS & Versioning Engine (`/bd-admin`)
- **Database-Backed CMS**: Full `LegalPolicy` and `LegalPolicyHistory` Prisma schema with automatic fallback to canonical policy text.
- **Live Visual Editor**: Markdown editor with real-time preview, instant status toggles (Draft / Published), and one-click save.
- **Audit-Ready Versioning**: Automatic semantic version incrementation upon edits, complete revision history logs, and instant rollback capabilities.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Server Components, Turbopack, Fast Refresh |
| **UI Library** | [React 19](https://react.dev/) | Concurrent rendering, modern hooks |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type safety across components and APIs |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Theme variables, utility-first CSS |
| **Database** | SQLite (Default local) / PostgreSQL ready | Seamless portability across environments |
| **ORM** | [Prisma ORM 6](https://www.prisma.io/) | Type-safe queries, automated migrations & seeders |
| **Weather** | [Open-Meteo](https://open-meteo.com/) | Zero-key live weather & 5-day forecast with server caching |
| **Maps** | [Leaflet](https://leafletjs.com/) + OpenStreetMap | Zero-cost, 100% API-key-free interactive mapping |
| **Routing** | [OSRM](https://project-osrm.org/) | Realistic road network navigation & distance calculations |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, lightweight icon suite |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth entrance animations and page transitions |

---

## 📁 Project Structure

```
Banaras-Darshan/
├── prisma/
│   ├── schema.prisma          # Database schema (Places, Users, Messages, Reports, Promotions)
│   └── seed.ts                # Verified authentic Banaras seed dataset (19+ places, channels)
├── public/                    # Static assets, icons & uploaded photos
│   └── uploads/               # Direct admin file upload storage
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with SEO metadata, Navbar & Footer
│   │   ├── page.tsx           # Cinematic landing page with Hero Promos & Weather
│   │   ├── globals.css        # Tailwind v4 theme, glassmorphism tokens & scrollbars
│   │   ├── explore/           # Search catalog with category & tag filters
│   │   ├── temples/           # Dedicated Temples & Aarti rituals guide
│   │   ├── ghats/             # 84 Ghats, boat rates & cremation etiquette
│   │   ├── food/              # Iconic Banarasi street food guide
│   │   ├── stay/              # Verified heritage stays, hotels & hostels
│   │   ├── hidden/            # Hidden lanes, silk weavers & stepwells
│   │   ├── map/               # Leaflet map with Live Weather overlay & Route Planner
│   │   ├── plan/              # Multi-day AI itinerary builder
│   │   ├── community/         # Real-time traveler community feed & chat
│   │   ├── ai-assistant/      # Fullscreen Banaras AI conversational guide
│   │   ├── safety/            # Safety hub, official helplines & scams guide
│   │   ├── feedback/          # User feedback & "Suggest a Place" submission
│   │   ├── profile/           # User profile & saved itineraries
│   │   ├── privacy-policy/    # Privacy Policy (GDPR & DPDP Act 2023)
│   │   ├── terms-and-conditions/ # Terms of Service & UGC standards
│   │   ├── cookie-policy/     # Cookie usage & consent controls
│   │   ├── disclaimer/        # Spiritual, navigation & commercial disclaimers
│   │   ├── community-guidelines/ # Sacred decorum & river safety guidelines
│   │   ├── accessibility/     # WCAG 2.1 AA accessibility commitment
│   │   ├── contact/           # Official contact directory & helplines
│   │   ├── bd-admin/          # Hidden Admin CMS (Auth, Dashboard, CRUD, Legal CMS, Moderation)
│   │   ├── places/[slug]/     # Dynamic place details page
│   │   ├── sitemap.ts         # Dynamic SEO XML sitemap generator
│   │   ├── robots.ts          # Search engine crawler configuration (disallowing /bd-admin)
│   │   └── api/               # REST API route handlers
│   │       ├── bd-admin/      # Protected admin endpoints (places, promotions, weather, legal, parking)
│   │       ├── promotions/    # Public promotions & click telemetry
│   │       ├── weather/       # Cached live weather & 5-day forecast
│   │       ├── places/        # Place retrieval and user submissions
│   │       ├── community/     # Dispatches, threaded replies, helpful votes
│   │       └── ai/chat/       # Conversational AI assistant
│   ├── components/
│   │   ├── ui/                # GlassCard, Button, Badge, SafeImage, CookieConsentBanner
│   │   ├── legal/             # LegalDocumentLayout shared layout shell
│   │   ├── navigation/        # Navbar, Footer
│   │   ├── hero/              # CinematicHero, SearchBox
│   │   ├── promotions/        # PromotionalSlot, MobileCarousel, DetailModal
│   │   ├── weather/           # BanarasWeatherWidget
│   │   ├── map/               # LeafletMap (with Weather Overlay), RoutePlannerWidget
│   │   ├── cards/             # PlaceCard
│   │   ├── home/              # ExploreNearMeWidget (Haversine GPS radar)
│   │   ├── trip/              # TripPlannerWidget
│   │   ├── community/         # CommunityFeed
│   │   └── ai/                # AIAssistantWidget
│   └── lib/
│       ├── db.ts              # Singleton Prisma client
│       ├── auth.ts            # Admin scrypt hashing, sessions, rate limiter & RBAC
│       ├── legal-defaults.ts  # Fallback canonical legal document corpus & metadata
│       ├── moderation.ts      # Multi-tier text & safety moderation engine
│       ├── verification.ts    # Place recommendation verification engine
│       ├── ai-engine.ts       # Grounded Banaras reasoning engine
│       └── distance.ts        # Haversine distance calculator & OSRM integration
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.18.0 or higher
- **npm** or **pnpm** or **yarn**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/adarshai-cmd/Banaras-Darshan.git
cd Banaras-Darshan
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the `.env.example` template to `.env`:
```bash
cp .env.example .env
```

### 4. Supabase Integration (Free Tier)
To connect the project to your Supabase project:
1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Run `supabase/migrations/20260913_banaras_darshan_schema_and_rls.sql` to initialize all tables and activate Row Level Security (RLS) policies.
3. Run `supabase/storage_setup.sql` to create public storage buckets (`places`, `promotions`, `gallery`, `avatars`, `feedback`) and storage policies.
4. Add your Supabase project details to your `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   # Transaction Pooler (Port 6543)
   DATABASE_URL="postgresql://postgres.your-project-ref:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
> **Note**: For local offline development without a Supabase connection, the built-in SQLite database and local image upload storage work immediately out of the box with zero configuration!

### 5. Initialize & Seed Database
Generate the Prisma client, push database tables, and seed authentic Banaras records:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 6. Start Development Server
```bash
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔌 Key API Endpoints Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/places` | `GET` | Fetch all verified places with category, search, and featured filters |
| `/api/places/suggest` | `POST` | Crowdsource new place suggestions for admin review |
| `/api/promotions` | `GET` | Retrieve active, scheduled promotions for hero placement |
| `/api/promotions/[id]/track` | `POST` | Record impression or click analytics telemetry |
| `/api/weather` | `GET` | Retrieve live Varanasi weather, metrics & 5-day forecast (15-min cached) |
| `/api/community/messages` | `GET`, `POST` | Retrieve channel messages / Submit new dispatch (with moderation) |
| `/api/community/replies` | `GET`, `POST` | Threaded discussion replies |
| `/api/community/helpful` | `POST` | Upvote helpful messages and award reputation points |
| `/api/community/report` | `POST` | Report a message for moderator investigation |
| `/api/ai/chat` | `POST` | Grounded conversational AI assistant response generation |
| `/api/bd-admin/auth` | `POST`, `DELETE` | Authenticate admin user / Destroy session |
| `/api/bd-admin/stats` | `GET` | Retrieve CMS overview statistics and counts |
| `/api/bd-admin/places` | `GET`, `POST` | Admin places list and create endpoint |
| `/api/bd-admin/places/[id]`| `PUT`, `DELETE` | Admin place edit and delete endpoint |
| `/api/bd-admin/promotions` | `GET`, `POST` | Admin promotions list and campaign creation |
| `/api/bd-admin/promotions/[id]` | `PUT`, `DELETE` | Admin promotion campaign update and delete |
| `/api/bd-admin/weather` | `GET`, `POST` | Admin weather parameters configuration |
| `/api/bd-admin/parking` | `GET`, `POST`, `PUT`, `DELETE` | Admin parking stands management with direct photo integration |
| `/api/bd-admin/legal` | `GET`, `POST` | Retrieve legal policies / Update policy content & bump version |
| `/api/bd-admin/legal/[slug]/history` | `GET`, `POST` | Audit revision history log / Rollback policy to a prior version |
| `/api/bd-admin/upload` | `POST` | Direct multipart file upload to `/public/uploads` |

---

## 🔒 Security & Verification Architecture

- **Hidden Admin Secrecy**: No public links, decommissioned `/admin` returning 404, disallowed in `robots.txt`, and omitted from `sitemap.xml`.
- **Brute-Force Rate Limiter**: 15-minute account lock after 5 consecutive failed login attempts.
- **Cryptographic Auth**: `crypto.scryptSync` unique salted hashing with `crypto.timingSafeEqual` constant-time verification.
- **Automated Moderation**: Filters profanity, sensitive contact information, scam triggers, and unsafe boat operation claims.
- **SQL Injection Prevention**: Parameterized queries enforced via Prisma ORM.
- **XSS & HTML Sanitization**: Input cleaning across all community postings and user suggestions.
- **Zero-Crash Fallbacks**: Glassmorphic SVG placeholders and offline weather fallbacks ensure the site never breaks.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project: `git checkout -b feature/AmazingFeature`
2. Commit your Changes: `git commit -m 'Add some AmazingFeature'`
3. Push to the Branch: `git push origin feature/AmazingFeature`
4. Open a Pull Request.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>हर हर महादेव! 🕉️ Made with devotion for Kashi.</b><br/>
  <sub>© 2026 Banaras Darshan. All rights reserved.</sub>
</p>
