/**
 * Mustachio - Not just for Salvador, anymore!
 */

var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    uglify = require('uglify-js'),

    Handlebars = require('yui/handlebars').Handlebars,

    defaults = require('./argv').defaults;

function Mustachio(argv) {
    this.argv = merge(defaults, argv);

    this.known = {};
    this.output = [];
    this.prefix = (this.argv.modulePrefix + '-').replace('--', '-');
    this.pregex = new RegExp('"(' + this.prefix + '[\\w\\-]+)"');

    if (this.argv.verbose) {
        this.log = function () {
            console.log.apply(null, arguments);
        };
    }

    if (this.argv.min) {
        this._render = function (ary) {
            return uglify(ary.join('')) + ';\n';
        };
    }
    else if (this.argv.beautify) {
        this._render = function (ary) {
            var code = ary.join(''),
                ast = uglify.parser.parse(code);
            // ast = uglify.uglify.ast_mangle(ast);
            // ast = uglify.uglify.ast_squeeze(ast);
            return uglify.uglify.gen_code(ast, {
                beautify: true
            }) + '\n';
        };
    }

    // Convert the known list into a hash
    if (this.argv.known && !Array.isArray(this.argv.known)) {
        this.argv.known = [this.argv.known];
    }
    if (this.argv.known) {
        var i = 0, len = this.argv.known.length;
        for (; i < len; i += 1) {
            this.known[this.argv.known[i]] = true;
        }
    }

    if (argv._ && argv._.length) {
        this.invoke(argv._);
    }
}

Mustachio.prototype = {

    log: function () {},

    _render: function (ary) {
        return ary.join('');
    },

    render: function (ary) {
        if (!ary) {
            ary = this.output;
        }
        else if ('string' === typeof ary) {
            ary = [ary];
        }

        return this._render(ary);
    },

    invoke: function (templates) {
        this.log("\nProcessing templates: " + templates + "\n#####################\n");

        // ensure array before iterating
        if (!Array.isArray(templates)) {
            templates = [templates];
        }

        var self = this,
            root = this.argv.root;

        templates.forEach(function (template) {
            self.processTemplate(template, root);
        });

        return this;
    },

    processTemplate: function (template, root) {
        var precompiled,
            self = this,
            extn = /\.(handlebars|mustache)$/,
            tmpl = template,
            stat = fs.statSync(tmpl);

        if (stat.isDirectory()) {
            fs.readdirSync(template).forEach(function (file) {
                var path = template + '/' + file;

                if (extn.test(path) || fs.statSync(path).isDirectory()) {
                    self.processTemplate(path, root || template);
                }
            });
        }
        else {
            precompiled = Handlebars.precompile(fs.readFileSync(tmpl, 'utf8'), {
                knownHelpers: this.known,
                knownHelpersOnly: this.argv.o
            });

            if (this.argv.simple) {
                this.output.push(precompiled + '\n');
            }
            else {
                // Clean the template name
                if (!root) {
                    template = path.basename(template);
                } else if (template.indexOf(root) === 0) {
                    template = template.substring(root.length + 1);
                }
                template = template.replace(extn, '');
                this.log('   raw template name: "' + template + '"');

                this.output.push(this.wrapModule(template, precompiled));
            }
        }
    },

    wrapModule: function (templateName, precompiledFn) {
        // replace slashes in templateName with dashes
        templateName = templateName.replace(/\//g, '-');
        this.log('module template name: "' + templateName + '"\n');

        return [
            'YUI.add("' + this.prefix + templateName + '", function (Y) {\n',
            '    Y.namespace("Z.Template")["' + templateName + '"] = Y.Handlebars.template(' + precompiledFn + ');\n',
            '}, "@VERSION@", { "requires": ["handlebars-base"] });\n'
        ];
    },

    renderOutput: function () {
        var self = this,
            output = self.output,
            pregex = self.pregex,
            // render must be bound to instance to ensure
            // nested this._render call has correct context
            render = self.render.bind(self);

        if (output.length) {
            if (self.argv.outputDir) {
                self.log("\nWriting module files: " + self.argv.outputDir + "\n#####################\n");

                output.forEach(function (moduleData) {
                    // read out the generated module name from the module data
                    var moduleName = moduleData[0].match(pregex)[1],
                        modulePath = path.resolve(self.argv.outputDir + '/' + moduleName),
                        moduleFile = modulePath + '/' + moduleName + '.js';

                    self.log('        "' + moduleName + '"');
                    self.log(moduleData[0]);

                    mkdirp(modulePath, function (dirErr, made) {
                        if (dirErr) {
                            console.error(dirErr);
                            throw dirErr;
                        }

                        fs.writeFile(moduleFile, render(moduleData), 'utf8', function (fileErr) {
                            if (fileErr) {
                                console.error(fileErr);
                                throw fileErr;
                            }

                            console.log('Wrote ' + moduleFile);
                        });
                    });
                });
            } else if (self.argv.outputFile) {
                fs.writeFileSync(self.argv.outputFile, render(output), 'utf8');
            } else {
                console.log(render(output));
            }
        }
    }

};

module.exports = Mustachio;

// mix & merge lifted from yui-base, simplified
function mix(receiver, supplier, overwrite) {
    var key;

    if (!receiver || !supplier) {
        return receiver || {};
    }

    for (key in supplier) {
        if (supplier.hasOwnProperty(key)) {
            if (overwrite || !receiver.hasOwnProperty(key)) {
                receiver[key] = supplier[key];
            }
        }
    }

    return receiver;
}

function merge() {
    var args   = arguments,
        i      = 0,
        len    = args.length,
        result = {};

    for (; i < len; i += 1) {
        mix(result, args[i], true);
    }

    return result;
}
