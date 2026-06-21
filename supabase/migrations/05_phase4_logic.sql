-- MIGRATION_ID: 05_phase4_logic
-- DEPENDENCIES: 04_phase4_identity_graph

-- ============================================================================
-- STEP 2: Supabase Auth Integration
-- ============================================================================
CREATE OR REPLACE FUNCTION public.on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.identity_nodes (
        id,
        auth_provider_id,
        email_hash,
        role,
        canonical_id,
        created_at
    ) VALUES (
        NEW.id, -- Use same UUID
        NEW.id::text,
        encode(digest(LOWER(TRIM(NEW.email)), 'sha256'), 'hex'),
        'USER',
        NEW.id, -- Self-referencing canonical root
        NOW()
    )
    ON CONFLICT (auth_provider_id) DO NOTHING;

    -- Create initial credit account
    INSERT INTO public.credit_accounts (identity_id, balance)
    VALUES (NEW.id, 0)
    ON CONFLICT (identity_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.on_auth_user_created();

-- ============================================================================
-- STEP 8: Database Rules & Ledger Engine
-- ============================================================================

-- FORBID UPDATE/DELETE on credit_transactions
CREATE OR REPLACE FUNCTION public.forbid_transaction_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'DRIFT_VIOLATION: credit_transactions is append-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_forbid_tx_update ON public.credit_transactions;
CREATE TRIGGER trg_forbid_tx_update
BEFORE UPDATE OR DELETE ON public.credit_transactions
FOR EACH ROW EXECUTE FUNCTION public.forbid_transaction_mutation();

-- FORBID DIRECT UPDATE on credit_accounts.balance
CREATE OR REPLACE FUNCTION public.forbid_direct_balance_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only allow if called from our internal process function
    IF current_setting('ledger.is_updating', true) != 'true' THEN
        IF OLD.balance IS DISTINCT FROM NEW.balance THEN
            RAISE EXCEPTION 'DRIFT_VIOLATION: Direct balance update forbidden. Use credit_transactions.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_forbid_balance_update ON public.credit_accounts;
CREATE TRIGGER trg_forbid_balance_update
BEFORE UPDATE ON public.credit_accounts
FOR EACH ROW EXECUTE FUNCTION public.forbid_direct_balance_update();

-- Auto-update balance on transaction insert
CREATE OR REPLACE FUNCTION public.process_credit_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Set local variable to bypass the direct update block
    PERFORM set_config('ledger.is_updating', 'true', true);

    IF NEW.from_account IS NOT NULL THEN
        UPDATE public.credit_accounts
        SET balance = balance - NEW.amount
        WHERE id = NEW.from_account;
    END IF;

    IF NEW.to_account IS NOT NULL THEN
        UPDATE public.credit_accounts
        SET balance = balance + NEW.amount
        WHERE id = NEW.to_account;
    END IF;

    -- Reset local variable
    PERFORM set_config('ledger.is_updating', 'false', true);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_process_credit_transaction ON public.credit_transactions;
CREATE TRIGGER trg_process_credit_transaction
AFTER INSERT ON public.credit_transactions
FOR EACH ROW EXECUTE FUNCTION public.process_credit_transaction();

-- Enable pgcrypto for digest if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;
