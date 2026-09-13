-- =========================================================================
-- BANARAS DARSHAN: LEGAL POLICIES & AUDIT VERSIONING SCHEMA & RLS
-- Free-Tier Optimized • Secure Content Management • Policy History
-- =========================================================================

-- 1. Create LegalPolicy Table
CREATE TABLE IF NOT EXISTS "LegalPolicy" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'LEGAL',
  version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'PUBLISHED', -- DRAFT, PUBLISHED, UNPUBLISHED
  summary TEXT,
  content TEXT NOT NULL,
  "lastUpdated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Create LegalPolicyHistory Table (Audit revisions)
CREATE TABLE IF NOT EXISTS "LegalPolicyHistory" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "policyId" TEXT NOT NULL REFERENCES "LegalPolicy"(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  status TEXT NOT NULL,
  "changeNotes" TEXT,
  "archivedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS "idx_legal_policy_slug" ON "LegalPolicy"(slug);
CREATE INDEX IF NOT EXISTS "idx_legal_policy_status" ON "LegalPolicy"(status);
CREATE INDEX IF NOT EXISTS "idx_legal_policy_history_policy" ON "LegalPolicyHistory"("policyId");

-- 4. Enable Row Level Security (RLS)
ALTER TABLE "LegalPolicy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LegalPolicyHistory" ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for LegalPolicy:
-- Public can ONLY view PUBLISHED legal policies
DROP POLICY IF EXISTS "Public LegalPolicy Read" ON "LegalPolicy";
CREATE POLICY "Public LegalPolicy Read" ON "LegalPolicy"
  FOR SELECT
  USING (status = 'PUBLISHED');

-- Admin/Moderator can manage ALL legal policies (including DRAFT and UNPUBLISHED)
DROP POLICY IF EXISTS "Admin LegalPolicy Manage" ON "LegalPolicy";
CREATE POLICY "Admin LegalPolicy Manage" ON "LegalPolicy"
  FOR ALL
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::TEXT
      AND role IN ('ADMIN', 'MODERATOR')
    )
  );

-- 6. RLS Policies for LegalPolicyHistory:
-- Only Admin/Moderator can view and manage audit history
DROP POLICY IF EXISTS "Admin LegalPolicyHistory Manage" ON "LegalPolicyHistory";
CREATE POLICY "Admin LegalPolicyHistory Manage" ON "LegalPolicyHistory"
  FOR ALL
  USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM "User"
      WHERE id = auth.uid()::TEXT
      AND role IN ('ADMIN', 'MODERATOR')
    )
  );
