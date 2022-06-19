import { BasicNode } from './BasicNode';

import type { Components } from './Components';
import type { Encoding } from './Encoding';
import type { Example, ExampleReference } from './Example';
import type { MediaType } from './MediaType';
import type { Reference } from './Reference';
import type { Response } from './Response';
import type { Schema, SchemaReference } from './Schema';
import type { IHeader } from './types';
import type { Nullable, JSONValue } from '@fresha/api-tools-core';

export type HeaderParent = Components | Response | Encoding;

export type HeaderReference = Reference<Header, HeaderParent>;

export type SerializationStyle = 'simple';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#header-object
 */
export class Header extends BasicNode<HeaderParent> implements IHeader {
  description: Nullable<string>;
  required: boolean;
  deprecated: boolean;
  style: SerializationStyle;
  explode: boolean;
  schema: Nullable<Schema | SchemaReference>;
  example: JSONValue;
  examples: Map<string, Example | ExampleReference>;
  content: Map<string, MediaType>;

  constructor(parent: HeaderParent) {
    super(parent);
    this.description = null;
    this.required = false;
    this.deprecated = false;
    this.style = 'simple';
    this.explode = false;
    this.schema = null;
    this.example = null;
    this.examples = new Map<string, Example>();
    this.content = new Map<string, MediaType>();
  }
}
