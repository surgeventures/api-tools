import { OpenAPIReader } from './OpenAPIReader';

test('barebones', () => {
  const reader = new OpenAPIReader();
  const openapi = reader.parse({
    openapi: '3.0.3',
    info: {
      title: 'Barebones',
      version: '1.2.3',
    },
    paths: {},
    components: {},
  });

  expect(openapi.info.title).toBe('Barebones');
  expect(openapi.info.version).toBe('1.2.3');
  expect(openapi.paths.size).toBe(0);
  expect(openapi.components.isEmpty()).toBeTruthy();
});

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import ApiKeyScheme from './ApiKeyScheme';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('SecurityScheme.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON throws without required data', () => {
//   expect(() => ApiKeyScheme.fromJSON({}, parent));
//   expect(() => ApiKeyScheme.fromJSON({ type: 'apiKey' }, parent));
//   expect(() => ApiKeyScheme.fromJSON({ type: 'apiKey', description: 'scheme' }, parent));
// });

// it("fromJSON throws if the type field has value other than 'http'", () => {
//   expect(() => ApiKeyScheme.fromJSON({ type: 'http', name: 'x', in: 'cookie' }, parent)).toThrow();
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     type: 'apiKey',
//     description: 'security',
//     name: 'session_cookie',
//     in: 'cookie',
//     'x-one': 1,
//   };
//   const scheme = ApiKeyScheme.fromJSON(json, parent);
//   expect(scheme.type).toBe('apiKey');
//   expect(scheme.toJSON()).toEqual(json);
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import OAuth2Scheme from './OAuth2Scheme';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('SecurityScheme.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON throws without required data', () => {
//   expect(() => OAuth2Scheme.fromJSON({}, parent));
//   expect(() => OAuth2Scheme.fromJSON({ type: 'oauth2' }, parent));
//   expect(() => OAuth2Scheme.fromJSON({ type: 'oauth2', description: 'scheme' }, parent));
// });

// it("fromJSON throws if the type field has value other than 'http'", () => {
//   expect(() => OAuth2Scheme.fromJSON({ type: 'apiKey', flows: {} }, parent)).toThrow();
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     type: 'oauth2',
//     description: 'security',
//     flows: {
//       implicit: {
//         authorizationUrl: 'http://www.example.com/auth',
//         'x-flow': 'flow2',
//       },
//     },
//     'x-one': 1,
//   };
//   const scheme = OAuth2Scheme.fromJSON(json, parent);
//   expect(scheme.type).toBe('oauth2');
//   expect(scheme.toJSON()).toEqual(json);
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import OpenIdConnectScheme from './OpenIdConnectScheme';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('SecurityScheme.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON throws without required data', () => {
//   expect(() => OpenIdConnectScheme.fromJSON({}, parent));
//   expect(() => OpenIdConnectScheme.fromJSON({ type: 'opeenIdConnect' }, parent));
//   expect(() =>
//     OpenIdConnectScheme.fromJSON({ type: 'opeenIdConnect', description: 'scheme' }, parent),
//   );
// });

// it("fromJSON throws if the type field has value other than 'http'", () => {
//   expect(() =>
//     OpenIdConnectScheme.fromJSON({ type: 'http', name: 'x', in: 'cookie' }, parent),
//   ).toThrow();
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     type: 'openIdConnect',
//     description: 'security',
//     openIdConnectUrl: 'http://openid.example.com',
//     'x-one': 1,
//   };
//   const scheme = OpenIdConnectScheme.fromJSON(json, parent);
//   expect(scheme.type).toBe('openIdConnect');
//   expect(scheme.toJSON()).toEqual(json);
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';
// import { JSONObject } from '../jsonUtils';

// import SecurityScheme from '.';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('SecurityScheme.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it.each([
//   ['apiKey', { type: 'apiKey', name: 'sessionId', in: 'cookie' }],
//   ['http', { type: 'http', scheme: 'bearer' }],
//   ['oauth2', { type: 'oauth2', flows: {} }],
//   [
//     'openIdConnect',
//     {
//       type: 'openIdConnect',
//       openIdConnectUrl: 'http://www.example.com/openid',
//     },
//   ],
// ] as [string, JSONObject][])('recognizes %s security scheme type', (_name, json) => {
//   expect(SecurityScheme.fromJSON(json, parent)).not.toBeNull();
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import HttpScheme from './HttpScheme';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('SecurityScheme.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON throws without required data', () => {
//   expect(() => HttpScheme.fromJSON({}, parent));
//   expect(() => HttpScheme.fromJSON({ type: 'http' }, parent));
//   expect(() => HttpScheme.fromJSON({ type: 'http', description: 'scheme' }, parent));
// });

// it("fromJSON throws if the type field has value other than 'http'", () => {
//   expect(() => HttpScheme.fromJSON({ type: 'apiKey', name: 'x', in: 'cookie' }, parent)).toThrow();
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     type: 'http',
//     description: 'security',
//     scheme: 'bearer',
//     bearerFormat: 'cookie',
//     'x-one': 1,
//   };
//   const scheme = HttpScheme.fromJSON(json, parent);
//   expect(scheme.type).toBe('http');
//   expect(scheme.toJSON()).toEqual(json);
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';
// import { JSONObject } from '../jsonUtils';

// import Schema from '.';

// let components: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('Schema.test', '0.1.0');
//   components = openapi.components;
// });

// it('fromJSON works', () => {
//   const schema = Schema.fromJSON(
//     {
//       anyOf: [
//         { type: 'boolean' },
//         { type: 'integer' },
//         { type: 'number' },
//         {
//           allOf: [
//             { not: { type: 'string' } },
//             { oneOf: [{ type: 'array', items: { type: 'object' } }] },
//           ],
//         },
//       ],
//     },
//     components,
//   );

//   expect(schema).not.toBeNull();
//   expect(
//     (((schema as unknown as JSONObject).anyOf as JSONObject[])[3].allOf as JSONObject[])[0].not,
//   ).not.toBeNull();
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import { ParserFunc } from './Schema';
// import BooleanSchema from './BooleanSchema';

// let components: Components;
// let fromJSON: ParserFunc;

// beforeEach(() => {
//   const openapi = new OpenAPI('BooleanSchema.test', '0.1.0');
//   components = openapi.components;
//   fromJSON = jest.fn();
// });

// describe('schemaFromJSON works', () => {
//   it('returns false for non-boolean schemas', () => {
//     expect(BooleanSchema.schemaFromJSON({ type: 'number' }, components, fromJSON)).toBeFalsy();
//   });

//   it('parses valid schema', () => {
//     expect(BooleanSchema.schemaFromJSON({ type: 'boolean' }, components, fromJSON)).toBeInstanceOf(
//       BooleanSchema,
//     );
//   });
// });

// it('toJSON works', () => {
//   const schema = new BooleanSchema(components);
//   expect(schema.toJSON()).toEqual({ type: 'boolean' });
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import QueryParameter from './QueryParameter';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('QueryParameter.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON must throw if in or name is missing', () => {
//   expect(() => QueryParameter.fromJSON({}, parent)).toThrow();
//   expect(() => QueryParameter.fromJSON({ name: 'param' }, parent)).toThrow();
//   expect(() => QueryParameter.fromJSON({ in: 'query' }, parent)).toThrow();
// });

// it('fromJSON must throw if the in attribute has wong value', () => {
//   expect(() => QueryParameter.fromJSON({ in: 'cookie', name: 'param' }, parent)).toThrow();
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     in: 'query',
//     name: 'queryParam',
//     required: true,
//     style: 'deepObject',
//     description: 'Lalala',
//     allowReserved: true,
//   };
//   expect(QueryParameter.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import PathParameter from './PathParameter';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('PathParameter.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON must throw if in or name is missing', () => {
//   expect(() => PathParameter.fromJSON({}, parent)).toThrow();
//   expect(() => PathParameter.fromJSON({ name: 'param' }, parent)).toThrow();
//   expect(() => PathParameter.fromJSON({ in: 'path' }, parent)).toThrow();
// });

// it('fromJSON must throw if the in attribute has wong value', () => {
//   expect(() => PathParameter.fromJSON({ in: 'cookie', name: 'param' }, parent)).toThrow();
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     in: 'path',
//     name: 'pathParam',
//     style: 'label',
//     description: 'Lalala',
//   };
//   expect(PathParameter.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import Parameter from '.';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('Parameter.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON should throw if in is missing or has wrong value', () => {
//   expect(() => Parameter.fromJSON({}, parent)).toThrow();
//   expect(() => Parameter.fromJSON({ name: 'someParam' }, parent)).toThrow();
//   expect(() => Parameter.fromJSON({ in: 'x', name: 'p' }, parent)).toThrow();
// });

// it('fromJSON should throw if both the schema and content are given', () => {
//   expect(() =>
//     Parameter.fromJSON(
//       {
//         in: 'path',
//         name: 'pathParam',
//         schema: { type: 'boolean' },
//         content: {
//           'application/json': {
//             schema: { type: 'boolean' },
//           },
//         },
//       },
//       parent,
//     ),
//   ).toThrow();
// });

// it('fromJSON should throw if both example and examples are given', () => {
//   expect(() => {
//     Parameter.fromJSON(
//       {
//         in: 'cookie',
//         name: 'cookieParam',
//         example: true,
//         examples: {
//           'application/json': {
//             example: true,
//           },
//         },
//       },
//       parent,
//     );
//   }).toThrow();
// });

// it.each([
//   ['cookie', { in: 'cookie', name: 'cookieParam' }],
//   ['header', { in: 'header', name: 'headerParam' }],
//   ['path', { in: 'path', name: 'pathParam' }],
//   ['query', { in: 'query', name: 'queryParam' }],
// ])('fromJSON should parse parameter of type %s', (_type, json) => {
//   expect(Parameter.fromJSON(json, parent)).not.toBeNull();
// });

// it('fromJSON + toJSON should be reversible with style + scheme', () => {
//   const json = {
//     in: 'cookie',
//     name: 'cookieParam',
//     required: true,
//     style: 'spaceDelimited',
//     description: 'Lalala',
//     explode: true,
//     deprecated: true,
//     schema: {
//       type: 'boolean',
//       nullable: true,
//     },
//     example: true,
//   };
//   expect(Parameter.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// it('fromJSON + toJSON should be reversible with style + scheme, and a single example', () => {
//   const json = {
//     in: 'query',
//     name: 'queryParam',
//     required: true,
//     style: 'spaceDelimited',
//     description: 'Lalala',
//     explode: true,
//     deprecated: true,
//     schema: {
//       type: 'boolean',
//       nullable: true,
//     },
//     example: true,
//   };
//   expect(Parameter.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// it('fromJSON + toJSON should be reversible with content, and multiple examples', () => {
//   const json = {
//     in: 'path',
//     name: 'pathParam',
//     content: {
//       'application/json': {
//         schema: {
//           type: 'array',
//           items: {
//             type: 'number',
//             nullable: true,
//           },
//         },
//       },
//     },
//     examples: {
//       'application/json': {
//         summary: 'json1',
//         description: 'JSON example',
//         value: [1, 2, 3],
//       },
//     },
//   };
//   expect(Parameter.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// -------------------------------------------------------------------------------------------------------------------------

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import HeaderParameter from './HeaderParameter';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('SecurityScheme.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON must throw if in or name is missing', () => {
//   expect(() => HeaderParameter.fromJSON({}, parent)).toThrow();
//   expect(() => HeaderParameter.fromJSON({ name: 'param' }, parent)).toThrow();
//   expect(() => HeaderParameter.fromJSON({ in: 'header' }, parent)).toThrow();
// });

// it('fromJSON must throw if the in attribute has wong value', () => {
//   expect(() => HeaderParameter.fromJSON({ in: 'cookie', name: 'param' }, parent)).toThrow();
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     in: 'header',
//     name: 'headerParam',
//     required: true,
//     description: 'Lalala',
//   };
//   expect(HeaderParameter.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// -------------------------------------------------------------------------------------------------------------------------

// import OpenAPI from '../OpenAPI';
// import Components from '../Components';

// import CookieParameter from './CookieParameter';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('CookieParameter.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON must throw if in or name is missing', () => {
//   expect(() => CookieParameter.fromJSON({}, parent)).toThrow();
//   expect(() => CookieParameter.fromJSON({ name: 'param' }, parent)).toThrow();
//   expect(() => CookieParameter.fromJSON({ in: 'cookie' }, parent)).toThrow();
// });

// it('fromJSON must throw if the in attribute has wong value', () => {
//   expect(() => CookieParameter.fromJSON({ in: 'path', name: 'param' }, parent)).toThrow();
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     in: 'cookie',
//     name: 'cookieParam',
//     required: true,
//     style: 'spaceDelimited',
//     description: 'Lalala',
//     'x-ext': 'absolutely awesome',
//   };
//   expect(CookieParameter.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// -------------------------------------------------------------------------------------------------------------------------

// import SecurityScheme from '../SecurityScheme';
// import OpenAPI from '../OpenAPI';
// import OAuth2Scheme from '../SecurityScheme/OAuth2Scheme';
// import { JSONObject } from '../jsonUtils';

// import OAuthFlow, { OAuthFlowType } from '.';

// let parent: SecurityScheme;

// beforeEach(() => {
//   const openapi = new OpenAPI('OAuthFlow.test', '0.0.1');
//   parent = new OAuth2Scheme(openapi.components);
// });

// it.each([
//   [
//     'implicit',
//     {
//       authorizationUrl: 'http://example.com/authorizationUrl',
//     },
//   ],
//   [
//     'password',
//     {
//       tokenUrl: 'http://example.com/tokenUrl',
//     },
//   ],
//   [
//     'clientCredentials',
//     {
//       tokenUrl: 'http://example.com/tokenUrl',
//     },
//   ],
//   [
//     'authorizationCode',
//     {
//       authorizationUrl: 'http://example.com/authorizationUrl',
//       tokenUrl: 'http://example.com/tokenUrl',
//     },
//   ],
// ] as [string, JSONObject][])('fromJSON can parse OAuth flow of type %s', (type, json) => {
//   expect(OAuthFlow.fromJSON(json, type as OAuthFlowType, parent).toJSON()).toEqual(json);
// });

// -------------------------------------------------------------------------------------------------------------------------

// import { JSONObject } from './jsonUtils';
// import OpenAPI from './OpenAPI';
// import { serverVariableFromJSON, tagFromJSON } from './load';
// import Server from './Server';

// test('load', () => {
//   expect(1).toBe(1);
// });

// describe('ServerVariable', () => {
//   let server: Server;

//   beforeEach(() => {
//     const openapi = new OpenAPI('ServerVariable.test', '0.0.1');
//     server = new Server(openapi, 'http://api.example.com');
//   });

//   it('fromJSON throws if required data is missing', () => {
//     expect(() => serverVariableFromJSON({}, server)).toThrow();
//     expect(() => serverVariableFromJSON({ enum: ['1'] }, server)).toThrow();
//   });

//   // it('fromJSON + toJSON, non-enumerable variable', () => {
//   //   const json = {
//   //     default: 'v1',
//   //     enum: [],
//   //     'x-one': 1,
//   //   };
//   //   const serverVariable = serverVariableFromJSON(json, server);
//   //   expect(serverVariable.description).toBeNull();
//   //   expect(serverVariable.enum).toBeNull();
//   //   expect(serverVariable.toJSON()).toEqual({ default: 'v1', 'x-one': 1 });
//   // });

//   // it('fromJSON + toJSON, all data present', () => {
//   //   const json = {
//   //     default: 'v1',
//   //     description: 'API versions',
//   //     enum: ['v1', 'v1.1', 'v2'],
//   //     'x-two': 2,
//   //   };
//   //   expect(serverVariableFromJSON(json, server).toJSON()).toEqual(json);
//   // });
// });

// describe('Tag', () => {
//   let parent: OpenAPI;

//   beforeEach(() => {
//     parent = new OpenAPI('Tag.test', '0.0.1');
//   });

//   it('fromJSON with missing required data should throw', () => {
//     expect(() => tagFromJSON(null as unknown as JSONObject, parent)).toThrow();
//     expect(() => tagFromJSON({ description: 'tag' }, parent)).toThrow();
//   });

//   it('fromJSON + toJSON with only required data', () => {
//     const json = { name: 'example' };
//     const tag = tagFromJSON(json, parent);
//     expect(tag.description).toBeNull();
//     expect(tag.externalDocs).toBeNull();
//     // expect(tag.toJSON()).toEqual(json);
//   });

//   // it('fromJSON + toJSON with all data', () => {
//   //   const json = {
//   //     name: 'new',
//   //     description: 'a new tag',
//   //     externalDocs: {
//   //       url: 'http://www.example.com/docs',
//   //       description: 'description',
//   //     },
//   //     'x-other': true,
//   //   };
//   //   expect(tagFromJSON(json, parent).toJSON()).toEqual(json);
//   // });
// });

// import Components from './Components';
// import OpenAPI from './OpenAPI';

// let parent: OpenAPI;

// beforeEach(() => {
//   parent = new OpenAPI('Components.test', '0.0.1');
// });

// it('toJSON returns null if the components is empty', () => {
//   const components = new Components(parent);
//   expect(components.toJSON()).toBeNull();
// });

// it('fromJSON + toJSON is reversible', () => {
//   const json = {
//     schemas: {
//       one: { type: 'string' },
//       two: { type: 'object' },
//     },
//     responses: {
//       resp1: {
//         description: 'response 1',
//       },
//       resp2: {
//         description: 'resp 2',
//       },
//     },
//     parameters: {
//       param1: { name: 'param1', in: 'path' },
//       param2: { name: 'param2', in: 'query' },
//     },
//   };
//   expect(Components.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import Contact from './Contact';
// import Info from './Info';
// import { JSONObject } from './jsonUtils';
// import OpenAPI from './OpenAPI';

// let info: Info;

// beforeEach(() => {
//   const openapi = new OpenAPI('test', '1.0.0');
//   info = openapi.info;
// });

// it('fromJSON', () => {
//   expect(Contact.fromJSON(null as unknown as JSONObject, info)).toBeNull();
//   expect(Contact.fromJSON({}, info)).toBeNull();

//   const contact = Contact.fromJSON(
//     { name: 'A', email: 'b@x.com', url: 'http://example.com' },
//     info,
//   );
//   expect(contact?.name).toBe('A');
//   expect(contact?.email).toBe('b@x.com');
//   expect(contact?.url).toBe('http://example.com');
// });

// it('toJSON', () => {
//   const contact = new Contact(info);
//   expect(contact.toJSON()).toStrictEqual({});
// });

// it('fromJSON + toJSON - all fields', () => {
//   const contactJson = {
//     name: 'AA',
//     email: 'user@example.com',
//     url: 'http://example.com',
//   };
//   expect(Contact.fromJSON(contactJson, info)?.toJSON()).toEqual(contactJson);
// });

// import Encoding from './Encoding';
// import MediaType from './MediaType';
// import OpenAPI from './OpenAPI';
// import RequestBody from './RequestBody';

// let parent: MediaType;

// beforeEach(() => {
//   const openapi = new OpenAPI('Encoding.test', '0.0.1');
//   const requestBody = new RequestBody(openapi.components);
//   parent = new MediaType(requestBody);
// });

// it('fromJSON throws if the contentType attribute is missing', () => {
//   expect(() => Encoding.fromJSON({}, parent)).toThrow();
// });

// it('fromJSON + toJSON are reversible', () => {
//   const json = {
//     contentType: 'application/json',
//     headers: {
//       'x-limit': {},
//       'x-threshold': {},
//     },
//     style: 'deepObject',
//     explode: true,
//     allowReserved: true,
//   };
//   expect(Encoding.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import OpenAPI from './OpenAPI';
// import Components from './Components';
// import Example from './Example';
// import { JSONValue } from './jsonUtils';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('Example.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON should throw if value and externalValue are supplied', () => {
//   expect(() =>
//     Example.fromJSON(
//       {
//         value: 1,
//         externalValue: 'http://www.example.com',
//       },
//       parent,
//     ),
//   ).toThrow();
// });

// it('fromJSON + toJSON with all the data should give the same value as input', () => {
//   const json = {
//     summary: 'example',
//     description: 'description',
//     value: [{ a: 1 }, { b: 2 }] as JSONValue,
//     'x-one': 123,
//   };
//   expect(Example.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import fs from 'fs';
// import path from 'path';

// import { detailedDiff } from 'deep-object-diff';
// import yaml from 'js-yaml';

// import { JSONObject } from './jsonUtils';
// import OpenAPI from './OpenAPI';

// type DetailedDiff = {
//   added: Record<string, JSONObject>;
//   deleted: Record<string, JSONObject>;
//   updated: Record<string, JSONObject>;
// };

// it.each([['simple'], ['petstore'], ['uspto'], ['callback'], ['api'], ['link']])(
//   '%s',
//   (example: string) => {
//     const inputData = yaml.load(
//       fs.readFileSync(path.join(__dirname, '..', 'examples', `${example}.yaml`), 'utf-8'),
//     ) as JSONObject;

//     const openapi = OpenAPI.fromJSON(inputData);
//     const outputData = openapi.toJSON() as JSONObject;
//     const dataDiff = detailedDiff(inputData, outputData) as DetailedDiff;

//     const diffCount = Object.entries(dataDiff).reduce((accum, [, diffs]) => {
//       return accum + Object.keys(diffs).length;
//     }, 0);

//     if (diffCount > 0) {
//       fs.writeFileSync(
//         path.join(__dirname, '..', 'examples', `${example}-out.yaml`),
//         yaml.dump(outputData),
//         'utf-8',
//       );

//       fs.writeFileSync(
//         path.join(__dirname, '..', 'examples', `${example}-diff.yaml`),
//         yaml.dump(detailedDiff(inputData, outputData)),
//         'utf-8',
//       );
//     }

//     expect(dataDiff).toEqual({
//       added: {},
//       deleted: {},
//       updated: {},
//     });
//   },
// );

// import { JSONObject } from './jsonUtils';
// import OpenAPI from './OpenAPI';
// import ExternalDocumentation from './ExternalDocumentation';

// let parent: OpenAPI;

// beforeEach(() => {
//   parent = new OpenAPI('Tag.test', '0.0.1');
// });

// it('fromJSON without required data should throw', () => {
//   expect(() => ExternalDocumentation.fromJSON(null as unknown as JSONObject, parent)).toThrow();
//   expect(() => ExternalDocumentation.fromJSON({ description: 'docs' }, parent)).toThrow();
// });

// it('fromJSON + toJSON with all the data', () => {
//   const json = {
//     url: 'http://www.example.com/docs',
//     description: 'new docs',
//     'x-field': { a: 12 },
//   };
//   expect(ExternalDocumentation.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import Header from './Header';
// import Components from './Components';
// import OpenAPI from './OpenAPI';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('Header.test', '0.0.1');
//   parent = openapi.components;
// });

// it('fromJSON throws if both the content and schema are given at the same time', () => {
//   expect(() => Header.fromJSON({ content: {}, schema: { type: 'string' } }, parent)).toThrow();
// });

// it('fromJSON throws if both example and examples are given at the same time', () => {
//   expect(() => Header.fromJSON({ example: null, examples: {} }, parent)).toThrow();
// });

// it('fromJSON + toJSON are reversible', () => {
//   const json = {
//     description: 'desc',
//     required: true,
//     deprecated: true,
//     explode: true,
//     schema: {
//       type: 'object',
//       properties: {
//         a: {
//           type: 'string',
//           nullable: true,
//         },
//       },
//       additionalProperties: false,
//     },
//     example: {
//       a: '1234',
//     },
//     'x-ext': 123,
//   };
//   expect(Header.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import OpenAPI from './OpenAPI';
// import Info from './Info';
// import { JSONObject } from './jsonUtils';

// let openapi: OpenAPI;

// beforeEach(() => {
//   openapi = new OpenAPI('Info.test', '0.0.1');
// });

// it('fromJSON returns null for nullish input', () => {
//   expect(Info.fromJSON(null as unknown as JSONObject, openapi)).toBeNull();
// });

// it('fromJSON throws if input missing required data', () => {
//   expect(() => Info.fromJSON({}, openapi)).toThrow();
//   expect(() => Info.fromJSON({ title: 'X' }, openapi)).toThrow();
//   expect(() => Info.fromJSON({ version: '0.0.1' }, openapi)).toThrow();
// });

// it('fromJSON + toJSON, only required data', () => {
//   const json = {
//     title: 'only required',
//     version: '2.1.3',
//   };
//   expect(Info.fromJSON(json, openapi)?.toJSON()).toEqual(json);
// });

// it('fromJSON + toJSON, missing contact and license info', () => {
//   const json = {
//     title: 'test1',
//     description: 'test1 - description',
//     termsOfService: 'http://www.example.com/terms',
//     version: '0.0.1',
//   };
//   expect(Info.fromJSON(json, openapi)?.toJSON()).toEqual(json);
// });

// it('fromJSON + toJSON, all data present', () => {
//   const json = {
//     title: 'test all',
//     description: 'description',
//     termsOfService: 'http://www.example.com/terms',
//     version: '1.0.1',
//     'x-one': true,
//     contact: {
//       name: 'Some developer',
//       url: 'http://www.example.com/developer',
//       email: 'someone@example.com',
//       'x-two': false,
//     },
//     license: {
//       name: 'MIT',
//       url: 'https://opensource.org/licenses/MIT',
//       'x-three': 123,
//     },
//   };
//   expect(Info.fromJSON(json, openapi)?.toJSON()).toEqual(json);
// });

// import Info from './Info';
// import { JSONObject } from './jsonUtils';
// import License from './License';
// import OpenAPI from './OpenAPI';

// let info: Info;

// beforeEach(() => {
//   const openapi = new OpenAPI('Link.test', '0.0.1');
//   info = openapi.info;
// });

// it('fromJSON missing or invalid name', () => {
//   expect(License.fromJSON(null as unknown as JSONObject, info)).toBeNull();
//   expect(() => License.fromJSON({}, info)).toThrow();
//   expect(() => License.fromJSON({ name: null }, info)).toThrow();
// });

// it('fromJSON + toJSON partial', () => {
//   const license = License.fromJSON({ name: 'MIT' }, info);
//   expect(license?.name).toBe('MIT');
//   expect(license?.url).toBe(null);
//   expect(license?.toJSON()).toEqual({ name: 'MIT' });
// });

// it('fromJSON + toJSON', () => {
//   const json = { name: 'MIT', url: 'https://opensource.org/licenses/MIT' };
//   expect(License.fromJSON(json, info)?.toJSON()).toEqual(json);
// });

// import MediaType from './MediaType';
// import OpenAPI from './OpenAPI';
// import RequestBody from './RequestBody';

// let parent: RequestBody;

// beforeEach(() => {
//   const openapi = new OpenAPI('MediaType.test', '0.0.1');
//   parent = new RequestBody(openapi.components);
// });

// it('fromJSON throws if both example and examples are given', () => {
//   expect(() => MediaType.fromJSON({ example: '123', examples: {} }, parent)).toThrow();
// });

// it('fromJSON + toJSON are reversible', () => {
//   const json = {
//     schema: {
//       type: 'object',
//       properties: {
//         attr: { type: 'string', nullable: true },
//       },
//     },
//     example: 'abcd',
//     encoding: {
//       attr: {
//         contentType: 'application/string',
//         style: 'deepObject',
//       },
//     },
//   };
//   expect(MediaType.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import OpenAPI from './OpenAPI';

// const SIMPLE = {
//   openapi: '3.0.3',
//   info: {
//     version: '1.0.0-rc2',
//     title: 'Sample API',
//     description: 'A sample API to illustrate OpenAPI concepts',
//     contact: {
//       name: 'Author',
//       email: 'dev@example.com',
//     },
//   },
//   paths: {
//     '/list': {
//       get: {
//         description: 'Returns a list of stuff',
//         responses: {
//           '200': {
//             description: 'Successful response',
//           },
//         },
//       },
//     },
//   },
// };

// describe('OpenAPINode', () => {
//   it('creates an empty object by default', () => {
//     const openapi = new OpenAPI('sample', '1.0.0');
//     expect(openapi.openapi).toBe('3.0.3');
//     expect(openapi.info.title).toBe('sample');
//     expect(openapi.info.version).toBe('1.0.0');
//     expect(openapi.servers).toStrictEqual([]);
//   });

//   it('should be able to parse a simple schema', () => {
//     const openapi = OpenAPI.fromJSON(SIMPLE);

//     expect(openapi.info.title).toBe('Sample API');
//     expect(openapi.info.version).toBe('1.0.0-rc2');
//     expect(openapi.info.parent).toBe(openapi);

//     expect(openapi.info.contact?.name).toBe('Author');
//     expect(openapi.info.contact?.parent).toBe(openapi.info);
//     expect(openapi.info.contact?.root).toBe(openapi);

//     // const pathItems = openapi.paths;
//     // expect(pathItems.size).toBe(1);
//   });
// });

// import OpenAPI from './OpenAPI';
// import Operation from './Operation';
// import PathItem from './PathItem';

// let parent: PathItem;

// beforeEach(() => {
//   const openapi = new OpenAPI('Operation.test', '0.0.1');
//   parent = new PathItem(openapi.paths);
// });

// it('fromJSON throws if the responses field is missing or is empty', () => {
//   expect(() => Operation.fromJSON({ summary: 'op1' }, parent)).toThrow();
//   expect(() => Operation.fromJSON({ summary: 'op2', responses: {} }, parent)).toThrow();
// });

// it('fromJSON + toJSON are reversible', () => {
//   const json = {
//     tags: ['list', 'basic'],
//     summary: 'list uses',
//     description: 'Lists available *shops*',
//     operationId: 'readUserList',
//     parameters: [
//       { name: 'query', in: 'query' },
//       { name: 'offset', in: 'query' },
//       { name: 'count', in: 'query' },
//     ],
//     responses: {
//       200: {
//         description: 'Success',
//         content: {
//           'application/json': {
//             schema: {
//               type: 'array',
//               items: {
//                 type: 'string',
//               },
//             },
//           },
//         },
//       },
//       401: {
//         description: 'Unauthorizes user',
//       },
//     },
//   };
//   expect(Operation.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import OpenAPI from './OpenAPI';
// import PathItem from './PathItem';

// let parent: OpenAPI;

// beforeEach(() => {
//   parent = new OpenAPI('PathItem.test', '0.0.1');
// });

// it('fromJSON should throw if it encountes unknown method', () => {
//   expect(() =>
//     PathItem.fromJSON({ teapot: { responses: { 'application/json': {} } } }, parent.paths),
//   ).toThrow();
// });

// it('fromJSON + toJSON are reversible', () => {
//   const json = {
//     summary: 'summary',
//     description: 'description',
//     servers: [{ url: 'http://api.example.com' }],
//     parameters: [
//       { name: 'search', in: 'query' },
//       { name: 'offset', in: 'query' },
//       { name: 'count', in: 'query' },
//     ],
//     get: {
//       responses: {
//         200: {
//           description: 'success',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'string',
//               },
//             },
//           },
//         },
//       },
//     },
//     'x-ext': 123,
//   };
//   expect(PathItem.fromJSON(json, parent.paths).toJSON()).toEqual(json);
// });

// import Components from './Components';
// import OpenAPI from './OpenAPI';
// import RequestBody from './RequestBody';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('RequestBody.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON + toJSON should be revesible', () => {
//   const json = {
//     description: 'request body',
//     content: {
//       'application/json': {
//         schema: {
//           type: 'string',
//         },
//       },
//       'application/text': {
//         example: 'textual request body',
//       },
//     },
//     required: true,
//   };
//   expect(RequestBody.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import Components from './Components';
// import OpenAPI from './OpenAPI';
// import Response from './Response';

// let parent: Components;

// beforeEach(() => {
//   const openapi = new OpenAPI('Response.test', '0.0.1');
//   parent = new Components(openapi);
// });

// it('fromJSON should throw if not description has been given', () => {
//   expect(() => Response.fromJSON({ headers: {}, content: {}, links: {} }, parent)).toThrow();
// });

// it('fromJSON throws on duplicate headers', () => {
//   expect(() =>
//     Response.fromJSON(
//       {
//         description: 'complete response',
//         headers: {
//           'accept-language': {},
//           'Accept-Language': {},
//         },
//       },
//       parent,
//     ),
//   ).toThrow();
// });

// it('fromJSON ignores content-type header', () => {
//   expect(
//     Response.fromJSON(
//       {
//         description: 'complete response',
//         headers: {
//           'content-type': {},
//           'x-schema': {},
//         },
//       },
//       parent,
//     ).toJSON(),
//   ).toEqual({
//     description: 'complete response',
//     headers: {
//       'x-schema': {},
//     },
//   });
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     description: 'complete response',
//     headers: {
//       'x-language': {},
//       'x-schema': {},
//     },
//     content: {
//       'application/json': {
//         schema: {
//           type: 'string',
//         },
//       },
//       'application/text': {
//         example: 'string example',
//       },
//     },
//     links: {
//       link1: { operationId: 'op1' },
//       link2: { operationId: 'op2' },
//     },
//   };
//   expect(Response.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import OpenAPI from './OpenAPI';
// import SecurityRequirement from './SecurityRequirement';

// let parent: OpenAPI;

// beforeEach(() => {
//   parent = new OpenAPI('Tag.test', '0.0.1');
// });

// it('does not support extensions, treating them as scheme names', () => {
//   expect(
//     SecurityRequirement.fromJSON(
//       {
//         api: [],
//         'x-ext': [],
//       },
//       parent,
//     ).toJSON(),
//   ).toEqual({ api: [], 'x-ext': [] });
// });

// it('fromJSON + toJSON should be reversible', () => {
//   const json = {
//     api1: ['user:read', 'user:write'],
//     http2: [],
//     cookie3: [],
//   };
//   expect(SecurityRequirement.fromJSON(json, parent).toJSON()).toEqual(json);
// });

// import { JSONObject } from './jsonUtils';
// import OpenAPI from './OpenAPI';
// import Server from './Server';

// let parent: OpenAPI;

// beforeEach(() => {
//   parent = new OpenAPI('Server.test', '0.0.1');
// });

// it('fromJSON throws when missing required data', () => {
//   expect(() => Server.fromJSON(null as unknown as JSONObject, parent)).toThrow();
//   expect(() => Server.fromJSON({}, parent)).toThrow();
// });

// it('fromJSON throws when variable data is missing', () => {
//   const json = {
//     url: 'http://{version}.example.com/{rootPath}',
//     description: 'API server',
//     variables: {
//       version: {
//         default: 'v2',
//         description: 'latest',
//         enum: ['v1', 'v2'],
//       },
//     },
//     'x-one': 1,
//   };
//   expect(() => Server.fromJSON(json, parent)).toThrow();
// });

// it('fromJSON + toJSON, all data', () => {
//   const json = {
//     url: 'http://{version}.example.com',
//     description: 'API server',
//     variables: {
//       version: {
//         default: 'v2',
//         description: 'latest',
//         enum: ['v1', 'v2'],
//       },
//     },
//     'x-one': 1,
//   };
//   expect(Server.fromJSON(json, parent).toJSON()).toEqual(json);
// });
