import { BasicNode } from './BasicNode';

import type { Info } from './Info';
import type { IContact } from './types';
import type { Nullable, URLString, EmailString } from '@fresha/api-tools-core';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#contact-object
 */
export class Contact extends BasicNode<Info> implements IContact {
  name: Nullable<string>;
  url: Nullable<URLString>;
  email: Nullable<EmailString>;

  constructor(parent: Info) {
    super(parent);
    this.name = null;
    this.url = null;
    this.email = null;
  }
}
