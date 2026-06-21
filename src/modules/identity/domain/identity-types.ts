export interface IdentityNode {
  id: string;
  canonical_id: string | null;
  auth_provider_id: string;
  email_hash: string;
  role: 'USER' | 'ADMIN';
  created_at: Date;
}

export interface AssetClaim {
  id: string;
  identity_id: string;
  entity_id: string;
  claim_status: 'PENDING' | 'VERIFYING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verification_method: 'DNS_TXT' | 'HTML_META' | 'HTTP_FILE';
  created_at: Date;
}

export interface CreditAccount {
  id: string;
  identity_id: string;
  balance: number;
  created_at: Date;
}

export interface CreditTransaction {
  id: string;
  from_account: string | null;
  to_account: string | null;
  amount: number;
  reason: string;
  event_id: string;
  created_at: Date;
}

export interface Subscription {
  id: string;
  identity_id: string;
  plan_id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELED' | 'EXPIRED';
  started_at: Date;
}
