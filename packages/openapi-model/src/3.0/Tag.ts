import { CommonMarkString, Nullable } from '@fresha/api-tools-core';

import { BasicNode } from './BasicNode';

import type { ExternalDocumentation } from './ExternalDocumentation';
import type { OpenAPI } from './OpenAPI';
import type { Reference } from './Reference';
import type { ITag } from './types';

export type TagParent = OpenAPI;

export type TagReference = Reference<Tag, TagParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#tag-object
 */
export class Tag extends BasicNode<TagParent> implements ITag {
  name: string;
  description: Nullable<CommonMarkString>;
  externalDocs: Nullable<ExternalDocumentation>;

  constructor(parent: TagParent, name: string) {
    super(parent);
    this.name = name;
    this.description = null;
    this.externalDocs = null;
  }
}
