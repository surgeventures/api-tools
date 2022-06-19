import { isReference } from './Reference';

import type { ExtensionFields } from './BasicNode';
import type { Callback, CallbackReference } from './Callback';
import type { Components } from './Components';
import type { Contact } from './Contact';
import type { Encoding } from './Encoding';
import type { Example, ExampleReference } from './Example';
import type { ExternalDocumentation } from './ExternalDocumentation';
import type { Header, HeaderReference } from './Header';
import type { Info } from './Info';
import type { License } from './License';
import type { Link, LinkReference, LinkReference as MediaTypeReference } from './Link';
import type { MediaType } from './MediaType';
import type { OpenAPI } from './OpenAPI';
import type { Operation } from './Operation';
import type { Parameter, ParameterReference } from './Parameter';
import type { CookieParameter } from './Parameter/CookieParameter';
import type { HeaderParameter } from './Parameter/HeaderParameter';
import type { PathParameter } from './Parameter/PathParameter';
import type { QueryParameter } from './Parameter/QueryParameter';
import type { PathItem } from './PathItem';
import type { Paths } from './Paths';
import type { RequestBody, RequestBodyReference } from './RequestBody';
import type { Response, ResponseReference } from './Response';
import type { Responses } from './Responses';
import type { Schema, SchemaReference } from './Schema';
import type { AllOfSchema } from './Schema/AllOfSchema';
import type { AnyOfSchema } from './Schema/AnyOfSchema';
import type { ArraySchema } from './Schema/ArraySchema';
import type { BooleanSchema } from './Schema/BooleanSchema';
import type { NotSchema } from './Schema/NotSchema';
import type { NumberSchema } from './Schema/NumberSchema';
import type { ObjectSchema } from './Schema/ObjectSchema';
import type { OneOfSchema } from './Schema/OneOfSchema';
import type { StringSchema } from './Schema/StringSchema';
import type { SecurityRequirement } from './SecurityRequirement';
import type { SecurityScheme, SecuritySchemeReference } from './SecurityScheme';
import type { Server } from './Server';
import type { ServerVariable } from './ServerVariable';
import type { Tag } from './Tag';
import type { JSONObject, JSONValue } from '@fresha/api-tools-core';

