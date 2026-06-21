import { IdentityRepository } from '../domain/identity-repository';
import { IdentityEventDispatcher } from '../domain/identity-events';
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
    let isVerified = false;
    let reason = '';

    try {
      const { data: entityData } = await supabase.from('directory_entities').select('website_url').eq('id', claim.entity_id).single();
      const domain = entityData?.website_url ? new URL(entityData.website_url).hostname : '';

      if (!domain) {
          throw new Error('Entity has no associated domain');
      }

      if (claim.verification_method === 'DNS_TXT') {
         // Real DNS lookup via Google DNS-over-HTTPS
         const dnsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`);
         const dnsData = await dnsRes.json();
         const txtRecords = dnsData.Answer?.map((a: any) => a.data) || [];
         isVerified = txtRecords.some((txt: string) => txt.includes(`presence-verify=${claim.identity_id}`));
         if (!isVerified) reason = 'TXT record not found';
      } else if (claim.verification_method === 'HTML_META') {
         // Real fetch URL and parse meta
         const res = await fetch(`https://${domain}`, { signal: AbortSignal.timeout(10000) });
         const html = await res.text();
         isVerified = html.includes(`<meta name="presence-verify" content="${claim.identity_id}"`);
         if (!isVerified) reason = 'Meta tag not found';
      } else if (claim.verification_method === 'HTTP_FILE') {
         // Real HTTP GET /.well-known/presence-verify.txt
         const res = await fetch(`https://${domain}/.well-known/presence-verify.txt`, { signal: AbortSignal.timeout(10000) });
         const text = await res.text();
         isVerified = text.includes(claim.identity_id);
         if (!isVerified) reason = 'Verification file not found or incorrect content';
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
