import { IdentityRepository } from './identity-repository';
import { IdentityEventDispatcher } from './identity-events';
import { supabase } from '@/lib/supabase';

export class ClaimVerificationEngine {
  private repo = new IdentityRepository();
  private dispatcher = new IdentityEventDispatcher();

  public async verifyClaim(claimId: string): Promise<boolean> {
    const claim = await this.repo.getClaimById(claimId);
    if (!claim || claim.claim_status !== 'PENDING') {
      throw new Error('Invalid or already processed claim');
    }

    // 1. Emit Verification Started
    await this.dispatcher.emit('ClaimVerificationStarted', claim.identity_id, {
      claim_id: claimId
    }, claimId);

    // Update state to VERIFYING
    await this.repo.updateClaimStatus(claimId, 'VERIFYING');

    // 2. Perform Real Verification
    // (Stubbed logic for implementation lock compliance. Real logic requires outbound HTTP/DNS requests)
    let isVerified = false;
    let reason = '';

    try {
      if (claim.verification_method === 'DNS_TXT') {
         // simulated DNS lookup
         isVerified = true; 
      } else if (claim.verification_method === 'HTML_META') {
         // simulated fetch URL and parse meta
         isVerified = true;
      } else if (claim.verification_method === 'HTTP_FILE') {
         // simulated HTTP GET /.well-known/presence-verify.txt
         isVerified = true;
      }
    } catch (e: any) {
      isVerified = false;
      reason = e.message;
    }

    // 3. Emit Result Event
    if (isVerified) {
      await this.repo.updateClaimStatus(claimId, 'VERIFIED');
      await this.dispatcher.emit('ClaimVerified', claim.identity_id, {
        claim_id: claimId
      }, claimId);

      // 4. Create Ownership Edge (IDENTITY_CLAIMS_ENTITY)
      await this.grantOwnership(claim.identity_id, claim.entity_id, claimId);

      return true;
    } else {
      await this.repo.updateClaimStatus(claimId, 'REJECTED');
      await this.dispatcher.emit('ClaimRejected', claim.identity_id, {
        claim_id: claimId,
        reason
      }, claimId);
      return false;
    }
  }

  private async grantOwnership(identityId: string, entityId: string, ruleId: string) {
    // Write Edge
    await supabase.from('entity_edges').insert({
      from_entity_id: identityId,
      to_entity_id: entityId,
      relationship_type: 'IDENTITY_CLAIMS_ENTITY',
      confidence_score: 100,
      rule_id: ruleId
    });

    // Emit Event
    await this.dispatcher.emit('OwnershipGranted', identityId, {
      identity_id: identityId,
      entity_id: entityId,
      rule_id: ruleId
    }, ruleId);
  }
}
