import { Schema, SchemaParent, SchemaReference } from './Schema';

export class AllOfSchema extends Schema {
  allOf: (Schema | SchemaReference)[];

  constructor(parent: SchemaParent) {
    super(parent, 'allOf');
    this.allOf = [];
  }
}
