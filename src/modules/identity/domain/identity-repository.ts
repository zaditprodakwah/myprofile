import { supabase } from '@/lib/supabase';
import { IdentityNode, AssetClaim } from './identity-types';

export class IdentityRepository {
  public async getIdentityByAuthId(authId: string): Promise<IdentityNode | null> {
    const { data, error } = await supabase
      .from('identity_nodes')
      .select('*')
      .eq('auth_provider_id', authId)
      .single();

    if (error || !data) return null;
    return data as IdentityNode;
  }

  public async getClaimById(claimId: string): Promise<AssetClaim | null> {
    const { data, error } = await supabase
      .from('asset_claims')
      .select('*')
      .eq('id', claimId)
      .single();

    if (error || !data) return null;
    return data as AssetClaim;
  }

  public async updateClaimStatus(claimId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('asset_claims')
      .update({ claim_status: status })
      .eq('id', claimId);

    if (error) throw new Error(`Failed to update claim status: ${error.message}`);
  }

  public async insertClaim(claim: Partial<AssetClaim>): Promise<AssetClaim> {
    const { data, error } = await supabase
      .from('asset_claims')
      .insert(claim)
      .select()
      .single();

    if (error) throw new Error(`Failed to insert claim: ${error.message}`);
    return data as AssetClaim;
  }
}
