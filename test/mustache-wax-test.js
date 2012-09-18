/**
 * Tests!
 */

var fs = require('fs'),
    path = require('path'),
    existsSync = (fs.existsSync || path.existsSync),
    rimraf = require('rimraf'),

    testOutputDir = path.resolve(__dirname, 'output'),
    MustacheWax = require('../lib/mustache-wax.js');

// blow away test/output if it exists
if (existsSync(testOutputDir)) {
    rimraf.sync(testOutputDir);
}

var fixtures = {

    deeplyNestedContext: {
        "a": { "one": 1 },
        "b": { "two": 2 },
        "c": { "three": 3 },
        "d": { "four": 4 },
        "e": { "five": 5 }
    },

    deeplyNestedHTML: [
        '1',
        '121',
        '12321',
        '1234321',
        '123454321',
        '1234321',
        '12321',
        '121',
        '1',
        ''
    ].join('\n'),

    scopeBubbledContext: {
        "grades": [
            {
                "grade_level": "3",
                "years": ['1999', '2001']
            },
            {
                "grade_level": "5",
                "years": ['2003','2012']
            }
        ]
    },

    scopeBubbledHTML: [
        '    <ul id="grade-3">',
        '        <li class="year">1999</li>',
        '        <li class="year">2001</li>',
        '    </ul>',
        '    <ul id="grade-5">',
        '        <li class="year">2003</li>',
        '        <li class="year">2012</li>',
        '    </ul>',
        ''
    ].join('\n'),

    scopedBubbleCompiled: [
        'function (Handlebars,depth0,helpers,partials,data) {',
        '  helpers = helpers || Handlebars.helpers;',
        '  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;',
        '',
        'function program1(depth0,data) {',
        '  ',
        '  var buffer = "", stack1;',
        '  buffer += "\\n    ";',
        '  stack1 = depth0.years;',
        '  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});',
        '  if(stack1 || stack1 === 0) { buffer += stack1; }',
        '  buffer += "\\n";',
        '  return buffer;}',
        'function program2(depth0,data) {',
        '  ',
        '  var buffer = "", stack1, foundHelper;',
        '  buffer += "\\n    <figure id=\\"fig-";',
        '  foundHelper = helpers.grade_level;',
        '  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }',
        '  else { stack1 = depth0.grade_level; stack1 = typeof stack1 === functionType ? stack1() : stack1; }',
        '  buffer += escapeExpression(stack1) + "\\" />\\n    ";',
        '  return buffer;}',
        '',
        '  stack1 = depth0.grades;',
        '  stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});',
        '  if(stack1 || stack1 === 0) { buffer += stack1; }',
        '  buffer += "\\n";',
        '  return buffer;}',
        ''
    ].join('\n'),

    emptyCompiledFunction: [
        'function (Handlebars,depth0,helpers,partials,data) {',
        '  helpers = helpers || Handlebars.helpers;',
        '  var buffer = "";',
        '',
        '',
        '  return buffer;}',
        ''
    ].join('\n'),

    emptyModuleFile: [
        'YUI.add("template-alpha", function (Y) {',
        '    Y.namespace("Template")["alpha"] = Y.Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {',
        '  helpers = helpers || Handlebars.helpers;',
        '  var buffer = "";',
        '',
        '',
        '  return buffer;});',
        '}, "@VERSION@", { "requires": ["handlebars-base"] });',
        ''
    ].join('\n'),

    emptyModuleFileBeautified: [
        'YUI.add("template-alpha", function(Y) {',
        '    Y.namespace("Template")["alpha"] = Y.Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {',
        '        helpers = helpers || Handlebars.helpers;',
        '        var buffer = "";',
        '        return buffer;',
        '    });',
        '}, "@VERSION@", {',
        '    requires: [ "handlebars-base" ]',
        '});',
        ''
    ].join('\n')

};

exports.lifecycle = {

    "should instantiate with defaults when no config passed": function (test) {
        test.expect(5);

        var instance = new MustacheWax();

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
            this.instance = new MustacheWax({
                beautify: true,
                min: true
            });
        }, /Unable to beautify minified output/);

        test.throws(function () {
            this.instance = new MustacheWax({
                simple: true,
                min: true
            });
        }, /Unable to minimize simple output/);

        test.throws(function () {
            this.instance = new MustacheWax({
                simple: true,
                beautify: true
            });
        }, /Unable to beautify simple output/);

        test.done();
    },

    "should generate simple output": function (test) {
        test.expect(2);

        var instance = new MustacheWax({
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
        var instance = new MustacheWax({
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

    "should write single file beautified": function (test) {
        test.expect(3);

        var filePath = path.join(__dirname, 'output', 'alpha.js');
        var instance = new MustacheWax({
            beautify: true,
            outputFile: filePath
        });

        instance.invoke(__dirname + '/templates/alpha.mustache');

        instance.renderOutput(function (err) {
            test.ifError(err);

            fs.readFile(filePath, 'utf8', function (foul, actual) {
                test.ifError(foul);

                test.strictEqual(actual, fixtures.emptyModuleFileBeautified, "Single file beautified output mismatch.");

                test.done();
            });
        });
    },

    "should write all files under target directory in Builder pattern": function (test) {
        test.expect(8);

        var dirsPath = path.join(__dirname, 'output');
        var instance = new MustacheWax({
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

exports.templating = {

    "hogan should compile and render deeply nested context correctly": function (test) {
        test.expect(3);

        var filePath = path.join(__dirname, 'syntax', 'deeply-nested.mustache');

        fs.readFile(filePath, 'utf8', function (err, mustache) {
            test.ifError(err);

            var hogan = require("hogan.js");
            var template = hogan.compile(mustache);
            test.ok('function' === typeof template.render, 'template compilation failed');

            var actual = template.render(fixtures.deeplyNestedContext);
            test.strictEqual(actual, fixtures.deeplyNestedHTML, 'deeply nested html mismatch');
            // console.log(actual);

            test.done();
        });
    },

/*
    "should generate simple scope-bubbled correctly": function (test) {
        test.expect(3);

        var filePath = path.join(__dirname, 'output', 'scope-bubbled.js');
        var instance = new MustacheWax({
            simple: true,
            outputFile: filePath
        });

        instance.invoke(__dirname + '/syntax/scope-bubbled.mustache');

        instance.renderOutput(function (err) {
            test.ifError(err);

            fs.readFile(filePath, 'utf8', function (foul, actual) {
                test.ifError(foul);

                test.strictEqual(actual, fixtures.scopedBubbleCompiled, "Scope bubbled output mismatch.");

                test.done();
            });
        });
    },
*/
    "hogan should revive scope-bubbled template correctly": function (test) {
        test.expect(3);

        var filePath = path.join(__dirname, 'syntax', 'scope-bubbled.mustache');

        fs.readFile(filePath, 'utf8', function (err, mustache) {
            test.ifError(err);

            var hogan = require("hogan.js");
            var template = hogan.compile(mustache);
            test.ok('function' === typeof template.render, 'template compilation failed');

            var actual = template.render(fixtures.scopeBubbledContext);
            console.log(actual);
            test.strictEqual(actual, fixtures.scopeBubbledHTML, 'scope bubbled html mismatch');

            test.done();
        });
    }

}; // end templating tests
