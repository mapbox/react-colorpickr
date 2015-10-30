'use strict';

var test = require('tape');

require('./component');
require('./colorfunc');

// close the smokestack window once tests are complete
test('shutdown', function(t) {
  t.end();
  setTimeout(function() {
    window.close();
  });
});
