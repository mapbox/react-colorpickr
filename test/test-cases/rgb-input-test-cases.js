'use strict';

import RGBInput from '../../src/components/inputs/rgb-input';
import { safeSpy } from '../test-util/safe-spy';

export const basic = {
  description: 'basic',
  component: RGBInput,
  props: {
    id: 'r',
    value: 200,
    theme: {},
    onChange: safeSpy()
  }
};
