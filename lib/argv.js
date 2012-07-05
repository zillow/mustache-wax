/**
 * Options, defaults, and argument validation
 */
var fs = require('fs');

module.exports = {

    checkFiles: function (argv) {
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

        if (argv.simple && (argv._.length !== 1 || fs.statSync(argv._[0]).isDirectory())) {
            throw 'Unable to output multiple templates in simple mode';
        }
    },

    checkFlags: function (argv) {
        if (argv.beautify && argv.min) {
            throw 'Unable to beautify minified output';
        }
        if (argv.simple && argv.min) {
            throw 'Unable to minimize simple output';
        }
        if (argv.simple && argv.beautify) {
            throw 'Unable to beautify simple output';
        }
    },

    options: {
        'v': {
            type: 'boolean',
            description: 'Verbose logging',
            alias: 'verbose'
        },
        'd': {
            type: 'string',
            description: 'Output base directory',
            alias: 'outputDir'
        },
        'f': {
            type: 'string',
            description: 'Output File',
            alias: 'outputFile'
        },
        'p': {
            type: 'string',
            description: 'Module prefix',
            alias: 'modulePrefix',
            default: 'template'
        },
        'n': {
            type: 'string',
            description: 'Module namespace',
            alias: 'moduleNamespace',
            default: 'Template'
        },
        't': {
            type: 'string',
            description: 'Module template file',
            alias: 'moduleTemplate',
            default: './templates/module.js'
        },
        'k': {
            type: 'string',
            description: 'Known helpers',
            alias: 'known'
        },
        'o': {
            type: 'boolean',
            description: 'Known helpers only',
            alias: 'knownOnly'
        },
        'b': {
            type: 'boolean',
            description: 'Beautify output',
            alias: 'beautify'
        },
        'm': {
            type: 'boolean',
            description: 'Minimize output',
            alias: 'min'
        },
        's': {
            type: 'boolean',
            description: 'Output template function only',
            alias: 'simple'
        },
        'r': {
            type: 'string',
            description: 'Template root, stripped from template names',
            alias: 'root'
        }
    },

    defaults: {
        verbose: false,
        outputDir: '',
        outputFile: '',
        modulePrefix: 'template',
        moduleNamespace: 'Template',
        moduleTemplate: './templates/module.js',
        known: '',
        knownOnly: false,
        beautify: false,
        min: false,
        simple: false,
        root: ''
    }

};