export class OpenAPIWriter {
  write(schema: OpenAPI): JSONObject {
    const result: JSONObject = {
      openapi: '3.0.3',
      info: this.writeInfo(schema.info),
      ...this.writeExtensionFields(schema.extensionFields),
    };
    if (schema.servers.length) {
      result.servers = schema.servers.map(arg => this.writeServer(arg));
    }
    if (!schema.components.isEmpty()) {
      result.components = this.writeComponents(schema.components);
    }
    result.paths = this.writePaths(schema.paths);
    if (schema.security) {
      result.security = this.writeSecurityRequirement(schema.security);
    }
    if (schema.tags.length) {
      result.tags = schema.tags.map(arg => this.writeTag(arg));
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  private writeExtensionFields(extensionFields: ExtensionFields): JSONObject {
    return Object.fromEntries(extensionFields.entries());
  }

  private writeInfo(info: Info): JSONObject {
    const result = this.writeExtensionFields(info.extensionFields);
    result.title = info.title;
    result.version = info.version;
    if (info.description) {
      result.description = info.description;
    }
    if (info.termsOfService) {
      result.termsOfService = info.termsOfService;
    }
    const contact = this.writeContact(info.contact);
    if (contact) {
      result.contact = contact;
    }
    const license = this.writeLicense(info.license);
    if (license) {
      result.license = license;
    }
    return result;
  }

  private writeContact(contact: Contact): JSONObject | null {
    const result = this.writeExtensionFields(contact.extensionFields);
    if (contact.name) {
      result.name = contact.name;
    }
    if (contact.url) {
      result.url = contact.url;
    }
    if (contact.email) {
      result.email = contact.email;
    }
    return Object.keys(result).length ? result : null;
  }

  private writeLicense(license: License): JSONObject | null {
    const result = this.writeExtensionFields(license.extensionFields);
    if (license.name !== 'UNLICENSED') {
      result.name = license.name;
    }
    if (license.url) {
      result.url = license.url;
    }
    return Object.keys(result).length ? result : null;
  }

  private writeServer(server: Server): JSONObject {
    const result = this.writeExtensionFields(server.extensionFields);
    result.url = server.url;
    if (server.description) {
      result.description = server.description;
    }
    if (server.variables.size) {
      result.variables = {};
      for (const [key, value] of server.variables.entries()) {
        result.variables[key] = this.writeServerVariable(value);
      }
    }
    return result;
  }

  private writeServerVariable(serverVar: ServerVariable): JSONObject {
    const result = this.writeExtensionFields(serverVar.extensionFields);
    result.default = serverVar.default;
    if (serverVar.enum) {
      result.enum = serverVar.enum;
    }
    if (serverVar.description) {
      result.description = serverVar.description;
    }
    return result;
  }

  private writeComponents(components: Components): JSONObject {
    const result = this.writeExtensionFields(components.extensionFields);
    if (components.schemas.size) {
      result.schemas = {};
      for (const [key, schema] of components.schemas) {
        result.schemas[key] = this.writeSchema(schema);
      }
    }
    if (components.responses.size) {
      result.responses = {};
      for (const [key, response] of components.responses) {
        result.responses[key] = this.writeResponse(response);
      }
    }
    if (components.parameters.size) {
      result.parameters = {};
      for (const [key, parameter] of components.parameters) {
        result.parameters[key] = this.writeParameter(parameter);
      }
    }
    if (components.examples.size) {
      result.examples = {};
      for (const [key, example] of components.examples) {
        result.examples[key] = this.writeExample(example);
      }
    }
    if (components.requestBodies.size) {
      result.requestBodies = {};
      for (const [key, requestBody] of components.requestBodies) {
        result.requestBodies[key] = this.writeRequestBody(requestBody);
      }
    }
    if (components.headers.size) {
      result.headers = {};
      for (const [key, header] of components.headers) {
        result.headers[key] = this.writeHeader(header);
      }
    }
    if (components.securitySchemas.size) {
      result.securitySchemas = {};
      for (const [key, securitySchemas] of components.securitySchemas) {
        result.securitySchemas[key] = this.writeSecuritySchema(securitySchemas);
      }
    }
    if (components.links.size) {
      result.links = {};
      for (const [key, link] of components.links) {
        result.links[key] = this.writeLink(link);
      }
    }
    if (components.callbacks.size) {
      result.callbacks = {};
      for (const [key, callback] of components.callbacks) {
        result.callbacks[key] = this.writeCallback(callback);
      }
    }
    return result;
  }

  private writeSchema(schema: Schema | SchemaReference): JSONObject {
    const isSchema = (arg: Schema | SchemaReference): arg is Schema => !isReference(arg);

    const result = this.writeExtensionFields(schema.extensionFields);
    if (!isSchema(schema)) {
      result.$ref = schema.ref;
    } else {
      this.writeSchemaCommon(result, schema);

      switch (schema.type) {
        case 'allOf':
          this.writeAllOfSchema(result, schema);
          break;
        case 'anyOf':
          this.writeAnyOfSchema(result, schema);
          break;
        case 'oneOf':
          this.writeOneOfSchema(result, schema);
          break;
        case 'not':
          this.writeNotSchema(result, schema);
          break;
        case 'array':
          this.writeArraySchema(result, schema);
          break;
        case 'object':
          this.writeObjectSchema(result, schema);
          break;
        case 'boolean':
          this.writeBooleanSchema(result, schema);
          break;
        case 'integer':
        case 'number':
          this.writeNumericSchema(result, schema);
          break;
        case 'string':
          this.writeStringSchema(result, schema);
          break;
        default:
          throw new Error(`Unsupported schema type ${String(schema.type)}`);
      }
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  private writeSchemaCommon(json: JSONObject, schema: Schema): void {
    if (schema.title) {
      json.title = schema.title;
    }
    if (schema.description) {
      json.description = schema.description;
    }
    if (schema.format) {
      json.format = schema.format;
    }
    if (schema.nullable) {
      json.nullable = true;
    }
    if (schema.default != null) {
      json.default = schema.default;
    }
    if (schema.example != null) {
      json.example = schema.example;
    }
  }

  private writeAllOfSchema(json: JSONObject, schema: Schema): void {
    const allOfSchema = schema as AllOfSchema;
    if (allOfSchema.allOf.length) {
      json.allOf = allOfSchema.allOf.map(item => this.writeSchema(item));
    }
  }

  private writeAnyOfSchema(json: JSONObject, schema: Schema): void {
    const anyOfSchema = schema as AnyOfSchema;
    if (anyOfSchema.anyOf.length) {
      json.anyOf = anyOfSchema.anyOf.map(item => this.writeSchema(item));
    }
  }

  private writeOneOfSchema(json: JSONObject, schema: Schema): void {
    const oneOfSchema = schema as OneOfSchema;
    if (oneOfSchema.oneOf.length) {
      json.oneOf = oneOfSchema.oneOf.map(item => this.writeSchema(item));
    }
  }

  private writeNotSchema(json: JSONObject, schema: Schema): void {
    const notSchema = schema as NotSchema;
    json.not = this.writeSchema(notSchema.not);
  }

  private writeArraySchema(json: JSONObject, schema: Schema): void {
    const arraySchema = schema as ArraySchema;
    json.type = arraySchema.type;
    json.items = this.writeSchema(arraySchema.items);
  }

  private writeObjectSchema(json: JSONObject, schema: Schema): void {
    const objectSchema = schema as ObjectSchema;
    json.type = objectSchema.type;
    if (objectSchema.required.length) {
      json.required = objectSchema.required;
    }
    if (objectSchema.properties.size) {
      json.properties = {};
      for (const [propName, propValue] of objectSchema.properties) {
        json.properties[propName] = this.writeSchema(propValue);
      }
    }
    if (typeof objectSchema.additionalProperties === 'object') {
      json.additionalProperties = this.writeSchema(objectSchema.additionalProperties);
    } else if (!objectSchema.additionalProperties) {
      json.additionalProperties = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private writeBooleanSchema(json: JSONObject, schema: Schema): void {
    const booleanSchema = schema as BooleanSchema;
    json.type = booleanSchema.type;
    if (booleanSchema.enum) {
      json.enum = booleanSchema.enum;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private writeNumericSchema(json: JSONObject, schema: Schema): void {
    const numericSchema = schema as NumberSchema;
    json.type = numericSchema.type;
    if (numericSchema.enum != null) {
      json.enum = numericSchema.enum;
    }
    if (numericSchema.format != null) {
      json.format = numericSchema.format;
    }
    if (numericSchema.maximum != null) {
      json.maximum = numericSchema.maximum;
    }
    if (numericSchema.exclusiveMaximum) {
      json.exclusiveMaximum = numericSchema.exclusiveMaximum;
    }
    if (numericSchema.minimum != null) {
      json.minimum = numericSchema.minimum;
    }
    if (numericSchema.exclusiveMinimum) {
      json.exclusiveMinimum = numericSchema.exclusiveMinimum;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private writeStringSchema(json: JSONObject, schema: Schema): void {
    const stringSchema = schema as StringSchema;
    json.type = stringSchema.type;
    if (stringSchema.enum) {
      json.enum = stringSchema.enum;
    }
    if (stringSchema.minLength != null) {
      json.minLength = stringSchema.minLength;
    }
    if (stringSchema.maxLength != null) {
      json.maxLength = stringSchema.maxLength;
    }
    if (stringSchema.pattern != null) {
      json.pattern = stringSchema.pattern;
    }
  }

  private writeResponse(response: Response | ResponseReference): JSONObject {
    const result = this.writeExtensionFields(response.extensionFields);
    if (isReference(response)) {
      result.$ref = response.ref;
    } else {
      result.description = response.description;
      if (response.headers.size) {
        result.headers = {};
        for (const [key, header] of response.headers) {
          result.headers[key] = this.writeHeader(header);
        }
      }
      if (response.content.size) {
        result.content = {};
        for (const [key, mediaType] of response.content) {
          result.content[key] = this.writeMediaType(mediaType);
        }
      }
      if (response.links.size) {
        result.links = {};
        for (const [key, link] of response.links) {
          result.links[key] = this.writeLink(link);
        }
      }
    }
    return result;
  }

  private writeHeader(header: Header | HeaderReference): JSONObject {
    const isHeader = (arg: Header | HeaderReference): arg is Header => !isReference(arg);
    const result = this.writeExtensionFields(header.extensionFields);
    if (!isHeader(header)) {
      result.$ref = header.ref;
    } else {
      if (header.description) {
        result.description = header.description;
      }
      if (header.required) {
        result.required = true;
      }
      if (header.deprecated) {
        result.deprecated = true;
      }
      if (header.style !== 'simple') {
        result.style = header.style;
      }
      if (header.explode) {
        result.explode = true;
      }
      if (header.schema) {
        result.schema = this.writeSchema(header.schema);
      }
      if (header.example) {
        result.example = header.example;
      }
      if (header.examples.size) {
        result.examples = {};
        for (const [key, example] of header.examples) {
          result.examples[key] = this.writeExample(example);
        }
      }
      if (header.content) {
        result.content = {};
        for (const [key, mediaType] of header.content) {
          result.content[key] = this.writeMediaType(mediaType);
        }
      }
    }
    return result;
  }

  private writeExample(example: Example | ExampleReference): JSONObject {
    const isExample = (arg: Example | ExampleReference): arg is Example => !isReference(arg);
    const result = this.writeExtensionFields(example.extensionFields);
    if (!isExample(example)) {
      result.$ref = example.ref;
    } else {
      if (example.summary) {
        result.summary = example.summary;
      }
      if (example.description) {
        result.description = example.description;
      }
      if (example.value) {
        result.value = example.value;
      }
      if (example.externalValue) {
        result.externalValue = example.externalValue;
      }
    }
    return result;
  }

  private writeMediaType(mediaType: MediaType | MediaTypeReference): JSONObject {
    const result = this.writeExtensionFields(mediaType.extensionFields);
    if (isReference(mediaType)) {
      result.$ref = mediaType.ref;
    } else {
      if (mediaType.schema) {
        result.schema = this.writeSchema(mediaType.schema);
      }
      if (mediaType.example) {
        result.example = mediaType.example;
      }
      if (mediaType.examples.size) {
        result.examples = {};
        for (const [key, example] of mediaType.examples) {
          result.examples[key] = this.writeExample(example);
        }
      }
      if (mediaType.encoding.size) {
        result.encoding = {};
        for (const [key, encoding] of mediaType.encoding) {
          result.encoding[key] = this.writeEncoding(encoding);
        }
      }
    }
    return result;
  }

  private writeEncoding(encoding: Encoding): JSONObject {
    const result = this.writeExtensionFields(encoding.extensionFields);
    if (encoding.contentType) {
      result.contentType = encoding.contentType;
    }
    if (encoding.headers.size) {
      result.headers = {};
      for (const [key, header] of encoding.headers) {
        result.headers[key] = this.writeHeader(header);
      }
    }
    if (encoding.style) {
      result.style = encoding.style;
    }
    result.explode = encoding.explode;
    result.allowReserved = encoding.allowReserved;
    return result;
  }

  private writeLink(link: Link | LinkReference): JSONObject {
    const result = this.writeExtensionFields(link.extensionFields);
    if (isReference(link)) {
      result.$ref = link.ref;
    } else {
      if (link.operationRef) {
        result.operationRef = link.operationRef;
      }
      if (link.operationId) {
        result.operationId = link.operationId;
      }
      if (link.parameters.size) {
        result.parameters = Object.fromEntries(link.parameters.entries());
      }
      if (link.requestBody) {
        result.requestBody = link.requestBody as JSONValue;
      }
      if (link.description) {
        result.description = link.description;
      }
      if (link.server) {
        result.server = this.writeServer(link.server);
      }
    }
    return result;
  }

  private writeParameter(parameter: Parameter | ParameterReference): JSONObject {
    const isParameter = (arg: Parameter | ParameterReference): arg is Parameter =>
      !isReference(arg);
    const result = this.writeExtensionFields(parameter.extensionFields);
    if (!isParameter(parameter)) {
      result.$ref = parameter.ref;
    } else {
      result.name = parameter.name;
      result.in = parameter.in;
      if (parameter.description) {
        result.description = parameter.description;
      }
      if (parameter.deprecated) {
        result.deprecated = true;
      }
      if (parameter.schema) {
        result.schema = this.writeSchema(parameter.schema);
      }
      if (parameter.content.size) {
        result.content = {};
        for (const [key, mediaType] of parameter.content) {
          result.content[key] = this.writeMediaType(mediaType);
        }
      }
      if (parameter.example) {
        result.example = parameter.example;
      }
      if (parameter.examples.size) {
        result.examples = {};
        for (const [key, example] of parameter.examples) {
          result.examples[key] = this.writeExample(example);
        }
      }

      switch (parameter.in) {
        case 'path': {
          const pathParameter = parameter as PathParameter;
          // result.required = true;
          if (pathParameter.style !== 'simple') {
            result.style = pathParameter.style;
          }
          if (pathParameter.explode) {
            result.explode = true;
          }
          break;
        }
        case 'query': {
          const queryParameter = parameter as QueryParameter;
          if (queryParameter.required) {
            result.required = true;
          }
          if (queryParameter.style !== 'form') {
            result.style = queryParameter.style;
          }
          if (queryParameter.explode !== (queryParameter.style === 'form')) {
            result.explode = queryParameter.explode;
          }
          if (queryParameter.allowEmptyValue) {
            result.allowEmptyValue = true;
          }
          if (queryParameter.allowReserved) {
            result.allowReserved = true;
          }
          break;
        }
        case 'header': {
          const headerParameter = parameter as HeaderParameter;
          if (headerParameter.required) {
            result.required = true;
          }
          if (headerParameter.style !== 'simple') {
            result.style = headerParameter.style;
          }
          if (!headerParameter.explode) {
            result.explode = false;
          }
          break;
        }
        case 'cookie': {
          const cookieParameter = parameter as CookieParameter;
          if (cookieParameter.required) {
            result.required = true;
          }
          if (cookieParameter.style !== 'form') {
            result.style = cookieParameter.style;
          }
          if (cookieParameter.explode !== (cookieParameter.style === 'form')) {
            result.explode = cookieParameter.explode;
          }
          break;
        }
        default:
          throw new Error(`Unsupported parameter type ${String(parameter.in)}`);
      }
    }
    return result;
  }

  private writeRequestBody(requestBody: RequestBody | RequestBodyReference): JSONObject {
    const result = this.writeExtensionFields(requestBody.extensionFields);
    if (isReference(requestBody)) {
      result.$ref = requestBody.ref;
    } else {
      if (requestBody.description) {
        result.description = requestBody.description;
      }
      if (requestBody.content.size) {
        result.content = {};
        for (const [key, mediaType] of requestBody.content) {
          result.content[key] = this.writeMediaType(mediaType);
        }
      }
      if (requestBody.required) {
        result.required = true;
      }
    }
    return result;
  }

  private writeSecuritySchema(
    securitySchema: SecurityScheme | SecuritySchemeReference,
  ): JSONObject {
    const result = this.writeExtensionFields(securitySchema.extensionFields);
    if (isReference(securitySchema)) {
      result.$ref = securitySchema.ref;
    } else {
      if (securitySchema.description) {
        result.description = securitySchema.description;
      }
      switch (securitySchema.type) {
        case 'apiKey': {
          const apiKeyScheme = securitySchema;
          result.name = apiKeyScheme.name;
          result.in = apiKeyScheme.in;
          break;
        }
        case 'http': {
          const httpScheme = securitySchema;
          result.scheme = httpScheme.scheme;
          if (httpScheme.bearerFormat) {
            result.bearerFormat = httpScheme.bearerFormat;
          }
          break;
        }
        case 'oauth2': {
          const oauth2Scheme = securitySchema;
          result.flows = {};
          if (oauth2Scheme.flows.authorizationCode) {
            result.flows.authorizationCode = {
              scopes: Object.fromEntries(oauth2Scheme.flows.authorizationCode.scopes.entries()),
              authorizationUrl: oauth2Scheme.flows.authorizationCode.authorizationUrl,
              tokenUrl: oauth2Scheme.flows.authorizationCode.tokenUrl,
            };
          }
          if (oauth2Scheme.flows.clientCredentials) {
            result.flows.clientCredentials = {
              scopes: Object.fromEntries(oauth2Scheme.flows.clientCredentials.scopes.entries()),
              tokenUrl: oauth2Scheme.flows.clientCredentials.tokenUrl,
            };
          }
          if (oauth2Scheme.flows.implicit) {
            result.flows.implicit = {
              scopes: Object.fromEntries(oauth2Scheme.flows.implicit.scopes.entries()),
              authorizationUrl: oauth2Scheme.flows.implicit.authorizationUrl,
            };
          }
          if (oauth2Scheme.flows.password) {
            result.flows.password = {
              scopes: Object.fromEntries(oauth2Scheme.flows.password.scopes.entries()),
              tokenUrl: oauth2Scheme.flows.password.tokenUrl,
            };
          }
          break;
        }
        case 'openIdConnect': {
          const openIdConnectScheme = securitySchema;
          result.openIdConnectUrl = openIdConnectScheme.openIdConnectUrl;
          break;
        }
        default:
          throw new Error(`Unsupported security schema type ${String(securitySchema)}`);
      }
    }
    return result;
  }

  private writeCallback(callback: Callback | CallbackReference): JSONObject {
    const result = this.writeExtensionFields(callback.extensionFields);
    if (isReference(callback)) {
      result.$ref = callback.ref;
    } else {
      for (const [expr, pathItem] of callback.paths) {
        result[expr] = this.writePathItem(pathItem);
      }
    }
    return result;
  }

  private writePathItem(pathItem: PathItem): JSONObject {
    const result = this.writeExtensionFields(pathItem.extensionFields);
    if (pathItem.summary) {
      result.summary = pathItem.summary;
    }
    if (pathItem.description) {
      result.description = pathItem.description;
    }
    for (const [operName, operDesc] of pathItem.operations) {
      result[operName] = this.writeOperation(operDesc);
    }
    if (pathItem.servers.length) {
      result.servers = pathItem.servers.map(arg => this.writeServer(arg));
    }
    if (pathItem.parameters.length) {
      result.parameters = pathItem.parameters.map(arg => this.writeParameter(arg));
    }
    return result;
  }

  private writeOperation(operation: Operation): JSONObject {
    const result = this.writeExtensionFields(operation.extensionFields);
    if (operation.tags.length) {
      result.tags = operation.tags;
    }
    if (operation.summary) {
      result.summary = operation.summary;
    }
    if (operation.description) {
      result.description = operation.description;
    }
    if (operation.externalDocs) {
      result.externalDocs = this.writeExternalDocs(operation.externalDocs);
    }
    if (operation.operationId) {
      result.operationId = operation.operationId;
    }
    if (operation.parameters.length) {
      result.parameters = operation.parameters.map(arg => this.writeParameter(arg));
    }
    if (operation.requestBody) {
      result.requestBody = this.writeRequestBody(operation.requestBody);
    }
    result.responses = this.writeResponses(operation.responses);
    if (operation.callbacks.size) {
      result.callbacks = {};
      for (const [name, callback] of operation.callbacks) {
        result.callbacks[name] = this.writeCallback(callback);
      }
    }
    if (operation.deprecated) {
      result.deprecated = operation.deprecated;
    }
    if (operation.security) {
      result.security = this.writeSecurityRequirement(operation.security);
    }
    if (operation.servers.length) {
      result.servers = operation.servers.map(arg => this.writeServer(arg));
    }
    return result;
  }

  private writeExternalDocs(externalDocs: ExternalDocumentation): JSONObject {
    const result = this.writeExtensionFields(externalDocs.extensionFields);
    result.url = externalDocs.url;
    if (externalDocs.description) {
      result.description = externalDocs.description;
    }
    return result;
  }

  private writeResponses(responses: Responses): JSONObject {
    const result = this.writeExtensionFields(responses.extensionFields);
    if (responses.codes.size) {
      for (const [httpStatus, response] of responses.codes) {
        result[httpStatus] = this.writeResponse(response);
      }
    }
    if (responses.default) {
      result.default = this.writeResponse(responses.default);
    }
    return result;
  }

  private writeSecurityRequirement(security: SecurityRequirement): JSONObject {
    const result = this.writeExtensionFields(security.extensionFields);
    for (const [key, scopes] of security.scopes) {
      result[key] = scopes;
    }
    return result;
  }

  private writePaths(paths: Paths): JSONObject {
    const result = this.writeExtensionFields(paths.extensionFields);
    for (const [pathUrlExp, pathItem] of paths) {
      result[pathUrlExp] = this.writePathItem(pathItem);
    }
    return result;
  }

  private writeTag(tag: Tag): JSONObject {
    const result = this.writeExtensionFields(tag.extensionFields);
    result.name = tag.name;
    if (tag.description) {
      result.description = tag.description;
    }
    if (tag.externalDocs) {
      result.externalDocs = this.writeExternalDocs(tag.externalDocs);
    }
    return result;
  }

  // dumpXML(xml: XML): JSONObject {
  //   const result = this.writeExtensionFields(xml.extensionFields);
  //   result.name = xml.name;
  //   result.namespace = xml.namespace;
  //   result.prefix = xml.prefix;
  //   result.attribute = xml.attribute;
  //   result.wrapped = xml.wrapped;
  //   return result;
  // }

  // dumpDiscriminator(discriminator: Discriminator): JSONValue {
  //   const result = this.writeExtensionFields(discriminator.extensionFields);
  //   result.propertyName = discriminator.propertyName;
  //   if (discriminator.mapping.size) {
  //     result.mapping = Object.fromEntries(discriminator.mapping.entries());
  //   }
  //   return result;
  // }
}
