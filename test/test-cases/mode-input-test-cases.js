'use strict';

import ModeInput from '../../src/components/inputs/mode-input';
import { safeSpy } from '../test-util/safe-spy';

export const basic = {
  description: 'basic',
  component: ModeInput,
  props: {
    checked: true,
    theme: {},
    name: 'mode',
    onChange: safeSpy()
  }
};
