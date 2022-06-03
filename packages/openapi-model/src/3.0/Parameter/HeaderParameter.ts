import { Parameter, ParameterParent } from './Parameter';
import { defaultExplode, defaultRequired, defaultSerializationStyles } from './utils';

import type { IHeaderParameter } from '../types';

export type SerializationStyle = 'simple';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export class HeaderParameter extends Parameter implements IHeaderParameter {
  style: SerializationStyle;
  explode: boolean;

  constructor(parent: ParameterParent, name: string) {
    super(parent, 'header', name);
    this.required = defaultRequired.header;
    this.style = defaultSerializationStyles.header as SerializationStyle;
    this.explode = defaultExplode[this.style];
  }

  declare readonly in: 'header';
}
