'use strict';

import HInput from '../../src/components/inputs/h-input';
import { safeSpy } from '../test-util/safe-spy';

export const basic = {
  description: 'basic',
  component: HInput,
  props: {
    label: 'h',
    value: 200,
    theme: {},
    onChange: safeSpy()
  }
};
