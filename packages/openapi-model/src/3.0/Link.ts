import { BasicNode } from './BasicNode';

import type { Components } from './Components';
import type { Reference } from './Reference';
import type { Response } from './Response';
import type { Server } from './Server';
import type { ILink } from './types';
import type { Nullable, JSONValue } from '@fresha/api-tools-core';

export type LinkParent = Components | Response;

export type LinkReference = Reference<Link, LinkParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#link-object
 */
export class Link extends BasicNode<LinkParent> implements ILink {
  operationRef: string;
  operationId: string;
  parameters: Map<string, JSONValue>;
  requestBody: unknown;
  description: Nullable<string>;
  server: Nullable<Server>;

  constructor(parent: LinkParent) {
    super(parent);
    this.operationRef = '';
    this.operationId = '';
    this.parameters = new Map<string, JSONValue>();
    this.requestBody = null;
    this.description = null;
    this.server = null;
  }
}
