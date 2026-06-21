import { IdentityRepository } from './identity-repository';
import { IdentityEventDispatcher } from './identity-events';
import { v4 as uuidv4 } from 'uuid';

export class IdentityService {
  private repo = new IdentityRepository();
  private dispatcher = new IdentityEventDispatcher();

  public async getIdentity(authId: string) {
    return this.repo.getIdentityByAuthId(authId);
  }

  // Identity is created automatically by DB trigger, 
  // but if we needed application-level logic, it would be here.
}
