import { BasicNode } from './BasicNode';
import { Responses } from './Responses';

import type { Callback, CallbackReference } from './Callback';
import type { ExternalDocumentation } from './ExternalDocumentation';
import type { Parameter, ParameterReference } from './Parameter';
import type { PathItem } from './PathItem';
import type { Reference } from './Reference';
import type { RequestBody, RequestBodyReference } from './RequestBody';
import type { SecurityRequirement } from './SecurityRequirement';
import type { Server } from './Server';
import type { CommonMarkString, Nullable, IOperation } from './types';

export type OperationParent = PathItem;

export type OperationReference = Reference<Operation, OperationParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#operation-object
 */
export class Operation extends BasicNode<OperationParent> implements IOperation {
  tags: string[];
  summary: Nullable<string>;
  description: Nullable<CommonMarkString>;
  externalDocs: Nullable<ExternalDocumentation>;
  operationId: Nullable<string>;
  readonly parameters: (Parameter | ParameterReference)[];
  requestBody: Nullable<RequestBody | RequestBodyReference>;
  readonly responses: Responses;
  callbacks: Map<string, Callback | CallbackReference>;
  deprecated: boolean;
  security: Nullable<SecurityRequirement>;
  servers: Server[];

  constructor(parent: OperationParent) {
    super(parent);
    this.tags = [];
    this.summary = null;
    this.description = null;
    this.externalDocs = null;
    this.operationId = null;
    this.parameters = [];
    this.requestBody = null;
    this.responses = new Responses(this);
    this.callbacks = new Map<string, Callback | CallbackReference>();
    this.deprecated = false;
    this.security = null;
    this.servers = [];
  }

  addTag(name: string): void {
    if (this.tags.includes(name)) {
      throw new Error(`Duplicate tag ${name}`);
    }
    this.tags.push(name);
  }

  removeTag(name: string): void {
    const index = this.tags.indexOf(name);
    if (index >= 0) {
      this.removeTagAt(index);
    }
  }

  removeTagAt(index: number): void {
    this.tags.splice(index, 1);
  }

  clearTags(): void {
    this.tags.splice(0, this.tags.length);
  }
}
