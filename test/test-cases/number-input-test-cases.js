'use strict';

import NumberInput from '../../src/components/inputs/number-input';
import { safeSpy } from '../test-util/safe-spy';

export const basic = {
  description: 'basic',
  component: NumberInput,
  props: {
    id: 'label',
    theme: {},
    onChange: safeSpy(),
    min: 1,
    max: 100,
    value: 10
  }
};
