/*global describe, it, beforeEach */
/**
 * Tests!
 */

var fs = require('fs'),
    path = require('path'),
    existsSync = (fs.existsSync || path.existsSync),
    rimraf = require('rimraf'),
    assert = require('assert'),

    inputFiles = ['alpha.mustache', 'beta.hbs', 'gamma.handlebars'],
    inputDir   = path.join(__dirname, 'fixtures/input'),
    fixtureOut = path.join(__dirname, 'fixtures/output'),

    testOutputDir = path.resolve(__dirname, 'output'),
    MustacheWax = require('../lib/mustache-wax.js');

// blow away test/output if it exists
if (existsSync(testOutputDir)) {
    rimraf.sync(testOutputDir);
}

var fixtures = {
    simple: {},
    module: {},
    beauty: {}
};

inputFiles.forEach(function (file) {
    var jsfile = path.basename(file, path.extname(file)) + '.js';
    fixtures.simple[file] = fs.readFileSync(path.join(fixtureOut, 'simple', jsfile), 'utf8');
    fixtures.module[file] = fs.readFileSync(path.join(fixtureOut, 'module', jsfile), 'utf8');
    fixtures.beauty[file] = fs.readFileSync(path.join(fixtureOut, 'beauty', jsfile), 'utf8');
});

describe("lifecycle", function () {
    it("should instantiate with defaults when no config passed", function () {
        var instance = new MustacheWax();

        assert.ok(Array.isArray(instance.output), "Instance 'output' property not set.");
        assert.ok('object' === typeof instance.known, "Instance 'known' property not set.");

        assert.strictEqual(instance.argv.modulePrefix, "template", "Incorrect modulePrefix default.");
        assert.strictEqual(instance.prefix, "template-", "Incorrect instance.prefix default.");

        assert.ok(instance.pregex.test('"template-foo"'), "Prefix regular expression incorrect.");
    });

    it("should reject attempts to combine flags illegally", function () {
        assert.throws(function () {
            this.instance = new MustacheWax({
                beautify: true,
                min: true
            });
        }, "Unable to beautify minified output");

        assert.throws(function () {
            this.instance = new MustacheWax({
                simple: true,
                min: true
            });
        }, "Unable to minimize simple output");

        assert.throws(function () {
            this.instance = new MustacheWax({
                simple: true,
                beautify: true
            });
        }, "Unable to beautify simple output");
    });

    it("should reject improper _ parameters", function () {
        /*jshint nonew: false */

        assert.throws(function () {
            new MustacheWax({
                "_": ""
            });
        }, "Must define at least one template or directory.");

        assert.throws(function () {
            new MustacheWax({
                "_": "poopypants"
            });
        }, 'Unable to open template file "poopypants"');

        assert.throws(function () {
            new MustacheWax({
                simple: true,
                "_": [
                    path.join(inputDir, inputFiles[0]),
                    path.join(inputDir, inputFiles[1])
                ]
            });
        }, "Unable to output multiple templates in simple mode");
    });

    it("should accept a string _ parameter", function () {
        /*jshint nonew: false */
        assert.doesNotThrow(function () {
            new MustacheWax({
                "_": path.join(inputDir, inputFiles[0])
            });
        });
    });

    it("should not checkFiles if fromCli", function () {
        /*jshint nonew: false */
        assert.doesNotThrow(function () {
            new MustacheWax({
                "_": [path.join(inputDir, inputFiles[0])]
            }, true);
        });
    });
});

describe("simple config", function () {
    it("should generate simple output", function () {
        var instance = new MustacheWax({
            simple: true
        });
        var inputFile = inputFiles[0]; // alpha

        instance.invoke(path.join(inputDir, inputFile));

        assert.strictEqual(instance.output.length, 1, "Output array empty");
        assert.strictEqual(instance.render(), fixtures.simple[inputFile]);
    });
});

describe("rendering", function () {
    beforeEach(function (done) {
        rimraf(testOutputDir, done);
    });

    it("should write single file", function (done) {
        var filePath = path.join(__dirname, 'output', 'alpha.js');
        var instance = new MustacheWax({
            outputFile: filePath
        });
        var inputFile = inputFiles[0]; // alpha

        instance.invoke(path.join(inputDir, inputFile));

        instance.renderOutput(function (err) {
            assert.ifError(err);

            fs.readFile(filePath, 'utf8', function (foul, actual) {
                assert.ifError(foul);

                assert.strictEqual(actual, fixtures.module[inputFile]);

                done();
            });
        });
    });

    it("should write single file beautified", function (done) {
        var filePath = path.join(__dirname, 'output', 'alpha.js');
        var instance = new MustacheWax({
            beautify: true,
            outputFile: filePath
        });
        var inputFile = inputFiles[0]; // alpha

        instance.invoke(path.join(inputDir, inputFile));

        instance.renderOutput(function (err) {
            assert.ifError(err);

            fs.readFile(filePath, 'utf8', function (foul, actual) {
                assert.ifError(foul);

                assert.strictEqual(actual, fixtures.beauty[inputFile]);

                done();
            });
        });
    });

    it("should write all files under target directory in Builder pattern", function (done) {
        var dirsPath = path.join(__dirname, 'output');
        var instance = new MustacheWax({
            quiet: true,
            outputDir: dirsPath
        });

        instance.invoke(inputDir);

        instance.renderOutput(function (err) {
            assert.ifError(err);

            fs.readdir(dirsPath, function (foul, dirs) {
                assert.ifError(foul);

                // when remaining === 0, we are done
                var remaining = dirs.length;

                dirs.forEach(function (dirName, i) {
                    // construct Builder path, such as ./output/template-alpha/template-alpha.js
                    var inputFile = inputFiles[i];
                    var filePath = path.join(dirsPath, dirName, dirName + '.js');

                    fs.readFile(filePath, 'utf8', function (augh, actual) {
                        assert.ifError(augh);

                        var expected = fixtures.module[inputFile];

                        assert.strictEqual(actual, expected);

                        if (--remaining === 0) {
                            done();
                        }
                    });
                });
            });
        });
    });

    // end rendering tests
});
