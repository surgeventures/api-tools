import { BasicNode } from './BasicNode';

import type { Reference } from './Reference';
import type { Server } from './Server';
import type { IServerVariable } from './types';
import type { Nullable } from '@fresha/api-tools-core';

export type ServerVariableParent = Server;

export type ServerVariableReference = Reference<ServerVariable, ServerVariableParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#server-variable-object
 */
export class ServerVariable extends BasicNode<ServerVariableParent> implements IServerVariable {
  enum: Nullable<string[]>;
  default: string;
  description: Nullable<string>;

  constructor(parent: ServerVariableParent, defaultValue: string) {
    super(parent);
    this.enum = null;
    this.default = defaultValue;
    this.description = null;
  }
}
