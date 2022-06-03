import { BasicNode } from './BasicNode';

import type { Encoding } from './Encoding';
import type { Example, ExampleReference } from './Example';
import type { Parameter } from './Parameter';
import type { Reference } from './Reference';
import type { RequestBody } from './RequestBody';
import type { Response } from './Response';
import type { Schema, SchemaReference } from './Schema';
import type { IMediaType } from './types';
import type { Nullable, JSONValue } from '@fresha/api-tools-core';

export type MediaTypeParent = Parameter | RequestBody | Response;

export type MediaTypeReference = Reference<MediaType, MediaTypeParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#media-type-object
 */
export class MediaType extends BasicNode<MediaTypeParent> implements IMediaType {
  schema: Nullable<Schema | SchemaReference>;
  example: JSONValue;
  examples: Map<string, Example | ExampleReference>;
  encoding: Map<string, Encoding>;

  constructor(parent: MediaTypeParent) {
    super(parent);
    this.schema = null;
    this.example = null;
    this.examples = new Map<string, Example | ExampleReference>();
    this.encoding = new Map<string, Encoding>();
  }
}
