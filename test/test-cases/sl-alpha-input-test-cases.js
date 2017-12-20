'use strict';

import SLAlphaInput from '../../src/components/inputs/sl-alpha-input';
import { safeSpy } from '../test-util/safe-spy';

export const basic = {
  description: 'basic',
  component: SLAlphaInput,
  props: {
    label: 'S',
    value: 92,
    theme: {},
    onChange: safeSpy()
  }
};
