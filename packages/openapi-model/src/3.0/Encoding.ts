import { BasicNode } from './BasicNode';

import type { Header, HeaderReference } from './Header';
import type { MediaType } from './MediaType';
import type { IEncoding } from './types';

export type EncodingParent = MediaType;

export type SerializationStyle = 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#encoding-object
 */
export class Encoding extends BasicNode<EncodingParent> implements IEncoding {
  contentType: string;
  headers: Map<string, Header | HeaderReference>;
  style: SerializationStyle;
  explode: boolean;
  allowReserved: boolean;

  constructor(parent: EncodingParent, contentType: string) {
    super(parent);
    this.contentType = contentType;
    this.headers = new Map<string, Header | HeaderReference>();
    this.style = 'form';
    this.explode = false;
    this.allowReserved = false;
  }
}
