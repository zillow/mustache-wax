/**
 * Tests!
 */

var fs = require('fs'),
    Mustachio = require('../lib/mustachio.js');

var fixtures = {
    emptyCompiledFunction: [
        'function (Handlebars,depth0,helpers,partials,data) {',
        '  helpers = helpers || Handlebars.helpers;',
        '  var buffer = "", foundHelper, self=this;',
        '',
        '',
        '  return buffer;}',
        ''
    ].join('\n')
};

module.exports = {
    "should generate simple output": function (test) {
        test.expect(2);

        var instance = new Mustachio({
            simple: true
        });

        instance.invoke([__dirname + '/templates/alpha.mustache']);
        test.ok(instance.output.length === 1, "Output array empty");

        test.strictEqual(instance.render(), fixtures.emptyCompiledFunction, "Simple output mismatch");

        test.done();
    }
};
