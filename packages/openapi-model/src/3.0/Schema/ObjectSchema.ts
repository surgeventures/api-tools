import { Schema, SchemaParent, SchemaReference } from './Schema';

export class ObjectSchema extends Schema {
  properties: Map<string, Schema | SchemaReference>;
  required: string[];
  additionalProperties: Schema | SchemaReference | boolean;

  constructor(parent: SchemaParent) {
    super(parent, 'object');
    this.properties = new Map<string, Schema>();
    this.required = [];
    this.additionalProperties = true;
  }
}
