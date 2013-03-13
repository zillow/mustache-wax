#!/usr/bin/env node

var arg = require('./argv'),
    optimist = require('optimist')
        .usage('Precompile handlebars templates and wrap in YUI modules.\nUsage: $0 template...')
        .options(arg.options)
        .wrap(78)
        .check(arg.checkFiles)
        .check(arg.checkFlags);

new (require('./mustache-wax'))(optimist.argv, true).renderOutput();
