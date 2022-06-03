import { BasicNode } from './BasicNode';
import { Response } from './Response';

import type { Operation } from './Operation';
import type { Reference } from './Reference';
import type { HTTPStatusCode, IResponse, IResponses } from './types';
import type { CommonMarkString } from '@fresha/api-tools-core';

export type ResponsesParent = Operation;
export type ResponsesReference = Reference<Responses, ResponsesParent>;

/**
 * @see https://spec.openapis.org/oas/v3.0.3#responses-object
 */
export class Responses extends BasicNode<ResponsesParent> implements IResponses {
  default: Response | null;
  codes: Map<HTTPStatusCode, Response>;

  constructor(parent: ResponsesParent) {
    super(parent);
    this.default = null; // new Response(this, 'Default');
    this.codes = new Map<HTTPStatusCode, Response>();
  }

  addResponse(code: HTTPStatusCode, description: CommonMarkString): IResponse {
    if (this.codes.has(code)) {
      throw new Error(`Duplicate response for code ${code}`);
    }
    const response = new Response(this, description);
    this.codes.set(code, response);
    return response;
  }

  removeResponse(code: HTTPStatusCode): void {
    this.codes.delete(code);
  }

  clearResponses(): void {
    this.codes.clear();
  }
}
