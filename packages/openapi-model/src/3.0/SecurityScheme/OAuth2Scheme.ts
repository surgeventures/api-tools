import { OAuthFlows } from '../OAuthFlow';

import { SecuritySchemeBase, SecuritySchemeParent } from './SecuritySchemeBase';

import type { IOAuth2SecuritySchema } from '../types';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export class OAuth2Scheme extends SecuritySchemeBase implements IOAuth2SecuritySchema {
  readonly flows: OAuthFlows;

  constructor(parent: SecuritySchemeParent) {
    super(parent);
    this.flows = new OAuthFlows(this);
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): 'oauth2' {
    return 'oauth2';
  }
}
