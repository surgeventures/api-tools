import { Callback, CallbackParent } from './Callback';
import { Components } from './Components';
// import { XML, XMLParent } from './XML';
// import { Discriminator } from './Discriminator';
import { Contact } from './Contact';
import {
  Encoding,
  EncodingParent,
  SerializationStyle as EncodingSerializationStyle,
} from './Encoding';
import { Example, ExampleParent } from './Example';
import { ExternalDocumentation, ExternalDocumentationParent } from './ExternalDocumentation';
import { Header, HeaderParent, SerializationStyle as HeaderSerializationStyle } from './Header';
import { Info, InfoParent } from './Info';
import { License, LicenseParent } from './License';
import { Link, LinkParent, LinkReference } from './Link';
import { MediaType, MediaTypeParent } from './MediaType';
import { OAuthFlow, OAuthFlowParent } from './OAuthFlow';
import { OAuthAuthorisationCodeFlow } from './OAuthFlow/OAuthAuthorisationCodeFlow';
import { OAuthClientCredentialsFlow } from './OAuthFlow/OAuthClientCredentialsFlow';
import { OAuthImplicitFlow } from './OAuthFlow/OAuthImplicitFlow';
import { OAuthPasswordFlow } from './OAuthFlow/OAuthPasswordFlow';
import { OpenAPI } from './OpenAPI';
import { Operation, OperationParent } from './Operation';
import {
  CookieParameter,
  SerializationStyle as CookieParameterSerializationStyle,
} from './Parameter/CookieParameter';
import {
  HeaderParameter,
  SerializationStyle as HeaderParameterSerializationStyle,
} from './Parameter/HeaderParameter';
import { Parameter, ParameterParent } from './Parameter/Parameter';
import {
  PathParameter,
  SerializationStyle as PathParameterSerializationStyle,
} from './Parameter/PathParameter';
import {
  QueryParameter,
  SerializationStyle as QueryParameterSerializationStyle,
} from './Parameter/QueryParameter';
import { defaultExplode } from './Parameter/utils';
import { PathItem, httpMethods, PathItemParent, whitelistedProperties } from './PathItem';
import { Reference } from './Reference';
import { RequestBody, RequestBodyParent } from './RequestBody';
import { Response, ResponseParent } from './Response';
import { Schema } from './Schema';
import { AllOfSchema } from './Schema/AllOfSchema';
import { AnyOfSchema } from './Schema/AnyOfSchema';
import { ArraySchema } from './Schema/ArraySchema';
import { BooleanSchema } from './Schema/BooleanSchema';
import { NotSchema } from './Schema/NotSchema';
import { NumberSchema } from './Schema/NumberSchema';
import { ObjectSchema } from './Schema/ObjectSchema';
import { OneOfSchema } from './Schema/OneOfSchema';
import { SchemaFormat, SchemaParent, SchemaReference } from './Schema/Schema';
import { StringSchema } from './Schema/StringSchema';
import { SecurityRequirement, SecurityRequirementParent } from './SecurityRequirement';
import { SecurityScheme, SecuritySchemeParent } from './SecurityScheme';
import { ApiKeyScheme } from './SecurityScheme/ApiKeyScheme';
import { HttpScheme } from './SecurityScheme/HttpScheme';
import { OAuth2Scheme } from './SecurityScheme/OAuth2Scheme';
import { OpenIdConnectScheme } from './SecurityScheme/OpenIdConnectScheme';
import { Server, ServerParent } from './Server';
import { Tag, TagParent } from './Tag';

import type { ExtensionFields, TreeParent } from './BasicNode';
import type { ServerVariable } from './ServerVariable';
import type { HTTPMethod } from './types';
import type { Nullable, JSONObject, JSONArray } from '@fresha/api-tools-core';

const isEmpty = (obj: JSONObject): boolean => {
  return !obj || !Object.keys(obj).length;
};

const getStringAttribute = (json: JSONObject, name: string, required = true): Nullable<string> => {
  const result = json[name];
  if (typeof result === 'string') {
    return result;
  }
  if (!required && result == null) {
    return null;
  }
  throw new Error(
    `Property ${name} is expected to be a string, but it is ${typeof result} instead`,
  );
};

