import { BasicNode } from './BasicNode';

import type { Components } from './Components';
import type { Header } from './Header';
import type { Link, LinkReference } from './Link';
import type { MediaType } from './MediaType';
import type { Reference } from './Reference';
import type { Responses } from './Responses';
import type { IResponse } from './types';

export type ResponseParent = Components | Responses;

export type ResponseReference = Reference<Response, ResponseParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#response-object
 */
export class Response extends BasicNode<ResponseParent> implements IResponse {
  description: string;
  headers: Map<string, Header>;
  content: Map<string, MediaType>;
  links: Map<string, Link | LinkReference>;

  constructor(parent: ResponseParent, description: string) {
    super(parent);
    this.description = description;
    this.headers = new Map<string, Header>();
    this.content = new Map<string, MediaType>();
    this.links = new Map<string, Link | LinkReference>();
  }
}
