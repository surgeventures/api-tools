import type { ISchema, SchemaType } from './Schema/types';
import type {
  CommonMarkString,
  EmailString,
  JSONValue,
  Nullable,
  URLString,
  VersionString,
} from '@fresha/api-tools-core';

export type OpenApiVersion = '3.0.3';
export type ParametrisedURLString = string; // URLString with interpolations, like /list/{from}/{to}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#reference-object
 */
export interface IReference<T> {
  ref: string;
  resolve(): T;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#specification-extensions
 */
export interface ISpecificationExtensions {
  readonly extensionFields: Map<string, JSONValue>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#contact-object
 */
export interface IContact extends ISpecificationExtensions {
  name: Nullable<string>;
  url: Nullable<string>;
  email: Nullable<EmailString>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#license-object
 */
export interface ILicense extends ISpecificationExtensions {
  name: string;
  url: Nullable<URLString>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#info-object
 */
export interface IInfo extends ISpecificationExtensions {
  title: string;
  description: Nullable<CommonMarkString>;
  termsOfService: Nullable<URLString>;
  readonly contact: IContact;
  readonly license: ILicense;
  version: VersionString;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#server-variable-object
 */
export interface IServerVariable extends ISpecificationExtensions {
  enum: Nullable<string[]>;
  default: string;
  description: Nullable<CommonMarkString>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#server-object
 */
export interface IServer extends ISpecificationExtensions {
  url: string;
  description: Nullable<CommonMarkString>;
  readonly variables: ReadonlyMap<string, IServerVariable>;

