
require.ensure([], function(require) {
    var a = require("./core/a").a;
    a()

});

require.ensure([], function(require) {
  var b = require("./core/b").b;
  b()

});
console.log([1,2,4,5].map(x => x * x));
