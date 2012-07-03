
module.exports = {
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
            description: 'Template root, stripped from template names.',
            alias: 'root'
        }
    },
    defaults: {
        verbose: false,
        outputDir: '',
        outputFile: '',
        modulePrefix: 'template',
        known: '',
        knownOnly: false,
        beautify: false,
        min: false,
        simple: false,
        root: ''
    }
};