  setVariableDefault(name: string, value: string): void;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#external-documentation-object
 */
export interface IExternalDocumentation extends ISpecificationExtensions {
  description: Nullable<CommonMarkString>;
  url: URLString;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export interface IParameterBase extends ISpecificationExtensions {
  name: string;
  description: Nullable<CommonMarkString>;
  deprecated: boolean;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export interface IPathParameter extends IParameterBase {
  readonly in: 'path';
  readonly required: true;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export interface IQueryParameter extends IParameterBase {
  readonly in: 'query';
  required: boolean;
  allowEmptyValue: boolean;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export interface IHeaderParameter extends IParameterBase {
  readonly in: 'header';
  required: boolean;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export interface ICookieParameter extends IParameterBase {
  readonly in: 'cookie';
  required: boolean;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export type IParameter = IPathParameter | IQueryParameter | IHeaderParameter | ICookieParameter;

export type ParameterLocation = IParameter['in'];

/**
 * @see https://spec.openapis.org/oas/v3.0.3#example-object
 */
export interface IExample extends ISpecificationExtensions {
  summary: Nullable<string>;
  description: Nullable<CommonMarkString>;
  value: unknown;
  externalValue: Nullable<string>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#header-object
 */
export interface IHeader extends ISpecificationExtensions {
  description: Nullable<CommonMarkString>;
  required: boolean;
  deprecated: boolean;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#encoding-object
 */
export interface IEncoding extends ISpecificationExtensions {
  contentType: Nullable<string>;
  // headers: Map<string, Header>;
  style: Nullable<string>;
  explode: boolean;
  allowReserved: boolean;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#media-type-object
 */
export interface IMediaType extends ISpecificationExtensions {
  schema: Nullable<ISchema>;
  example: unknown;
  // examples: Map<string, Example>;
  encoding: Map<string, IEncoding>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#request-body-object
 */
export interface IRequestBody extends ISpecificationExtensions {
  description: Nullable<CommonMarkString>;
  readonly content: Map<string, IMediaType>;
  required: boolean;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#response-object
 */
export interface IResponse extends ISpecificationExtensions {
  description: CommonMarkString;
  readonly headers: Map<string, IHeader>; // key = HTTP header name
  readonly content: Map<string, IMediaType>; // key = MIME media type
  // readonly links: Map<string, Link>; // key = short name of the link
}

export type HTTPStatusCode = number | string;

/**
 * @see https://spec.openapis.org/oas/v3.0.3#responses-object
 */
export interface IResponses extends ISpecificationExtensions {
  default: Nullable<IResponse>;
  readonly codes: ReadonlyMap<HTTPStatusCode, IResponse>;

  addResponse(code: HTTPStatusCode, description: CommonMarkString): IResponse;
  removeResponse(code: HTTPStatusCode): void;
  clearResponses(): void;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#operation-object
 */
export interface IOperation extends ISpecificationExtensions {
  readonly tags: ReadonlyArray<string>;
  summary: Nullable<string>;
  description: Nullable<CommonMarkString>;
  externalDocs: Nullable<IExternalDocumentation>;
  operationId: Nullable<string>;
  // readonly parameters: ReadonlyArray<IParameter>;
  requestBody: Nullable<IRequestBody | IReference<IRequestBody>>;
  readonly responses: IResponses;

  addTag(name: string): void;
  removeTag(name: string): void;
  removeTagAt(index: number): void;
  clearTags(): void;
}

export type HTTPMethod = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace';

/**
 * @see https://spec.openapis.org/oas/v3.0.3#paths-object
 */
export interface IPathItem extends ISpecificationExtensions {
  summary: Nullable<string>;
  description: Nullable<CommonMarkString>;
  get: Nullable<IOperation>;
  put: Nullable<IOperation>;
  post: Nullable<IOperation>;
  delete: Nullable<IOperation>;
  options: Nullable<IOperation>;
  head: Nullable<IOperation>;
  patch: Nullable<IOperation>;
  trace: Nullable<IOperation>;
  servers: Nullable<IServer[]>;
  // parameters: Nullable<IParameter[]>;

  addOperation(method: HTTPMethod): IOperation;
  removeOperation(method: HTTPMethod): void;
  clearOperations(): void;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#paths-object
 */
export interface IPaths extends Map<ParametrisedURLString, IPathItem>, ISpecificationExtensions {}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export interface ISecuritySchemaBase extends ISpecificationExtensions {
  description: Nullable<CommonMarkString>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export interface IAPIKeySecuritySchema extends ISecuritySchemaBase {
  readonly type: 'apiKey';
  name: string;
  in: 'query' | 'header' | 'cookie';
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export interface IHTTPSecuritySchema extends ISecuritySchemaBase {
  readonly type: 'http';
  description: Nullable<CommonMarkString>;
  scheme: string;
  bearerFormat: Nullable<string>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#oauth-flow-object
 */
interface IOAuthFlowBase extends ISpecificationExtensions {
  refreshUrl: Nullable<URLString>;
  readonly scopes: Map<string, string>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#oauth-flow-object
 */
export interface IOAuthImplicitFlow extends IOAuthFlowBase {
  authorizationUrl: URLString;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#oauth-flow-object
 */
export interface IOAuthPasswordFlow extends IOAuthFlowBase {
  tokenUrl: URLString;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#oauth-flow-object
 */
export interface IOAuthClientCredentialsFlow extends IOAuthFlowBase {
  tokenUrl: URLString;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#oauth-flow-object
 */
export interface IOAuthAuthorizationCodeFlow extends IOAuthFlowBase {
  authorizationUrl: URLString;
  tokenUrl: URLString;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#oauth-flows-object
 */
export interface IOAuthFlows extends ISpecificationExtensions {
  implicit: Nullable<IOAuthImplicitFlow>;
  password: Nullable<IOAuthPasswordFlow>;
  clientCredentials: Nullable<IOAuthClientCredentialsFlow>;
  authorizationCode: Nullable<IOAuthAuthorizationCodeFlow>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export interface IOAuth2SecuritySchema extends ISecuritySchemaBase {
  readonly type: 'oauth2';
  readonly flows: IOAuthFlows;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export interface IOpenIDConnectSecuritySchema extends ISecuritySchemaBase {
  readonly type: 'openIdConnect';
  openIdConnectUrl: URLString;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#security-scheme-object
 */
export type ISecuritySchema =
  | IAPIKeySecuritySchema
  | IHTTPSecuritySchema
  | IOAuth2SecuritySchema
  | IOpenIDConnectSecuritySchema;

export type SecuritySchemeType = ISecuritySchema['type'];

/**
 * @see https://spec.openapis.org/oas/v3.0.3#link-object
 */
export interface ILink extends ISpecificationExtensions {
  operationRef: Nullable<string>;
  operationId: Nullable<string>;
  readonly parameters: Map<string, unknown>;
  requestBody: unknown;
  description: Nullable<CommonMarkString>;
  server: Nullable<IServer>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#callback-object
 */
export interface ICallback extends ISpecificationExtensions {
  paths: Map<ParametrisedURLString, IPathItem>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#components-object
 */
export interface IComponents extends ISpecificationExtensions {
  readonly schemas: ReadonlyMap<string, ISchema | IReference<ISchema>>;
  readonly responses: ReadonlyMap<string, IResponse | IReference<IResponse>>;
  readonly parameters: Map<string, IParameter | IReference<IParameter>>;
  readonly examples: ReadonlyMap<string, IExample | IReference<IExample>>;
  readonly requestBodies: ReadonlyMap<string, IRequestBody | IReference<IRequestBody>>;
  readonly headers: ReadonlyMap<string, IHeader | IReference<IHeader>>;
  readonly securitySchemas: ReadonlyMap<string, ISecuritySchema | IReference<ISecuritySchema>>;
  readonly links: ReadonlyMap<string, ILink | IReference<ILink>>;
  readonly callbacks: ReadonlyMap<string, ICallback | IReference<ICallback>>;

  addSchema(name: string, type: SchemaType): ISchema;
  removeSchema(name: string): void;
  clearSchemas(): void;

  addResponse(name: string, description: CommonMarkString): IResponse;
  removeResponse(name: string): void;
  clearResponses(): void;

  addParameter(name: string, kind: IParameter['in'], paramName: string): IParameter;
  removeParameter(name: string): void;
  clearParameters(): void;

  addExample(name: string): IExample;
  removeExample(name: string): void;
  clearExamples(): void;

  addRequestBody(name: string): IRequestBody;
  removeRequestBody(name: string): void;
  clearRequestBodies(): void;

  addHeader(name: string): IHeader;
  removeHeader(name: string): void;
  clearHeaders(): void;

  addSecuritySchema(name: string, kind: ISecuritySchema['type']): ISecuritySchema;
  removeSecuritySchema(name: string): void;
  clearSecuritySchemas(): void;

  addLink(name: string): ILink;
  removeLink(name: string): void;
  clearLinks(): void;

  addCallback(name: string): ICallback;
  removeCallback(name: string): void;
  clearCallbacks(): void;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#security-requirement-object
 */
export interface ISecurityRequirement extends ISpecificationExtensions {
  scopes: Map<string, string[]>;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#tag-object
 */
export interface ITag extends ISpecificationExtensions {
  name: string;
  description: Nullable<CommonMarkString>;
  externalDocs: Nullable<IExternalDocumentation>;
}

/**
 * @see http://spec.openapis.org/oas/v3.0.3#xml-object
 */
export interface IXML extends ISpecificationExtensions {
  name: Nullable<string>;
  namespace: Nullable<string>;
  prefix: Nullable<string>;
  attribute: boolean;
  wrapped: boolean;
}

/**
 * @see https://spec.openapis.org/oas/v3.0.3#version-3.0.3
 */
export interface IOpenAPI extends ISpecificationExtensions {
  readonly openapi: OpenApiVersion;
  readonly info: IInfo;
  readonly servers: ReadonlyArray<IServer>; // by default it contains a server with '/' url
  readonly paths: IPaths;
  readonly components: IComponents;
  readonly tags: ReadonlyArray<ITag>;
  readonly externalDocs: Nullable<IExternalDocumentation>;

  addServer(
    url: ParametrisedURLString,
    variableDefaults?: Record<string, string>,
    description?: CommonMarkString,
  ): IServer;
  removeServerAt(index: number): void;
  clearServers(): void;

  addPathItem(url: ParametrisedURLString): IPathItem;
  removePathItem(url: ParametrisedURLString): void;
  clearPathItems(): void;

  addTag(name: string): ITag;
  removeTag(name: string): void;
  removeTagAt(index: number): void;
  clearTags(): void;
}
