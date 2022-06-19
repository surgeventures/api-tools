import type { OpenAPI } from './OpenAPI';
import type { JSONValue } from '@fresha/api-tools-core';

export interface TreeParent {
  root: OpenAPI;
}

export type ExtensionFields = Map<string, JSONValue>;

export class BasicNode<TParent extends TreeParent> implements TreeParent {
  root: OpenAPI;
  parent: TParent;
  // http://spec.openapis.org/oas/v3.0.3#specificationExtensions
  readonly extensionFields: ExtensionFields;

  constructor(parent: TParent) {
    this.parent = parent;
    this.root = parent.root;
    this.extensionFields = new Map<string, JSONValue>();
  }

  // eslint-disable-next-line class-methods-use-this
  dispose(): void {}
}
