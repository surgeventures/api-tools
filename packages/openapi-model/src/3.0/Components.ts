import { BasicNode } from './BasicNode';
import { Callback, CallbackReference } from './Callback';
import { Example, ExampleReference } from './Example';
import { Header, HeaderReference } from './Header';
import { Link, LinkReference } from './Link';
import { CookieParameter } from './Parameter/CookieParameter';
import { HeaderParameter } from './Parameter/HeaderParameter';
import { ParameterParent } from './Parameter/Parameter';
import { PathParameter } from './Parameter/PathParameter';
import { QueryParameter } from './Parameter/QueryParameter';
import { Reference } from './Reference';
import { RequestBody, RequestBodyReference } from './RequestBody';
import { Response, ResponseReference } from './Response';
import { ObjectSchema } from './Schema/ObjectSchema';
import { ApiKeyScheme } from './SecurityScheme/ApiKeyScheme';
import { HttpScheme } from './SecurityScheme/HttpScheme';
import { OAuth2Scheme } from './SecurityScheme/OAuth2Scheme';
import { OpenIdConnectScheme } from './SecurityScheme/OpenIdConnectScheme';

import type { OpenAPI } from './OpenAPI';
import type { Schema, SchemaReference } from './Schema';
import type { SecurityScheme, SecuritySchemeReference } from './SecurityScheme';
import type {
  ICallback,
  IComponents,
  IExample,
  IHeader,
  ILink,
  IParameter,
  IRequestBody,
  IResponse,
  ISecuritySchema,
} from './types';
import type { CommonMarkString } from '@fresha/api-tools-core';

type AllParameters = PathParameter | QueryParameter | HeaderParameter | CookieParameter;
type AllParametersReference = Reference<AllParameters, ParameterParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#components-object
 */
export class Components extends BasicNode<OpenAPI> implements IComponents {
  schemas: Map<string, Schema | SchemaReference>;
  responses: Map<string, Response | ResponseReference>;
  parameters: Map<string, AllParameters | AllParametersReference>;
  examples: Map<string, Example | ExampleReference>;
  requestBodies: Map<string, RequestBody | RequestBodyReference>;
  headers: Map<string, Header | HeaderReference>;
  securitySchemas: Map<string, SecurityScheme | SecuritySchemeReference>;
  links: Map<string, Link | LinkReference>;
  callbacks: Map<string, Callback | CallbackReference>;

  constructor(parent: OpenAPI) {
    super(parent);
    this.schemas = new Map<string, Schema | SchemaReference>();
    this.responses = new Map<string, Response | ResponseReference>();
    this.parameters = new Map<string, AllParameters | AllParametersReference>();
    this.examples = new Map<string, Example | ExampleReference>();
    this.requestBodies = new Map<string, RequestBody | RequestBodyReference>();
    this.headers = new Map<string, Header | HeaderReference>();
    this.securitySchemas = new Map<string, SecurityScheme | SecuritySchemeReference>();
    this.links = new Map<string, Link | LinkReference>();
    this.callbacks = new Map<string, Callback | CallbackReference>();
  }

  isEmpty(): boolean {
    return (
      !this.schemas.size &&
      !this.responses.size &&
      !this.parameters.size &&
      !this.examples.size &&
      !this.requestBodies.size &&
      !this.headers.size &&
      !this.securitySchemas.size &&
      !this.links.size &&
      !this.callbacks.size
    );
  }

  addSchema(name: string): ISchema {
    const result = new ObjectSchema(this);
    this.schemas.set(name, result);
    return result;
  }

  removeSchema(name: string): void {
    this.schemas.delete(name);
  }

  clearSchemas(): void {
    this.schemas.clear();
  }

  addResponse(name: string, description: CommonMarkString): IResponse {
    const result = new Response(this, description);
    this.responses.set(name, result);
    return result;
  }

  removeResponse(name: string): void {
    this.responses.delete(name);
  }

  clearResponses(): void {
    this.responses.clear();
  }

  addParameter(name: string, kind: IParameter['in'], paramName: string): IParameter {
    let result: PathParameter | QueryParameter | HeaderParameter | CookieParameter;
    switch (kind) {
      case 'path':
        result = new PathParameter(this, paramName);
        break;
      case 'query':
        result = new QueryParameter(this, paramName);
        break;
      case 'header':
        result = new HeaderParameter(this, paramName);
        break;
      case 'cookie':
        result = new CookieParameter(this, paramName);
        break;
      default:
        throw new Error(`Unknown parameter type ${String(kind)}`);
    }
    this.parameters.set(name, result);
    return result;
  }

  removeParameter(name: string): void {
    this.parameters.delete(name);
  }

  clearParameters(): void {
    this.parameters.clear();
  }

  addExample(name: string): IExample {
    const example = new Example(this);
    this.examples.set(name, example);
    return example;
  }

  removeExample(name: string): void {
    this.examples.delete(name);
  }

  clearExamples(): void {
    this.examples.clear();
  }

  addRequestBody(name: string): IRequestBody {
    const result = new RequestBody(this);
    this.requestBodies.set(name, result);
    return result;
  }

  removeRequestBody(name: string): void {
    this.requestBodies.delete(name);
  }

  clearRequestBodies(): void {
    this.requestBodies.clear();
  }

  addHeader(name: string): IHeader {
    const result = new Header(this);
    this.headers.set(name, result);
    return result;
  }

  removeHeader(name: string): void {
    this.headers.delete(name);
  }

  clearHeaders(): void {
    this.headers.clear();
  }

  addSecuritySchema(name: string, kind: ISecuritySchema['type']): ISecuritySchema {
    let result: SecurityScheme;
    switch (kind) {
      case 'apiKey':
        result = new ApiKeyScheme(this, 'x', 'header');
        break;
      case 'http':
        result = new HttpScheme(this, 'Bearer');
        break;
      case 'oauth2':
        result = new OAuth2Scheme(this);
        break;
      case 'openIdConnect':
        result = new OpenIdConnectScheme(this, 'http://www.example.com');
        break;
      default:
        throw new Error(`Unsupported security scheme type ${String(kind)}`);
    }
    this.securitySchemas.set(name, result);
    return result;
  }

  removeSecuritySchema(name: string): void {
    this.securitySchemas.delete(name);
  }

  clearSecuritySchemas(): void {
    this.securitySchemas.clear();
  }

  addLink(name: string): ILink {
    const result = new Link(this);
    this.links.set(name, result);
    return result;
  }

  removeLink(name: string): void {
    this.links.delete(name);
  }

  clearLinks(): void {
    this.links.clear();
  }

  addCallback(name: string): ICallback {
    const result = new Callback(this);
    this.callbacks.set(name, result);
    return result;
  }

  removeCallback(name: string): void {
    this.callbacks.delete(name);
  }

  clearCallbacks(): void {
    this.callbacks.clear();
  }
}
