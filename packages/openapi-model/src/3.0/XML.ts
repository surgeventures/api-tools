import { BasicNode } from './BasicNode';

import type { Reference } from './Reference';
import type { Schema } from './Schema';
import type { IXML } from './types';
import type { Nullable } from '@fresha/api-tools-core';

export type XMLParent = Schema;

export type XMLReference = Reference<XML, XMLParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#xml-object
 */
export class XML extends BasicNode<XMLParent> implements IXML {
  name: Nullable<string>;
  namespace: Nullable<string>;
  prefix: Nullable<string>;
  attribute: boolean;
  wrapped: boolean;

  constructor(parent: XMLParent) {
    super(parent);
    this.name = null;
    this.namespace = null;
    this.prefix = null;
    this.attribute = false;
    this.wrapped = false;
  }
}
