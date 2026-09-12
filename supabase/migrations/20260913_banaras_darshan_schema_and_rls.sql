-- =========================================================================
-- BANARAS DARSHAN: SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- Free-Tier Optimized • Zero Data Exposure • Secure CMS & Public Portal
-- =========================================================================

-- Enable Extension for UUIDs & Cryptography
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. USERS & SESSIONS
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'USER', -- USER, ADMIN, MODERATOR
  reputation INT NOT NULL DEFAULT 10,
  badge TEXT NOT NULL DEFAULT 'New Explorer',
  "passwordHash" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  token TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2. PLACES (Temples, Ghats, Food, Stays, Hidden Gems)
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "Place" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  "hindiName" TEXT,
  category TEXT NOT NULL, -- TEMPLE, GHAT, FOOD, HOTEL, STREET, EXPERIENCE, HIDDEN
  "subCategory" TEXT,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  history TEXT,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image TEXT NOT NULL,
  "fallbackImage" TEXT,
  rating DOUBLE PRECISION,
  "reviewCount" INT,
  "approxBudget" TEXT NOT NULL,
  "budgetTier" TEXT NOT NULL,
  "bestTimeToVisit" TEXT,
  "openingHours" TEXT,
  "visitingTips" TEXT,
  "safetyNotes" TEXT,
  "isVerified" BOOLEAN NOT NULL DEFAULT TRUE,
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  "isHiddenGem" BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT NOT NULL,
  "popularDishes" TEXT,
  "isPureVeg" BOOLEAN DEFAULT FALSE,
  amenities TEXT,
  "nearestHub" TEXT,
  "sourceName" TEXT,
  "sourceUrl" TEXT,
  "parkingInfo" TEXT,
  "galleryJson" TEXT,
  "nearbyPlacesJson" TEXT,
  "lastVerifiedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. PROMOTIONS & ADVERTISEMENTS
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "Promotion" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  "shortTitle" TEXT,
  category TEXT NOT NULL DEFAULT 'EVENT',
  "badgeText" TEXT,
  description TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "additionalImages" TEXT,
  "ctaText" TEXT NOT NULL DEFAULT 'View Details',
  "destinationUrl" TEXT,
  "websiteUrl" TEXT,
  "bookingUrl" TEXT,
  location TEXT,
  address TEXT,
  "contactPhone" TEXT,
  "contactEmail" TEXT,
  "startDate" TIMESTAMP WITH TIME ZONE,
  "endDate" TIMESTAMP WITH TIME ZONE,
  "startTime" TEXT,
  "endTime" TEXT,
  placement TEXT NOT NULL DEFAULT 'BOTH', -- LEFT, RIGHT, BOTH
  priority INT NOT NULL DEFAULT 5,
  "displayOrder" INT NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  "autoRotationDuration" INT NOT NULL DEFAULT 4500,
  "impressionCount" INT NOT NULL DEFAULT 0,
  "clickCount" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. COMMUNITY MESSAGES, REPLIES, REPORTS & MODERATION
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "CommunityMessage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userBadge" TEXT NOT NULL DEFAULT 'New Explorer',
  "userAvatar" TEXT,
  channel TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  image TEXT,
  "isVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  "verifiedNote" TEXT,
  status TEXT NOT NULL DEFAULT 'APPROVED',
  "moderationScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "moderationReason" TEXT,
  "moderationCategory" TEXT DEFAULT 'NONE',
  "helpfulCount" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "CommunityReply" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "messageId" TEXT NOT NULL REFERENCES "CommunityMessage"(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "userBadge" TEXT NOT NULL DEFAULT 'New Explorer',
  content TEXT NOT NULL,
  "isVerified" BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'APPROVED',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Report" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "reporterName" TEXT NOT NULL DEFAULT 'Traveler',
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "targetContent" TEXT,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ModerationLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  action TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "matchedRule" TEXT,
  severity TEXT,
  snippet TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. TRIPS, SAVED PLACES, FEEDBACK & SUGGESTIONS
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "Trip" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  "durationDays" INT NOT NULL,
  "budgetTier" TEXT NOT NULL,
  "travelStyle" TEXT NOT NULL,
  "groupType" TEXT NOT NULL,
  "itineraryJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "SavedPlace" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "placeId" TEXT NOT NULL REFERENCES "Place"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT "SavedPlace_userId_placeId_key" UNIQUE ("userId", "placeId")
);

CREATE TABLE IF NOT EXISTS "Feedback" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  email TEXT,
  category TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  message TEXT NOT NULL,
  screenshot TEXT,
  "pageUrl" TEXT,
  "contactInfo" TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PlaceSuggestion" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  speciality TEXT,
  "submittedBy" TEXT,
  "userId" TEXT,
  "photoUrl" TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  "sourceRef" TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. GALLERIES, PARKING & SITE SETTINGS
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "GalleryImage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT,
  caption TEXT,
  "imageUrl" TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'GENERAL',
  "placeId" TEXT,
  "placeName" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  "order" INT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ParkingLocation" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  capacity TEXT,
  "parkingType" TEXT NOT NULL DEFAULT 'MUNICIPAL',
  timing TEXT,
  "vehicleSupport" TEXT NOT NULL DEFAULT 'BOTH',
  "feeStatus" TEXT NOT NULL DEFAULT 'PAID',
  "feeRate" TEXT,
  image TEXT,
  "associatedPlaces" TEXT,
  "directionsNote" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "SiteSetting" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'GENERAL',
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on ALL tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Place" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Promotion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CommunityMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CommunityReply" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Report" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ModerationLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Trip" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedPlace" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlaceSuggestion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ParkingLocation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSetting" ENABLE ROW LEVEL SECURITY;

