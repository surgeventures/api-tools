import { Schema, SchemaParent, SchemaReference } from './Schema';

export class OneOfSchema extends Schema {
  oneOf: (Schema | SchemaReference)[];

  constructor(parent: SchemaParent) {
    super(parent, 'oneOf');
    this.oneOf = [];
  }
}
