import { ObjectSchema } from './ObjectSchema';
import { Schema, SchemaParent, SchemaReference } from './Schema';

export class ArraySchema extends Schema {
  items: Schema | SchemaReference;

  constructor(parent: SchemaParent) {
    super(parent, 'array');
    this.items = new ObjectSchema(this);
  }
}
