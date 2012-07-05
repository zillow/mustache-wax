/**
 * Tests!
 */

var fs = require('fs'),
    path = require('path'),
    existsSync = (fs.existsSync || path.existsSync),
    rimraf = require('rimraf'),

    testOutputDir = path.resolve(__dirname, 'output'),
    Mustachio = require('../lib/mustachio.js');

// blow away test/output if it exists
if (existsSync(testOutputDir)) {
    rimraf.sync(testOutputDir);
}

var fixtures = {

    emptyCompiledFunction: [
        'function (Handlebars,depth0,helpers,partials,data) {',
        '  helpers = helpers || Handlebars.helpers;',
        '  var buffer = "", foundHelper, self=this;',
        '',
        '',
        '  return buffer;}',
        ''
    ].join('\n'),

    emptyModuleFile: [
        'YUI.add("template-alpha", function (Y) {',
        '    Y.namespace("Template")["alpha"] = Y.Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {',
        '  helpers = helpers || Handlebars.helpers;',
        '  var buffer = "", foundHelper, self=this;',
        '',
        '',
        '  return buffer;});',
        '}, "@VERSION@", { "requires": ["handlebars-base"] });',
        ''
    ].join('\n')

};

exports.lifecycle = {

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

    "should reject attempts to combine flags illegally": function (test) {
        test.expect(3);

        test.throws(function () {
            this.instance = new Mustachio({
                beautify: true,
                min: true
            });
        }, /Unable to beautify minified output/);

        test.throws(function () {
            this.instance = new Mustachio({
                simple: true,
                min: true
            });
        }, /Unable to minimize simple output/);

        test.throws(function () {
            this.instance = new Mustachio({
                simple: true,
                beautify: true
            });
        }, /Unable to beautify simple output/);

        test.done();
    },

    "should generate simple output": function (test) {
        test.expect(2);

        var instance = new Mustachio({
            simple: true
        });

        instance.invoke(__dirname + '/templates/alpha.mustache');

        test.strictEqual(instance.output.length, 1, "Output array empty");
        test.strictEqual(instance.render(), fixtures.emptyCompiledFunction, "Simple output mismatch.");

        test.done();
    }

}; // end lifecycle tests

exports.rendering = {

    tearDown: function (cb) {
        rimraf(testOutputDir, cb);
    },

    "should write single file": function (test) {
        test.expect(3);

        var filePath = path.join(__dirname, 'output', 'alpha.js');
        var instance = new Mustachio({
            outputFile: filePath
        });

        instance.invoke(__dirname + '/templates/alpha.mustache');

        instance.renderOutput(function (err) {
            test.ifError(err);

            fs.readFile(filePath, 'utf8', function (foul, actual) {
                test.ifError(foul);

                test.strictEqual(actual, fixtures.emptyModuleFile, "Single file output mismatch.");

                test.done();
            });
        });
    },

    "should write all files under target directory in Builder pattern": function (test) {
        test.expect(8);

        var dirsPath = path.join(__dirname, 'output');
        var instance = new Mustachio({
            outputDir: dirsPath
        });

        instance.invoke(__dirname + '/templates');

        instance.renderOutput(function (err) {
            test.ifError(err);

            fs.readdir(dirsPath, function (foul, dirs) {
                test.ifError(foul);

                // when remaining === 0, we are done
                var remaining = dirs.length;

                dirs.forEach(function (dirName) {
                    // construct Builder path, such as ./output/template-alpha/template-alpha.js
                    var filePath = path.join(dirsPath, dirName, dirName + '.js');

                    fs.readFile(filePath, 'utf8', function (augh, actual) {
                        test.ifError(augh);

                        var replacer = dirName.replace(instance.prefix, ''),
                            expected = fixtures.emptyModuleFile.replace(/alpha/g, replacer);

                        test.strictEqual(actual, expected, "Multiple output mismatch (" + replacer + ").");

                        if (--remaining === 0) {
                            test.done();
                        }
                    });
                });
            });
        });
    }

}; // end rendering tests
