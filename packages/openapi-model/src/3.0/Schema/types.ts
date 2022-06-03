import type { JSONValue, Nullable } from '@fresha/api-tools-core';

/**
 * @see https://spec.openapis.org/oas/v3.0.3#specification-extensions
 */
export interface ISpecificationExtensions {
  readonly extensionFields: Map<string, JSONValue>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#schema-object
 */
export interface ISchemaBase extends ISpecificationExtensions {
  title: string;
  description: Nullable<string>;
}

export interface IAllOfSchema extends ISchemaBase {
  readonly type: 'allOf';
}

export interface IAnyOfSchema extends ISchemaBase {
  readonly type: 'anyOf';
}

export interface IArraySchema extends ISchemaBase {
  readonly type: 'array';
}

export interface IBooleanSchema extends ISchemaBase {
  readonly type: 'boolean';
}

export interface IIntegerSchema extends ISchemaBase {
  readonly type: 'integer';
}

export interface INotSchema extends ISchemaBase {
  readonly type: 'not';
}

export interface INumberSchema extends ISchemaBase {
  readonly type: 'number';
}

export interface IObjectSchema extends ISchemaBase {
  readonly type: 'object';
}

export interface IOneOfSchema extends ISchemaBase {
  readonly type: 'oneOf';
}

export interface IStringSchema extends ISchemaBase {
  readonly type: 'string';
}

export type ISchema =
  | IAllOfSchema
  | IAnyOfSchema
  | IArraySchema
  | IBooleanSchema
  | INotSchema
  | INumberSchema
  | IObjectSchema
  | IOneOfSchema
  | IStringSchema;

export type SchemaType = ISchema['type'];
