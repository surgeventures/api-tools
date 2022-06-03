import { BasicNode } from './BasicNode';

import type { Components } from './Components';
import type { Operation } from './Operation';
import type { PathItem } from './PathItem';
import type { Reference } from './Reference';
import type { ParametrisedURLString, ICallback } from './types';

export type CallbackParent = Components | Operation;
export type CallbackReference = Reference<Callback, CallbackParent>;

/**
 * @see http://spec.openapis.org/oas/v3.0.3#callback-object
 */
export class Callback extends BasicNode<CallbackParent> implements ICallback {
  paths: Map<ParametrisedURLString, PathItem>;

  constructor(parent: CallbackParent) {
    super(parent);
    this.paths = new Map<ParametrisedURLString, PathItem>();
  }
}
