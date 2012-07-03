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
    "should instantiate with defaults when no config passed": function (test) {
        test.expect(5);

        var instance = new Mustachio();

        test.ok(Array.isArray(instance.output), "Instance 'output' property not set.");
        test.ok('object' === typeof instance.known, "Instance 'known' property not set.");

        test.strictEqual(instance.argv.modulePrefix, "template", "Incorrect modulePrefix default.");
        test.strictEqual(instance.prefix, "template-", "Incorrect instance.prefix default.");

        test.ok(instance.pregex.test('"template-foo"'), "Prefix regular expression incorrect.");

        test.done();
    },
    "should generate simple output": function (test) {
        test.expect(2);

        var instance = new Mustachio({
            simple: true
        });

        instance.invoke([__dirname + '/templates/alpha.mustache']);

        test.strictEqual(instance.output.length, 1, "Output array empty");
        test.strictEqual(instance.render(), fixtures.emptyCompiledFunction, "Simple output mismatch");

        test.done();
    }
};
