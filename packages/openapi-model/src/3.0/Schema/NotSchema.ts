import { ObjectSchema } from './ObjectSchema';
import { Schema, SchemaParent, SchemaReference } from './Schema';

export class NotSchema extends Schema {
  not: Schema | SchemaReference;

  constructor(parent: SchemaParent) {
    super(parent, 'not');
    this.not = new ObjectSchema(this);
  }
}
