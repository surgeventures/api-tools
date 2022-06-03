import fs from 'fs';
import path from 'path';

import yaml from 'yaml';

import { OpenAPI } from './OpenAPI';
import { OpenAPIReader } from './OpenAPIReader';
import { OpenAPIWriter } from './OpenAPIWriter';

import type { JSONObject } from '@fresha/api-tools-core';

test('barebones schema', () => {
  const openapi = new OpenAPI('Barebones', '1.2.3');

  const writer = new OpenAPIWriter();
  const json = writer.write(openapi);

  expect(json).toStrictEqual({
    openapi: '3.0.3',
    info: {
      title: 'Barebones',
      version: '1.2.3',
    },
    paths: {},
  });
});

test.each(['api', 'callback', 'link', 'petstore', 'simple', 'uspto'])('example - %s', stem => {
  const reader = new OpenAPIReader();

  const inputText = fs.readFileSync(
    path.join(__dirname, '..', '..', 'examples', `${stem}.yaml`),
    'utf-8',
  );
  const inputData = yaml.parse(inputText) as JSONObject;

  const openapi = reader.parse(inputData);

  const writer = new OpenAPIWriter();
  const outputData = writer.write(openapi);

  expect(outputData).toStrictEqual(inputData);
});
