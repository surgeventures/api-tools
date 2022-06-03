import { Schema, SchemaParent } from './Schema';

import type { Nullable } from '@fresha/api-tools-core';

export class StringSchema extends Schema {
  enum: Nullable<string[]>;
  maxLength: Nullable<number>;
  minLength: Nullable<number>;
  pattern: Nullable<string>;

  constructor(parent: SchemaParent) {
    super(parent, 'string');
    this.enum = null;
    this.maxLength = null;
    this.minLength = null;
    this.pattern = null;
  }
}
