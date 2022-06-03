import { BasicNode } from '../BasicNode';

import type { Components } from '../Components';
import type { Example, ExampleReference } from '../Example';
import type { MediaType } from '../MediaType';
import type { Operation } from '../Operation';
import type { PathItem } from '../PathItem';
import type { Reference } from '../Reference';
import type { Schema, SchemaReference } from '../Schema';
import type { ParameterLocation } from '../types';
import type { JSONValue, Nullable } from '@fresha/api-tools-core';

export type ParameterParent = Components | PathItem | Operation;
export type ParameterReference = Reference<Parameter, ParameterParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export class Parameter extends BasicNode<ParameterParent> {
  readonly in: ParameterLocation;
  readonly name: string;
  description: Nullable<string>;
  deprecated: boolean;
  schema: Nullable<Schema | SchemaReference>;
  content: Map<string, MediaType>;
  example: JSONValue;
  examples: Map<string, Example | ExampleReference>;
  required: boolean;

  constructor(parent: ParameterParent, location: ParameterLocation, name: string) {
    super(parent);
    this.name = name;
    this.in = location;
    this.description = null;
    this.deprecated = false;
    this.schema = null;
    this.content = new Map<string, MediaType>();
    this.example = null;
    this.examples = new Map<string, Example>();
    this.required = false;
  }
}
