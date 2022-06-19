import { Parameter, ParameterParent } from './Parameter';
import { defaultRequired, defaultSerializationStyles, defaultExplode } from './utils';

import type { IQueryParameter } from '../types';

export type SerializationStyle = 'form' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';

/**
 * @see http://spec.openapis.org/oas/v3.0.3#parameter-object
 */
export class QueryParameter extends Parameter implements IQueryParameter {
  style: SerializationStyle;
  explode: boolean;
  allowEmptyValue: boolean;
  allowReserved: boolean;

  constructor(parent: ParameterParent, name: string) {
    super(parent, 'query', name);
    this.required = defaultRequired.query;
    this.style = defaultSerializationStyles.query as SerializationStyle;
    this.explode = defaultExplode[this.style];
    this.allowEmptyValue = false; // since it is deprecated, always set to false
    this.allowReserved = false;
  }

  declare readonly in: 'query';
}
