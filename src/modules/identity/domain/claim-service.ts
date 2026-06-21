import { IdentityRepository } from './identity-repository';
import { IdentityEventDispatcher } from './identity-events';
import { v4 as uuidv4 } from 'uuid';

export class ClaimService {
  private repo = new IdentityRepository();
  private dispatcher = new IdentityEventDispatcher();

  public async requestClaim(identityId: string, entityId: string, method: 'DNS_TXT' | 'HTML_META' | 'HTTP_FILE'): Promise<string> {
    const claimId = uuidv4();
    
    // 1. Write pending claim to DB
    await this.repo.insertClaim({
      id: claimId,
      identity_id: identityId,
      entity_id: entityId,
      verification_method: method,
      claim_status: 'PENDING'
    });

    // 2. Emit Domain Event (Event Sourced)
    await this.dispatcher.emit('ClaimRequested', identityId, {
      claim_id: claimId,
      identity_id: identityId,
      entity_id: entityId,
      verification_method: method
    }, claimId);

    return claimId;
  }
}
