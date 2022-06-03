import { OAuthFlowBase, OAuthFlowParent } from './OAuthFlowBase';

import type { IOAuthImplicitFlow } from '../types';
import type { URLString } from '@fresha/api-tools-core';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#oauth-flow-object
 */
export class OAuthImplicitFlow extends OAuthFlowBase implements IOAuthImplicitFlow {
  authorizationUrl: URLString;

  constructor(parent: OAuthFlowParent, authorizationUrl: string) {
    super(parent, 'implicit');
    this.authorizationUrl = authorizationUrl;
  }
}
