import { Schema, SchemaParent } from './Schema';

import type { Nullable } from '@fresha/api-tools-core';

export class NumberSchema extends Schema {
  enum: Nullable<number[]>;
  maximum: Nullable<number>;
  exclusiveMaximum: boolean;
  minimum: Nullable<number>;
  exclusiveMinimum: boolean;
  multipleOf: Nullable<number>;

  constructor(parent: SchemaParent, int = false) {
    super(parent, int ? 'integer' : 'number');
    this.enum = null;
    this.maximum = null;
    this.exclusiveMaximum = false;
    this.minimum = null;
    this.exclusiveMinimum = false;
    this.multipleOf = null;
  }
}
