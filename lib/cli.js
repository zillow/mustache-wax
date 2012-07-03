#!/usr/bin/env node

var fs = require('fs'),
    optimist = require('optimist')
        .usage('Precompile handlebars templates.\nUsage: $0 template...')
        .options(require('./argv').options)
        .wrap(78)
        .check(function (argv) {
            if (!argv._.length) {
                throw 'Must define at least one template or directory.';
            }

            argv._.forEach(function (template) {
                try {
                    fs.statSync(template);
                } catch (err) {
                    throw 'Unable to open template file "' + template + '"';
                }
            });
        })
        .check(function (argv) {
            if (argv.beautify && argv.min) {
                throw 'Unable to beautify minified output';
            }
            if (argv.simple && argv.min) {
                throw 'Unable to minimize simple output';
            }
            if (argv.simple && argv.beautify) {
                throw 'Unable to beautify simple output';
            }
            if (argv.simple && (argv._.length !== 1 || fs.statSync(argv._[0]).isDirectory())) {
                throw 'Unable to output multiple templates in simple mode';
            }
        });

new (require('./mustachio'))(optimist.argv).renderOutput();
