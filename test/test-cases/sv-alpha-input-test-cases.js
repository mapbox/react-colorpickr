'use strict';

import SVAlphaInput from '../../src/components/inputs/sv-alpha-input';
import { safeSpy } from '../test-util/safe-spy';

export const basic = {
  description: 'basic',
  component: SVAlphaInput,
  props: {
    label: 'S',
    value: 92,
    theme: {},
    onChange: safeSpy()
  }
};
