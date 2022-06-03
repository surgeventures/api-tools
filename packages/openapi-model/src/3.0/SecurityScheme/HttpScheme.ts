import { SecuritySchemeBase, SecuritySchemeParent } from './SecuritySchemeBase';

import type { IHTTPSecuritySchema } from '../types';
import type { Nullable } from '@fresha/api-tools-core';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export class HttpScheme extends SecuritySchemeBase implements IHTTPSecuritySchema {
  scheme: string;
  bearerFormat: Nullable<string>;

  constructor(parent: SecuritySchemeParent, scheme: string) {
    super(parent);
    this.scheme = scheme;
    this.bearerFormat = null;
  }

  // eslint-disable-next-line class-methods-use-this
  get type(): 'http' {
    return 'http';
  }
}
