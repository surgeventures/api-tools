import { BasicNode, TreeParent } from './BasicNode';

import type { IReference } from './types';

/**
 * @see https://spec.openapis.org/oas/v3.0.3#reference-object
 */
export class Reference<TNode, TParent extends TreeParent>
  extends BasicNode<TParent>
  implements IReference<TNode>
{
  ref: string;

  constructor(parent: TParent, ref: string) {
    super(parent);
    this.ref = ref;
  }

  // eslint-disable-next-line class-methods-use-this
  resolve(): TNode {
    return null as unknown as TNode;
  }
}

export const isReference = <TNode, TParent extends TreeParent>(
  obj: unknown,
): obj is Reference<TNode, TParent> => {
  return Object.prototype.hasOwnProperty.call(obj, 'ref');
};
