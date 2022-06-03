import { BasicNode } from './BasicNode';
import { Operation } from './Operation';

import type { Callback } from './Callback';
import type { Parameter, ParameterReference } from './Parameter';
import type { Paths } from './Paths';
import type { Reference } from './Reference';
import type { Server } from './Server';
import type { IPathItem, IOperation, HTTPMethod } from './types';
import type { Nullable } from '@fresha/api-tools-core';

export const httpMethods: HTTPMethod[] = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
];

export const whitelistedProperties = [
  ...httpMethods,
  '$ref',
  'summary',
  'description',
  'servers',
  'parameters',
];

export type PathItemParent = Paths | Callback;

export type PathItemReference = Reference<PathItem, PathItemParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#path-item-object
 */
export class PathItem extends BasicNode<PathItemParent> implements IPathItem {
  summary: Nullable<string>;
  description: Nullable<string>;
  readonly operations: Map<HTTPMethod, Operation>;
  servers: Server[];
  parameters: (Parameter | ParameterReference)[];

  constructor(parent: PathItemParent) {
    super(parent);
    this.summary = null;
    this.description = null;
    this.operations = new Map<HTTPMethod, Operation>();
    this.servers = [];
    this.parameters = [];
  }

  get get(): Nullable<IOperation> {
    return this.operations.get('get') ?? null;
  }

  get put(): Nullable<IOperation> {
    return this.operations.get('put') ?? null;
  }

  get post(): Nullable<IOperation> {
    return this.operations.get('post') ?? null;
  }

  get delete(): Nullable<IOperation> {
    return this.operations.get('delete') ?? null;
  }

  get options(): Nullable<IOperation> {
    return this.operations.get('options') ?? null;
  }

  get head(): Nullable<IOperation> {
    return this.operations.get('head') ?? null;
  }

  get patch(): Nullable<IOperation> {
    return this.operations.get('patch') ?? null;
  }

  get trace(): Nullable<IOperation> {
    return this.operations.get('trace') ?? null;
  }

  addOperation(method: HTTPMethod): IOperation {
    if (this.operations.has(method)) {
      throw new Error(`Duplicate ${method} operation`);
    }
    const operation = new Operation(this);
    this.operations.set(method, operation);
    return operation;
  }

  removeOperation(method: HTTPMethod): void {
    this.operations.delete(method);
  }

  clearOperations(): void {
    this.operations.clear();
  }
}
