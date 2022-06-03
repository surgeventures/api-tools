import { BasicNode } from '../BasicNode';

import type { Components } from '../Components';
import type { Discriminator } from '../Discriminator';
import type { ExternalDocumentation } from '../ExternalDocumentation';
import type { Header } from '../Header';
import type { MediaType } from '../MediaType';
import type { Parameter } from '../Parameter';
import type { Reference } from '../Reference';
import type { XML } from '../XML';
import type { ISchemaBase } from './types';
import type { CommonMarkString, JSONValue, Nullable } from '@fresha/api-tools-core';

export type SchemaType =
  | 'boolean'
  | 'object'
  | 'array'
  | 'integer'
  | 'number'
  | 'string'
  | 'allOf'
  | 'anyOf'
  | 'oneOf'
  | 'not';

export type SchemaFormat =
  | 'int32'
  | 'int64'
  | 'float'
  | 'double'
  | 'byte'
  | 'binary'
  | 'date'
  | 'date-time'
  | 'password';

export type SchemaParent = Components | MediaType | Parameter | Header | Schema;

export type SchemaReference = Reference<Schema, SchemaParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#schema-object
 */
export abstract class Schema extends BasicNode<SchemaParent> implements ISchemaBase {
  readonly type: SchemaType;
  title: Nullable<string>;
  description: Nullable<CommonMarkString>;
  format: Nullable<SchemaFormat>;
  nullable: boolean;
  discriminator: Nullable<Discriminator>;
  readOnly: boolean;
  writeOnly: boolean;
  xml: Nullable<XML>;
  externalDocs: Nullable<ExternalDocumentation>;
  example: JSONValue;
  deprecated: boolean;
  default: JSONValue;

  constructor(parent: SchemaParent, type: SchemaType) {
    super(parent);
    this.type = type;
    this.title = null;
    this.description = null;
    this.format = null;
    this.nullable = false;
    this.discriminator = null;
    this.readOnly = false;
    this.writeOnly = false;
    this.xml = null;
    this.externalDocs = null;
    this.example = null;
    this.deprecated = false;
    this.default = null;
  }
}
