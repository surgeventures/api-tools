import { BasicNode } from './BasicNode';

import type { Components } from './Components';
import type { MediaType } from './MediaType';
import type { Operation } from './Operation';
import type { Reference } from './Reference';
import type { IRequestBody } from './types';
import type { Nullable } from '@fresha/api-tools-core';

export type RequestBodyParent = Components | Operation;

export type RequestBodyReference = Reference<RequestBody, RequestBodyParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#request-body-object
 */
export class RequestBody extends BasicNode<RequestBodyParent> implements IRequestBody {
  description: Nullable<string>;
  content: Map<string, MediaType>;
  required: boolean;

  constructor(parent: RequestBodyParent) {
    super(parent);
    this.description = null;
    this.content = new Map<string, MediaType>();
    this.required = false;
  }
}
