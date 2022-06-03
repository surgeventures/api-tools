import { Parameter, ParameterParent } from './Parameter';
import { defaultSerializationStyles, defaultExplode } from './utils';

import type { IPathParameter } from '../types';

export type SerializationStyle = 'matrix' | 'label' | 'simple';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export class PathParameter extends Parameter implements IPathParameter {
  style: SerializationStyle;
  explode: boolean;

  constructor(parent: ParameterParent, name: string) {
    super(parent, 'path', name);
    this.required = true;
    this.style = defaultSerializationStyles.path as SerializationStyle;
    this.explode = defaultExplode[this.style];
    this.required = true;
  }

  declare readonly in: 'path';
  declare readonly required: true;
}
