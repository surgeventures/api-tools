import { Schema, SchemaParent } from './Schema';

import type { Nullable } from '@fresha/api-tools-core';

export class BooleanSchema extends Schema {
  enum: Nullable<boolean[]>;

  constructor(parent: SchemaParent) {
    super(parent, 'boolean');
    this.enum = null;
  }
}
