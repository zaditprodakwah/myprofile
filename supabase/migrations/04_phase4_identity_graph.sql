-- MIGRATION_ID: 04_phase4_identity_graph
-- DEPENDENCIES: 03_phase3_entity_graph
-- BACKWARD_COMPATIBILITY_NOTE: Additive only. No existing tables are modified.

-- UP

-- 1. identity_nodes
CREATE TABLE IF NOT EXISTS public.identity_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canonical_id UUID REFERENCES public.identity_nodes(id) ON DELETE SET NULL,
    auth_provider_id TEXT UNIQUE NOT NULL,
    email_hash TEXT NOT NULL,
    role TEXT DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_identity_canonical_id_self_referential CHECK (canonical_id IS NULL OR canonical_id = id)
);
CREATE INDEX IF NOT EXISTS idx_identity_nodes_canonical_id ON public.identity_nodes(canonical_id);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_identity_canonical_root ON public.identity_nodes(canonical_id) WHERE canonical_id = id;

-- 2. credit_accounts
CREATE TABLE IF NOT EXISTS public.credit_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identity_id UUID NOT NULL REFERENCES public.identity_nodes(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_accounts_identity ON public.credit_accounts(identity_id);

-- 3. credit_transactions
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_account UUID REFERENCES public.credit_accounts(id) ON DELETE SET NULL,
    to_account UUID REFERENCES public.credit_accounts(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    event_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_from ON public.credit_transactions(from_account);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_to ON public.credit_transactions(to_account);

-- 4. subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identity_id UUID NOT NULL REFERENCES public.identity_nodes(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'INACTIVE',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_identity ON public.subscriptions(identity_id);

-- 5. asset_claims
CREATE TABLE IF NOT EXISTS public.asset_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identity_id UUID NOT NULL REFERENCES public.identity_nodes(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES public.entity_nodes(id) ON DELETE CASCADE,
    claim_status TEXT NOT NULL DEFAULT 'PENDING',
    verification_method TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_asset_claims_identity ON public.asset_claims(identity_id);
CREATE INDEX IF NOT EXISTS idx_asset_claims_entity ON public.asset_claims(entity_id);

-- DOWN
DROP TABLE IF EXISTS public.asset_claims CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.credit_transactions CASCADE;
DROP TABLE IF EXISTS public.credit_accounts CASCADE;
DROP TABLE IF EXISTS public.identity_nodes CASCADE;
