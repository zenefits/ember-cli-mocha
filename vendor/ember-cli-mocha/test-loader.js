/* globals jQuery,chai,mocha */

jQuery(document).ready(function() {
  // Declare `expect` as a global here instead of as a var in individual tests.
  // This avoids jshint warnings re: `Redefinition of 'expect'`.
  window.expect = chai.expect;

  var TestLoader = require('ember-cli/test-loader')['default'];
  var query = Mocha.utils.parseQuery(window.location.search || '');
  var moduleGrep;
  if (query.module_grep) {
    moduleGrep = new RegExp(decodeURIComponent(query.module_grep));
  }
  TestLoader.prototype.shouldLoadModule = function(moduleName) {
    var moduleMatch;
    if (moduleGrep) {
      moduleMatch = moduleName.match(moduleGrep);
    }
    else {
      moduleMatch = true;
    }
    return moduleMatch &&
        (moduleName.match(/[-_]test$/) || moduleName.match(/\.jshint$/));
  };

  TestLoader.prototype.moduleLoadFailure = function(moduleName, error) {
    describe('TestLoader Failures', function () {
      it(moduleName + ': could not be loaded', function() {
        throw error;
      });
    });
  };

  // Attempt to mitigate sourcemap issues in Chrome
  // See: https://github.com/ember-cli/ember-cli/issues/3098
  //      https://github.com/ember-cli/ember-cli-qunit/pull/39
  setTimeout(function() {
    TestLoader.load();

    window.mochaRunner = mocha.run();
  }, 250);
});
