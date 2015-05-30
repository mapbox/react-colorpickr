var test = require('tape');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

var Colorpickr = require('../');

test('rendered', (t) => {
  const colorpickr = TestUtils.renderIntoDocument(
    <Colorpickr
      value={'rgba(56,130,184,1)'}
    />
  );
  t.ok(colorpickr, 'renders colorpickr in the document');
  t.end();
});
