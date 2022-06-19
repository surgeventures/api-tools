import { Schema, SchemaParent, SchemaReference } from './Schema';

export class AnyOfSchema extends Schema {
  anyOf: (Schema | SchemaReference)[];

  constructor(parent: SchemaParent) {
    super(parent, 'anyOf');
    this.anyOf = [];
  }
}
