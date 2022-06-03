import { BasicNode } from './BasicNode';

import type { Schema } from './Schema';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#discriminator-object
 */
export class Discriminator extends BasicNode<Schema> {
  propertyName: string;
  mapping: Map<string, string>;

  constructor(parent: Schema, propertyName: string) {
    super(parent);
    this.propertyName = propertyName;
    this.mapping = new Map<string, string>();
  }
}
