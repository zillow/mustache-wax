#!/usr/bin/env node

var arg = require('./argv'),
    optimist = require('optimist')
        .usage('Precompile handlebars templates.\nUsage: $0 template...')
        .options(arg.options)
        .wrap(78)
        .check(arg.checkFiles)
        .check(arg.checkFlags);

new (require('./mustachio'))(optimist.argv).renderOutput();
