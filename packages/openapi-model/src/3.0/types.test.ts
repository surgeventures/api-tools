import fs from 'fs';
import path from 'path';

import yaml from 'yaml';

import { OpenAPI } from './OpenAPI';
import { OpenAPIWriter } from './OpenAPIWriter';

import type { IOpenAPI } from './types';
import type { JSONObject } from '@fresha/api-tools-core';

test('how easy is to use this class', () => {
  const api: IOpenAPI = new OpenAPI('Test of this class ease of use', '0.1.0');

  api.info.contact.name = 'developers';
  api.info.contact.url = 'https://www.examples.com';

  api.addServer('http://localhost:{port}', { port: '4700' }, 'local');
  api.addServer('https://partners-api-{namespace}.{domain}', {
    namespace: 'staging',
    domain: 'dev.fresha.io',
  });
  api.addServer('https://partners-app.fresha.com');

  const pathItem = api.addPathItem('/api/v1');
  const operation = pathItem.addOperation('get');

  expect(pathItem.get).toBe(operation);
});

test('build schema - simple', () => {
  const api: IOpenAPI = new OpenAPI('Sample API', '1.0.0');
  api.info.description = 'A sample API to illustrate OpenAPI concepts';

  const pathItem = api.addPathItem('/list');
  const operation = pathItem.addOperation('get');
  operation.description = 'Returns a list of stuff';
  operation.responses.addResponse(200, 'Successful response');

  const writer = new OpenAPIWriter();
  const outputData = writer.write(api as OpenAPI);

  const inputText = fs.readFileSync(
    path.join(__dirname, '..', '..', 'examples', 'simple.yaml'),
    'utf-8',
  );
  const inputData = yaml.parse(inputText) as JSONObject;

  expect(outputData).toStrictEqual(inputData);
});

test('build schema - petstore', () => {
  const api: IOpenAPI = new OpenAPI('Swagger Petstore', '1.0.0');

  // info
  api.info.description =
    'A sample API that uses a petstore as an example to demonstrate features in the OpenAPI 3.0 specification';
  api.info.termsOfService = 'http://swagger.io/terms/';
  api.info.contact.name = 'Swagger API Team';
  api.info.contact.email = 'apiteam@swagger.io';
  api.info.contact.url = 'http://swagger.io';
  api.info.license.name = 'Apache 2.0';
  api.info.license.url = 'https://www.apache.org/licenses/LICENSE-2.0.html';

  // servers
  api.addServer('http://petstore.swagger.io/api');

  // pathItems
  const collectionPathItem = api.addPathItem('/pets');

  const findPetsOperation = collectionPathItem.addOperation('get');
  findPetsOperation.description = `Returns all pets from the system that the user has access to
Nam sed condimentum est. Maecenas tempor sagittis sapien, nec rhoncus sem sagittis sit amet. Aenean at gravida augue, ac iaculis sem. Curabitur odio lorem, ornare eget elementum nec, cursus id lectus. Duis mi turpis, pulvinar ac eros ac, tincidunt varius justo. In hac habitasse platea dictumst. Integer at adipiscing ante, a sagittis ligula. Aenean pharetra tempor ante molestie imperdiet. Vivamus id aliquam diam. Cras quis velit non tortor eleifend sagittis. Praesent at enim pharetra urna volutpat venenatis eget eget mauris. In eleifend fermentum facilisis. Praesent enim enim, gravida ac sodales sed, placerat id erat. Suspendisse lacus dolor, consectetur non augue vel, vehicula interdum libero. Morbi euismod sagittis libero sed lacinia.

Sed tempus felis lobortis leo pulvinar rutrum. Nam mattis velit nisl, eu condimentum ligula luctus nec. Phasellus semper velit eget aliquet faucibus. In a mattis elit. Phasellus vel urna viverra, condimentum lorem id, rhoncus nibh. Ut pellentesque posuere elementum. Sed a varius odio. Morbi rhoncus ligula libero, vel eleifend nunc tristique vitae. Fusce et sem dui. Aenean nec scelerisque tortor. Fusce malesuada accumsan magna vel tempus. Quisque mollis felis eu dolor tristique, sit amet auctor felis gravida. Sed libero lorem, molestie sed nisl in, accumsan tempor nisi. Fusce sollicitudin massa ut lacinia mattis. Sed vel eleifend lorem. Pellentesque vitae felis pretium, pulvinar elit eu, euismod sapien.
`;
  findPetsOperation.operationId = 'findPets';

  const addPetOperation = collectionPathItem.addOperation('post');
  addPetOperation.description = 'Creates a new pet in the store. Duplicates are allowed';
  addPetOperation.operationId = 'addPet';

  const itemPathItem = api.addPathItem('/pets/{id}');

  const getPetOperation = itemPathItem.addOperation('get');
  getPetOperation.description =
    'Returns a user based on a single ID, if the user does not have access to the pet';
  getPetOperation.operationId = 'find pet by id';

  const deletePetOperation = itemPathItem.addOperation('delete');
  deletePetOperation.description = 'deletes a single pet based on the ID supplied';
  deletePetOperation.operationId = 'deletePet';

  // components
  const newPetSchema = api.components.addSchema('NewPet', 'object');
  // newPetSchema.addProperty('name', 'string', true);
  // newPetSchema.addProperty('tag', 'string');

  const errorSchema = api.components.addSchema('Error', 'object');
  // errorSchema.addProperty('code', 'integer', true);
  // errorSchema.addProperty('message', 'string', true);

  const petSchema = api.components.addSchema('Pet', 'allOf');
  // petSchema.addAlternative(newPetSchema.reference);

  // const petIdSchema = petSchema.addAlternativeObjectSchema();
  // petIdSchema.addProperty('id', 'integer', true);

  global.console.log(!!petSchema, !!newPetSchema, !!errorSchema);

  // tags
  api.addTag('tag1').description = 'The first tag';
  api.addTag('tag2').description = 'Second tag';

  //
  // comparison
  //

  const writer = new OpenAPIWriter();
  const outputData = writer.write(api as OpenAPI);

  const inputText = fs.readFileSync(
    path.join(__dirname, '..', '..', 'examples', 'petstore.yaml'),
    'utf-8',
  );
  const inputData = yaml.parse(inputText) as JSONObject;

  expect(outputData).toStrictEqual(inputData);
});