-- 1. Helper function to check if current user is admin/moderator
CREATE OR REPLACE FUNCTION is_admin_or_moderator()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::TEXT
      AND role IN ('ADMIN', 'MODERATOR')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Places RLS
CREATE POLICY "Public Places Read" ON "Place" FOR SELECT USING (true);
CREATE POLICY "Admin Places Manage" ON "Place" FOR ALL USING (is_admin_or_moderator());

-- 3. Promotions RLS
-- Public can ONLY view active, unexpired promotions
CREATE POLICY "Public Promotions Read" ON "Promotion" FOR SELECT
USING (
  "isActive" = true AND
  ("startDate" IS NULL OR "startDate" <= NOW()) AND
  ("endDate" IS NULL OR "endDate" >= NOW())
);
CREATE POLICY "Admin Promotions Manage" ON "Promotion" FOR ALL USING (is_admin_or_moderator());

-- 4. Community Messages RLS
-- Public sees approved messages only
CREATE POLICY "Public Messages Read" ON "CommunityMessage" FOR SELECT
USING (status = 'APPROVED' OR "userId" = auth.uid()::TEXT OR is_admin_or_moderator());

CREATE POLICY "Users Message Insert" ON "CommunityMessage" FOR INSERT
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Admin Messages Manage" ON "CommunityMessage" FOR ALL USING (is_admin_or_moderator());

-- 5. Community Replies RLS
CREATE POLICY "Public Replies Read" ON "CommunityReply" FOR SELECT
USING (status = 'APPROVED' OR "userId" = auth.uid()::TEXT OR is_admin_or_moderator());

CREATE POLICY "Users Reply Insert" ON "CommunityReply" FOR INSERT
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Admin Replies Manage" ON "CommunityReply" FOR ALL USING (is_admin_or_moderator());

-- 6. Reports RLS
CREATE POLICY "Public Submit Report" ON "Report" FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Reports Manage" ON "Report" FOR ALL USING (is_admin_or_moderator());

-- 7. Moderation Logs RLS (Admin Only)
CREATE POLICY "Admin Moderation Logs" ON "ModerationLog" FOR ALL USING (is_admin_or_moderator());

-- 8. Trips RLS
CREATE POLICY "User Trips Read" ON "Trip" FOR SELECT
USING ("userId" IS NULL OR "userId" = auth.uid()::TEXT OR is_admin_or_moderator());

CREATE POLICY "User Trips Manage" ON "Trip" FOR ALL
USING ("userId" IS NULL OR "userId" = auth.uid()::TEXT OR is_admin_or_moderator());

-- 9. Saved Places RLS
CREATE POLICY "User Saved Places Read" ON "SavedPlace" FOR SELECT
USING ("userId" = auth.uid()::TEXT OR is_admin_or_moderator());

CREATE POLICY "User Saved Places Manage" ON "SavedPlace" FOR ALL
USING ("userId" = auth.uid()::TEXT OR is_admin_or_moderator());

-- 10. Feedback RLS
CREATE POLICY "Public Feedback Submit" ON "Feedback" FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Feedback Manage" ON "Feedback" FOR ALL USING (is_admin_or_moderator());

-- 11. Place Suggestions RLS
CREATE POLICY "Public Place Suggestion Submit" ON "PlaceSuggestion" FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Place Suggestions Manage" ON "PlaceSuggestion" FOR ALL USING (is_admin_or_moderator());

-- 12. Gallery Images RLS
CREATE POLICY "Public Gallery Read" ON "GalleryImage" FOR SELECT USING (true);
CREATE POLICY "Admin Gallery Manage" ON "GalleryImage" FOR ALL USING (is_admin_or_moderator());

-- 13. Parking Locations RLS
CREATE POLICY "Public Parking Read" ON "ParkingLocation" FOR SELECT USING (true);
CREATE POLICY "Admin Parking Manage" ON "ParkingLocation" FOR ALL USING (is_admin_or_moderator());

-- 14. Site Settings RLS
CREATE POLICY "Public Site Settings Read" ON "SiteSetting" FOR SELECT
USING (category != 'INTERNAL_SECRET');
CREATE POLICY "Admin Site Settings Manage" ON "SiteSetting" FOR ALL USING (is_admin_or_moderator());

-- 15. User Profile RLS
CREATE POLICY "Public Users Read" ON "User" FOR SELECT USING (true);
CREATE POLICY "User Self Update" ON "User" FOR UPDATE
USING (id = auth.uid()::TEXT OR is_admin_or_moderator());
CREATE POLICY "Admin Users Manage" ON "User" FOR ALL USING (is_admin_or_moderator());

-- 16. Session RLS
CREATE POLICY "Service Role Session Access" ON "Session" FOR ALL USING (auth.role() = 'service_role');