export class OpenAPIReader {
  parse(json: JSONObject): OpenAPI {
    const result = new OpenAPI(json.title as string, json.version as string);

    this.parseExtensionFields(json, result.extensionFields);

    result.info = this.parseInfo(json.info as JSONObject, result);

    if (json.servers) {
      result.servers = (json.servers as JSONArray).map(item =>
        this.parseServer(item as JSONObject, result),
      );
    }

    result.components = this.parseComponents(json.components as JSONObject, result);

    for (const [path, pathItemJson] of Object.entries(json.paths as JSONObject)) {
      const pathItem = this.parsePathItem(pathItemJson as JSONObject, result.paths);
      result.paths.set(path, pathItem);
    }

    if ('security' in json) {
      result.security = this.parseSecurityRequirement(json.security as JSONObject, result);
    }

    if ((json.tags as JSONArray)?.length) {
      for (const tagJson of json.tags as JSONArray) {
        const tag = this.parseTag(tagJson as JSONObject, result);
        result.tags.push(tag);
      }
    }

    if (json.externalDocs) {
      result.externalDocs = this.parseExternalDocumentation(
        json.externalDocs as JSONObject,
        result,
      );
    }

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  private parseExtensionFields(
    json: JSONObject,
    extensionFields: ExtensionFields,
    reset = false,
  ): void {
    if (reset) {
      extensionFields.clear();
    }
    for (const [key, value] of Object.entries(json)) {
      if (key.startsWith('x-')) {
        extensionFields.set(key.slice(2), value);
      }
    }
  }

  private parseInfo(json: JSONObject, parent: InfoParent): Info {
    if (json == null) {
      throw new Error('Info is required');
    }
    const result = new Info(
      parent,
      getStringAttribute(json, 'title') as string,
      getStringAttribute(json, 'version') as string,
    );
    this.parseExtensionFields(json, result.extensionFields);
    result.description = getStringAttribute(json, 'description', false) as string;
    result.termsOfService = getStringAttribute(json, 'termsOfService', false) as string;
    this.parseContact(json.contact as JSONObject, result);
    this.parseLicense(json.license as JSONObject, result);
    return result;
  }

  private parseContact(json: JSONObject, parent: Info): Nullable<Contact> {
    if (isEmpty(json)) {
      return null;
    }
    const result = parent.contact;
    this.parseExtensionFields(json, result.extensionFields);
    result.name = getStringAttribute(json, 'name', false);
    result.url = getStringAttribute(json, 'url', false);
    result.email = getStringAttribute(json, 'email', false);
    return result;
  }

  private parseLicense(json: JSONObject, parent: LicenseParent): Nullable<License> {
    if (json == null) {
      return null;
    }

    const result = parent.license;
    this.parseExtensionFields(json, result.extensionFields);
    result.name = getStringAttribute(json, 'name') as string;
    result.url = getStringAttribute(json, 'url', false);
    return result;
  }

  private parseServer(json: JSONObject, parent: ServerParent): Server {
    const url = getStringAttribute(json, 'url') as string;
    const result = new Server(parent, url);
    this.parseExtensionFields(json, result.extensionFields);
    result.description = getStringAttribute(json, 'description', false);
    if (json.variables) {
      for (const [key, value] of Object.entries(json.variables as JSONObject)) {
        const variable = result.variables.get(key);
        if (!variable) {
          throw new Error(`Missing server variable named ${key}`);
        }
        this.parseServerVariable(value as JSONObject, variable);
      }
    }
    return result;
  }

  private parseServerVariable(json: JSONObject, variable: ServerVariable): void {
    this.parseExtensionFields(json, variable.extensionFields);
    variable.default = getStringAttribute(json, 'default') as string;
    if (Array.isArray(json.enum) && json.enum.length) {
      variable.enum = (json.enum as string[]).slice();
    }
    variable.description = getStringAttribute(json, 'description', false);
  }

  private parseComponents(json: JSONObject, parent: OpenAPI): Components {
    const result = new Components(parent);

    if (!json) {
      return result;
    }

    this.parseExtensionFields(json, result.extensionFields);

    for (const [key, schemaJson] of Object.entries((json.schemas || {}) as JSONObject)) {
      const schema = this.parseSchema(schemaJson as JSONObject, result);
      result.schemas.set(key, schema);
    }

    for (const [key, responseJson] of Object.entries((json.responses || {}) as JSONObject)) {
      const response = this.parseResponse(responseJson as JSONObject, result);
      result.responses.set(key, response);
    }

    for (const [key, parameterJson] of Object.entries((json.parameters || {}) as JSONObject)) {
      const parameter = this.parseParameter(parameterJson as JSONObject, result);
      result.parameters.set(key, parameter as PathParameter);
    }

    for (const [key, exampleJson] of Object.entries((json.examples || {}) as JSONObject)) {
      const example = this.parseExample(exampleJson as JSONObject, result);
      result.examples.set(key, example);
    }

    for (const [key, requestBodyJson] of Object.entries((json.requestBodies || {}) as JSONObject)) {
      const requestBody = this.parseRequestBody(requestBodyJson as JSONObject, result);
      result.requestBodies.set(key, requestBody);
    }

    for (const [key, headerJson] of Object.entries((json.headers || {}) as JSONObject)) {
      const header = this.parseHeader(headerJson as JSONObject, result);
      result.headers.set(key, header);
    }

    for (const [key, securitySchemeJson] of Object.entries(
      (json.securitySchemas || {}) as JSONObject,
    )) {
      const securityScheme = this.parseSecurityScheme(securitySchemeJson as JSONObject, result);
      result.securitySchemas.set(key, securityScheme);
    }

    for (const [key, linkJson] of Object.entries((json.links || {}) as JSONObject)) {
      const link = this.parseLink(linkJson as JSONObject, result);
      result.links.set(key, link);
    }

    for (const [key, callbackJson] of Object.entries((json.callbacks || {}) as JSONObject)) {
      const callback = this.parseCallback(callbackJson as JSONObject, result);
      result.callbacks.set(key, callback);
    }

    return result;
  }

  private parseSchema(json: JSONObject, parent: SchemaParent): Schema | SchemaReference {
    const ref = this.parseReference<Schema, SchemaParent>(json, parent);
    if (ref) {
      return ref;
    }

    if (json.allOf) {
      return this.parseAllOfSchema(json, parent);
    }
    if (json.anyOf) {
      return this.parseAnyOfSchema(json, parent);
    }
    if (json.oneOf) {
      return this.parseOneOfSchema(json, parent);
    }
    if (json.not) {
      return this.parseNotSchema(json, parent);
    }
    if (json.type === 'array') {
      return this.parseArraySchema(json, parent);
    }
    if (json.type === 'object') {
      return this.parseObjectSchema(json, parent);
    }
    if (json.type === 'boolean') {
      return this.parseBooleanSchema(json, parent);
    }
    if (json.type === 'number' || json.type === 'integer') {
      return this.parseNumberSchema(json, parent);
    }
    if (json.type === 'string') {
      return this.parseStringSchema(json, parent);
    }

    throw new Error(`Cannot parse schema ${JSON.stringify(json, null, 2)}`);
  }

  private parseReference<TNode, TParent extends TreeParent>(
    json: JSONObject,
    parent: TParent,
  ): Reference<TNode, TParent> | null {
    if (!json.$ref) {
      return null;
    }

    const result = new Reference<TNode, TParent>(parent, json.$ref as string);
    this.parseExtensionFields(json, result.extensionFields);
    return result;
  }

  private parseSchemaCommon(json: JSONObject, schema: Schema): void {
    this.parseExtensionFields(json, schema.extensionFields);
    schema.title = getStringAttribute(json, 'title', false);
    schema.description = getStringAttribute(json, 'description', false);
    schema.format = getStringAttribute(json, 'format', false) as SchemaFormat;
    if (json.nullable) {
      schema.nullable = json.nullable as boolean;
    }
    if ('default' in json) {
      schema.default = json.default;
    }
    if ('example' in json) {
      schema.example = json.example;
    }
  }

  private parseAllOfSchema(json: JSONObject, parent: SchemaParent): AllOfSchema {
    if (!json.allOf) {
      throw new Error('Missing allOf attribute');
    }

    const result = new AllOfSchema(parent);
    this.parseSchemaCommon(json, result);
    for (const subschemaJson of json.allOf as JSONArray) {
      const subschema = this.parseSchema(subschemaJson as JSONObject, result);
      result.allOf.push(subschema);
    }
    return result;
  }

  private parseAnyOfSchema(json: JSONObject, parent: SchemaParent): AnyOfSchema {
    if (!json.anyOf) {
      throw new Error('Missing anyOf attribute');
    }

    const result = new AnyOfSchema(parent);
    this.parseSchemaCommon(json, result);
    for (const subschemaJson of json.anyOf as JSONObject[]) {
      const subschema = this.parseSchema(subschemaJson, result);
      result.anyOf.push(subschema);
    }
    return result;
  }

  private parseOneOfSchema(json: JSONObject, parent: SchemaParent): OneOfSchema {
    if (!json.oneOf) {
      throw new Error('Missing oneOf attribute');
    }

    const result = new OneOfSchema(parent);
    this.parseSchemaCommon(json, result);
    for (const subschemaJson of json.anyOf as JSONObject[]) {
      const subschema = this.parseSchema(subschemaJson, result);
      result.oneOf.push(subschema);
    }
    return result;
  }

  private parseNotSchema(json: JSONObject, parent: SchemaParent): NotSchema {
    if (!json.not) {
      throw new Error('Missing not attribute');
    }

    const result = new NotSchema(parent);
    this.parseSchemaCommon(json, result);
    result.not = this.parseSchema(json.not as JSONObject, result);
    return result;
  }

  private parseArraySchema(json: JSONObject, parent: SchemaParent): ArraySchema {
    if (json.type !== 'array') {
      throw new Error('Expected array type');
    }

    const result = new ArraySchema(parent);
    this.parseSchemaCommon(json, result);
    result.items = this.parseSchema(json.items as JSONObject, result);
    return result;
  }

  private parseObjectSchema(json: JSONObject, parent: SchemaParent): ObjectSchema {
    if (json.type !== 'object') {
      throw new Error('Expected object type');
    }

    const result = new ObjectSchema(parent);
    this.parseSchemaCommon(json, result);
    if (json.required) {
      result.required = json.required as string[];
    }
    if (json.properties) {
      for (const [name, propertyJson] of Object.entries(json.properties as JSONObject)) {
        const property = this.parseSchema(propertyJson as JSONObject, result);
        result.properties.set(name, property);
      }
    }
    if (typeof json.additionalProperties === 'boolean') {
      result.additionalProperties = json.additionalProperties;
    } else if (json.additionalProperties) {
      result.additionalProperties = this.parseSchema(
        json.additionalProperties as JSONObject,
        result,
      );
    }
    return result;
  }

  private parseBooleanSchema(json: JSONObject, parent: SchemaParent): BooleanSchema {
    if (json.type !== 'boolean') {
      throw new Error('Expected boolean type');
    }

    const result = new BooleanSchema(parent);
    this.parseSchemaCommon(json, result);
    if (Array.isArray(json.enum) && json.enum.length) {
      result.enum = json.enum.map(elem => !!elem);
    }
    return result;
  }

  private parseNumberSchema(json: JSONObject, parent: SchemaParent): NumberSchema {
    if (json.type !== 'number' && json.type !== 'integer') {
      throw new Error('Expected number or integer types');
    }

    const result = new NumberSchema(parent, json.type === 'integer');
    this.parseSchemaCommon(json, result);
    if (Array.isArray(json.enum) && json.enum.length) {
      result.enum = json.enum.map(elem => Number(elem));
    }
    if (json.format) {
      result.format = json.format as SchemaFormat;
    }
    if (json.maximum) {
      result.maximum = json.maximum as number;
    }
    if (json.exclusiveMaximum) {
      result.exclusiveMaximum = json.exclusiveMaximum as boolean;
    }
    if (json.minimum) {
      result.minimum = json.minimum as number;
    }
    if (json.exclusiveMinimum) {
      result.exclusiveMinimum = json.exclusiveMinimum as boolean;
    }
    if (json.multipleOf) {
      result.multipleOf = json.multipleOf as number;
    }
    return result;
  }

  private parseStringSchema(json: JSONObject, parent: SchemaParent): StringSchema {
    if (json.type !== 'string') {
      throw new Error('Expected string type');
    }

    const result = new StringSchema(parent);
    this.parseSchemaCommon(json, result);
    if (Array.isArray(json.enum) && json.enum.length) {
      result.enum = json.enum.map(elem => String(elem));
    }
    if (json.maxLength) {
      result.maxLength = json.maxLength as number;
    }
    if (json.minLength) {
      result.minLength = json.minLength as number;
    }
    if (json.pattern) {
      result.pattern = json.pattern as string;
    }
    return result;
  }

  private parseResponse(json: JSONObject, parent: ResponseParent): Response {
    const result = new Response(parent, getStringAttribute(json, 'description') as string);
    if (json.headers) {
      for (const [key, headerJson] of Object.entries(json.headers as JSONObject)) {
        const headerName = key.toLowerCase();
        if (result.headers.has(headerName)) {
          throw new Error(`Duplicate response header ${key}`);
        }
        if (headerName !== 'content-type') {
          const header = this.parseHeader(headerJson as JSONObject, result);
          result.headers.set(key.toLowerCase(), header);
        }
      }
    }
    if (json.content) {
      for (const [key, contentJson] of Object.entries(json.content as JSONObject)) {
        const content = this.parseMediaType(contentJson as JSONObject, result);
        result.content.set(key, content);
      }
    }
    if (json.links) {
      for (const [linkId, linkJson] of Object.entries(json.links as JSONObject)) {
        const link = this.parseLink(linkJson as JSONObject, result);
        result.links.set(linkId, link);
      }
    }
    return result;
  }

  private parseHeader(json: JSONObject, parent: HeaderParent): Header {
    if ('schema' in json && 'content' in json) {
      throw new Error(`Either schema or content should be present, but not both`);
    }
    if ('example' in json && 'examples' in json) {
      throw new Error(`Either example or examples should be present, but not both`);
    }

    const result = new Header(parent);
    this.parseExtensionFields(json, result.extensionFields);
    if (json.description) {
      result.description = json.description as string;
    }
    if (json.required) {
      result.required = json.required as boolean;
    }
    if (json.deprecated) {
      result.deprecated = json.deprecated as boolean;
    }
    if (json.style) {
      result.style = getStringAttribute(json, 'style', false) as HeaderSerializationStyle;
    }
    if (json.explode) {
      result.explode = json.explode as boolean;
    }
    if (json.schema) {
      result.schema = this.parseSchema(json.schema as JSONObject, result);
    }
    if (json.example) {
      result.example = json.example;
    }
    if (json.examples) {
      for (const [key, value] of Object.entries(json.examples as JSONObject)) {
        const example = this.parseExample(value as JSONObject, result);
        result.examples.set(key, example);
      }
    }
    return result;
  }

  private parseExample(json: JSONObject, parent: ExampleParent): Example {
    const result = new Example(parent);
    this.parseExtensionFields(json, result.extensionFields);
    result.summary = getStringAttribute(json, 'summary', false);
    result.description = getStringAttribute(json, 'description', false);
    result.value = json.value ?? null;
    const externalValue = getStringAttribute(json, 'externalValue', false);
    if (result.value != null && externalValue != null) {
      throw new Error(`Either Example.value or Example.externalValue can be supplied at a time`);
    }
    result.externalValue = externalValue;
    return result;
  }

  private parseMediaType(json: JSONObject, parent: MediaTypeParent): MediaType {
    if (json.example && json.examples) {
      throw new Error(`Either example or examples should be set, but not both`);
    }
    const result = new MediaType(parent);
    if (json.schema) {
      result.schema = this.parseSchema(json.schema as JSONObject, result);
    }
    if (json.example) {
      result.example = json.example;
    }
    if (json.examples) {
      for (const [key, exampleJson] of Object.entries(json.examples as JSONObject)) {
        const example = this.parseExample(exampleJson as JSONObject, result);
        result.examples.set(key, example);
      }
    }
    if (json.encoding) {
      for (const [mimeType, encodingJson] of Object.entries(json.encoding as JSONObject)) {
        const encoding = this.parseEncoding(encodingJson as JSONObject, result);
        result.encoding.set(mimeType, encoding);
      }
    }
    return result;
  }

  private parseEncoding(json: JSONObject, parent: EncodingParent): Encoding {
    const result = new Encoding(parent, getStringAttribute(json, 'contentType') as string);
    if (json.headers) {
      for (const [key, headerJson] of Object.entries(json.headers as JSONObject)) {
        const headerName = key.toLowerCase();
        const header = this.parseHeader(headerJson as JSONObject, result);
        result.headers.set(headerName, header);
      }
    }
    if (json.style) {
      result.style = getStringAttribute(json, 'style', false) as EncodingSerializationStyle;
    }
    if (json.explode) {
      result.explode = json.explode as boolean;
    }
    if (json.allowReserved) {
      result.allowReserved = json.allowReserved as boolean;
    }
    return result;
  }

  private parseLink(json: JSONObject, parent: LinkParent): Link | LinkReference {
    const ref = this.parseReference<Link, LinkParent>(json, parent);
    if (ref) {
      return ref;
    }

    const result = new Link(parent);
    this.parseExtensionFields(json, result.extensionFields);
    if ('operationId' in json) {
      result.operationId = json.operationId as string;
    }
    if (!isEmpty(json.parameters as JSONObject)) {
      for (const [paramName, paramValue] of Object.entries(json.parameters as JSONObject)) {
        result.parameters.set(paramName, paramValue);
      }
    }
    return result;
  }

  private parseParameter(json: JSONObject, parent: ParameterParent): Parameter {
    switch (json.in) {
      case 'path':
        return this.parsePathParameter(json, parent);
      case 'query':
        return this.parseQueryParameter(json, parent);
      case 'cookie':
        return this.parseCookieParameter(json, parent);
      case 'header':
        return this.parseHeaderParameter(json, parent);
      default:
        throw new Error(`Unsupported parameter type ${String(json.in)}`);
    }
  }

  private parseParameterCommon(json: JSONObject, parameter: Parameter): void {
    this.parseExtensionFields(json, parameter.extensionFields);
    parameter.description = getStringAttribute(json, 'description', false);
    if (json.deprecated) {
      parameter.deprecated = json.deprecated as boolean;
    }
    if ('schema' in json && 'content' in json) {
      throw new Error(`Either schema or content should be present, but not both`);
    }
    if ('schema' in json) {
      parameter.schema = this.parseSchema(json.schema as JSONObject, parameter);
    }
    if ('content' in json) {
      for (const [mimeType, mediaTypeJson] of Object.entries(json.content as JSONObject)) {
        const mediaType = this.parseMediaType(mediaTypeJson as JSONObject, parameter);
        parameter.content.set(mimeType, mediaType);
      }
    }
    if ('example' in json && 'examples' in json) {
      throw new Error(`Either example or examples should be present, but not both`);
    }
    if (json.example) {
      parameter.example = json.example;
    }
    if (json.examples) {
      for (const [key, value] of Object.entries(json.examples as JSONObject)) {
        const example = this.parseExample(value as JSONObject, parameter);
        parameter.examples.set(key, example);
      }
    }
  }

  private parsePathParameter(json: JSONObject, parent: ParameterParent): PathParameter {
    if (json.in !== 'path') {
      throw new Error(`Wrong in parameter for HeaderParameter ${String(json.in)}`);
    }
    const result = new PathParameter(parent, getStringAttribute(json, 'name') as string);
    this.parseParameterCommon(json, result);
    if (json.required != null && !json.required) {
      throw new Error('Path parameters are always required');
    }
    if (json.style) {
      result.style = getStringAttribute(json, 'style', false) as PathParameterSerializationStyle;
    }
    result.explode = ('explode' in json ? json.explode : defaultExplode[result.style]) as boolean;
    return result;
  }

  private parseQueryParameter(json: JSONObject, parent: ParameterParent): QueryParameter {
    if (json.in !== 'query') {
      throw new Error(`Wrong in parameter for HeaderParameter ${String(json.in)}`);
    }
    const result = new QueryParameter(parent, getStringAttribute(json, 'name') as string);
    this.parseParameterCommon(json, result);
    if (json.required) {
      result.required = json.required as boolean;
    }
    if (json.style) {
      result.style = getStringAttribute(json, 'style', false) as QueryParameterSerializationStyle;
    }
    result.explode = ('explode' in json ? json.explode : defaultExplode[result.style]) as boolean;
    if (json.allowEmptyValue) {
      result.allowEmptyValue = json.allowEmptyValue as boolean;
    }
    if (json.allowReserved) {
      result.allowReserved = json.allowReserved as boolean;
    }
    return result;
  }

  private parseHeaderParameter(json: JSONObject, parent: ParameterParent): HeaderParameter {
    if (json.in !== 'header') {
      throw new Error(`Wrong in parameter for HeaderParameter ${String(json.in)}`);
    }
    const result = new HeaderParameter(parent, getStringAttribute(json, 'name') as string);
    this.parseParameterCommon(json, result);
    if (json.required) {
      result.required = json.required as boolean;
    }
    if (json.style) {
      result.style = getStringAttribute(json, 'style', false) as HeaderParameterSerializationStyle;
    }
    result.explode = ('explode' in json ? json.explode : defaultExplode[result.style]) as boolean;
    return result;
  }

  private parseCookieParameter(json: JSONObject, parent: ParameterParent): CookieParameter {
    if (json.in !== 'cookie') {
      throw new Error(`Wrong in parameter for CookieParameter ${String(json.in)}`);
    }
    const result = new CookieParameter(parent, getStringAttribute(json, 'name') as string);
    this.parseParameterCommon(json, result);
    if (json.required) {
      result.required = json.required as boolean;
    }
    if (json.style) {
      result.style = getStringAttribute(json, 'style', false) as CookieParameterSerializationStyle;
    }
    result.explode = ('explode' in json ? json.explode : defaultExplode[result.style]) as boolean;
    return result;
  }

  private parseRequestBody(json: JSONObject, parent: RequestBodyParent): RequestBody {
    const result = new RequestBody(parent);
    result.description = getStringAttribute(json, 'description', false) as string;
    if (json.content) {
      for (const [mediaTypeName, mediaTypeData] of Object.entries(json.content)) {
        result.content.set(mediaTypeName, this.parseMediaType(mediaTypeData as JSONObject, result));
      }
    }
    result.required = json.required as boolean;
    return result;
  }

  private parseSecurityScheme(json: JSONObject, parent: SecuritySchemeParent): SecurityScheme {
    switch (json.type) {
      case 'apiKey':
        return this.parseApiKeySecurityScheme(json, parent);
      case 'http':
        return this.parseHttpSecurityScheme(json, parent);
      case 'oauth2':
        return this.parseOauth2SecurityScheme(json, parent);
      case 'openIdConnect':
        return this.parseOpenIdConnectScheme(json, parent);
      default:
        throw new Error(`Unsupported security scheme type ${json.type as string}`);
    }
  }

  private parseSecuritySchemeCommon(json: JSONObject, securitySchema: SecurityScheme): void {
    this.parseExtensionFields(json, securitySchema.extensionFields);
    securitySchema.description = getStringAttribute(json, 'description', false);
  }

  private parseApiKeySecurityScheme(json: JSONObject, parent: SecuritySchemeParent): ApiKeyScheme {
    if (json.type !== 'apiKey') {
      throw new Error(`Incorrent type value ${String(json.type)}`);
    }
    const result = new ApiKeyScheme(
      parent,
      getStringAttribute(json, 'name') as string,
      getStringAttribute(json, 'in') as 'cookie' | 'header' | 'query',
    );
    this.parseSecuritySchemeCommon(json, result);
    return result;
  }

  private parseHttpSecurityScheme(json: JSONObject, parent: SecuritySchemeParent): HttpScheme {
    if (json.type !== 'http') {
      throw new Error(`Incorrent type value ${String(json.type)}`);
    }
    const result = new HttpScheme(parent, getStringAttribute(json, 'scheme') as string);
    this.parseSecuritySchemeCommon(json, result);
    result.bearerFormat = getStringAttribute(json, 'bearerFormat', false);
    return result;
  }

  private parseOauth2SecurityScheme(json: JSONObject, parent: SecuritySchemeParent): OAuth2Scheme {
    if (json.type !== 'oauth2') {
      throw new Error(`Incorrent type value ${String(json.type)}`);
    }

    const result = new OAuth2Scheme(parent);
    this.parseSecuritySchemeCommon(json, result);

    const { authorizationCode, clientCredentials, implicit, password } = json.flows as JSONObject;
    if (authorizationCode) {
      result.flows.authorizationCode = this.parseAuthorisationCodeOAuthFlow(
        authorizationCode,
        result.flows,
      );
    }
    if (clientCredentials) {
      result.flows.clientCredentials = this.parseClientCredentialsOAuthFlow(
        clientCredentials,
        result.flows,
      );
    }
    if (implicit) {
      result.flows.implicit = this.parseImplicitOAuthFlow(implicit, result.flows);
    }
    if (password) {
      result.flows.password = this.parsePasswordOAuthFlow(password, result.flows);
    }

    return result;
  }

  private parseOAuthFlowCommon(json: JSONObject, flow: OAuthFlow): void {
    this.parseExtensionFields(json, flow.extensionFields);
    flow.refreshUrl = getStringAttribute(json, 'refreshUrl', false);
    if (json.scopes) {
      for (const [key, value] of Object.entries(json.scopes as JSONObject)) {
        flow.scopes.set(key, value as string);
      }
    }
  }

  private parseAuthorisationCodeOAuthFlow(
    json: JSONObject,
    parent: OAuthFlowParent,
  ): OAuthAuthorisationCodeFlow {
    const result = new OAuthAuthorisationCodeFlow(
      parent,
      getStringAttribute(json, 'authorizationUrl') as string,
      getStringAttribute(json, 'tokenUrl') as string,
    );
    this.parseOAuthFlowCommon(json, result);
    return result;
  }

  private parseClientCredentialsOAuthFlow(
    json: JSONObject,
    parent: OAuthFlowParent,
  ): OAuthClientCredentialsFlow {
    const result = new OAuthClientCredentialsFlow(
      parent,
      getStringAttribute(json, 'tokenUrl') as string,
    );
    this.parseOAuthFlowCommon(json, result);
    return result;
  }

  private parseImplicitOAuthFlow(json: JSONObject, parent: OAuthFlowParent): OAuthImplicitFlow {
    const result = new OAuthImplicitFlow(
      parent,
      getStringAttribute(json, 'authorizationUrl') as string,
    );
    this.parseOAuthFlowCommon(json, result);
    return result;
  }

  private parsePasswordOAuthFlow(json: JSONObject, parent: OAuthFlowParent): OAuthPasswordFlow {
    const result = new OAuthPasswordFlow(parent, getStringAttribute(json, 'tokenUrl') as string);
    this.parseOAuthFlowCommon(json, result);
    return result;
  }

  private parseOpenIdConnectScheme(
    json: JSONObject,
    parent: SecuritySchemeParent,
  ): OpenIdConnectScheme {
    if (json.type !== 'openIdConnect') {
      throw new Error(`Incorrent type value ${String(json.type)}`);
    }
    const result = new OpenIdConnectScheme(
      parent,
      getStringAttribute(json, 'openIdConnectUrl') as string,
    );
    this.parseSecuritySchemeCommon(json, result);
    return result;
  }

  private parseCallback(json: JSONObject, parent: CallbackParent): Callback {
    const result = new Callback(parent);
    this.parseExtensionFields(json, result.extensionFields);
    for (const [key, value] of Object.entries(json)) {
      if (!key.startsWith('x-')) {
        const pathItem = this.parsePathItem(value as JSONObject, result);
        result.paths.set(key, pathItem);
      }
    }
    return result;
  }

  private parsePathItem(json: JSONObject, parent: PathItemParent): PathItem {
    const unknownMethods = Object.keys(json).filter(attr => {
      return !attr.startsWith('x-') && !whitelistedProperties.includes(attr as HTTPMethod);
    });
    if (unknownMethods.length) {
      throw new Error(`Unsupported HTTP method(-s) ${unknownMethods.join(',')}`);
    }

    const result = new PathItem(parent);
    this.parseExtensionFields(json, result.extensionFields);
    result.summary = getStringAttribute(json, 'summary', false);
    result.description = getStringAttribute(json, 'description', false);

    for (const method of httpMethods) {
      if (method in json) {
        const operation = this.parseOperation(json[method], result);
        result.operations.set(method, operation);
      }
    }
    if ((json.servers as JSONObject[])?.length > 0) {
      result.servers = (json.servers as JSONObject[]).map(itemJson =>
        this.parseServer(itemJson, result),
      );
    }
    if ((json.parameters as JSONObject[])?.length > 0) {
      result.parameters = (json.parameters as JSONObject[]).map(parameterJson =>
        this.parseParameter(parameterJson, result),
      );
    }
    return result;
  }

  private parseOperation(json: JSONObject, parent: OperationParent): Operation {
    if (json.responses && isEmpty(json.responses as JSONObject)) {
      throw new Error(`Operation responses field cannot be empty`);
    }

    const result = new Operation(parent);
    if (Array.isArray(json.tags)) {
      json.tags.forEach(tag => result.tags.push(tag as string));
    }
    if (json.summary) {
      result.summary = json.summary as string;
    }
    result.description = json.description as string;
    if (json.externalDocs) {
      result.externalDocs = this.parseExternalDocumentation(
        json.externalDocs as JSONObject,
        result,
      );
    }
    if (json.operationId) {
      result.operationId = json.operationId as string;
    }
    if ((json.parameters as JSONArray)?.length) {
      for (const parameterJson of json.parameters as JSONArray) {
        const parameter = this.parseParameter(parameterJson as JSONObject, result);
        result.parameters.push(parameter);
      }
    }
    if (json.requestBody) {
      result.requestBody = this.parseRequestBody(json.requestBody as JSONObject, result);
    }

    for (const [key, responseJson] of Object.entries(json.responses as JSONObject)) {
      const response = this.parseResponse(responseJson as JSONObject, result.responses);
      if (key === 'default') {
        result.responses.default = response;
      } else {
        result.responses.codes.set(key, response);
      }
    }

    if (json.callbacks) {
      for (const [callbackId, callbackJson] of Object.entries(json.callbacks)) {
        const callback = this.parseCallback(callbackJson as JSONObject, result);
        result.callbacks.set(callbackId, callback);
      }
    }
    if ('security' in json) {
      result.security = this.parseSecurityRequirement(json.security as JSONObject, result);
    }
    return result;
  }

  private parseExternalDocumentation(
    json: JSONObject,
    parent: ExternalDocumentationParent,
  ): ExternalDocumentation {
    const result = new ExternalDocumentation(parent, getStringAttribute(json, 'url') as string);
    this.parseExtensionFields(json, result.extensionFields);
    result.description = getStringAttribute(json, 'description', false);
    return result;
  }

  private parseSecurityRequirement(
    json: JSONObject,
    parent: SecurityRequirementParent,
  ): SecurityRequirement {
    const result = new SecurityRequirement(parent);
    this.parseExtensionFields(json, result.extensionFields);
    for (const [schemeName, requiredScopes] of Object.entries(json)) {
      if (
        !(
          Array.isArray(requiredScopes) &&
          (!requiredScopes.length || requiredScopes.every(s => typeof s === 'string'))
        )
      ) {
        throw new Error(`SeecurityRequirement scopes must be an array of strings`);
      }
      result.scopes.set(schemeName, requiredScopes as string[]);
    }
    return result;
  }

  private parseTag(json: JSONObject, parent: TagParent): Tag {
    const result = new Tag(parent, getStringAttribute(json, 'name') as string);
    this.parseExtensionFields(json, result.extensionFields);
    result.description = getStringAttribute(json, 'description', false);
    if (json.externalDocs) {
      result.externalDocs = this.parseExternalDocumentation(
        json.externalDocs as JSONObject,
        result,
      );
    }
    return result;
  }

  // private parseDiscriminator(json: JSONObject, parent: Schema): Discriminator {
  //   const result = new Discriminator(parent, json.propertyName as string);
  //   this.parseExtensionFields(json, result.extensionFields);
  //   return result;
  // }

  // private parseXml(json: JSONObject, parent: XMLParent): XML {
  //   const result = new XML(parent);
  //   this.parseExtensionFields(json, result.extensionFields);
  //   if (json.name) {
  //     result.name = json.name as string;
  //   }
  //   if (json.namespace) {
  //     result.namespace = json.namespace as string;
  //   }
  //   if (json.prefix) {
  //     result.prefix = json.prefix as string;
  //   }
  //   result.attribute = json.attribute as boolean;
  //   result.wrapped = json.wrapped as boolean;
  //   return result;
  // }
}
