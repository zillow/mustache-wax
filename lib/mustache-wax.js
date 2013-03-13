/**
 * Mustache Wax helps keep our Handlebars tidy.
 */

var fs = require('fs'),
    path = require('path'),
    exists = (fs.exists || path.exists),
    mkdirp = require('mkdirp'),
    uglify = require('uglify-js'),

    Handlebars = require('handlebars'),

    arg = require('./argv');

function MustacheWax(argv) {
    this.argv = merge(arg.defaults, argv);

    // no _ args means we skipped CLI checks
    if (!this.argv.hasOwnProperty('_')) {
        arg.checkFlags(this.argv);
    }
    else {
        arg.checkFiles(this.argv);
    }

    this.known = {};
    this.output = [];
    this.prefix = (this.argv.modulePrefix + '-').replace('--', '-');
    this.pregex = new RegExp('"(' + this.prefix + '[\\w\\-]+)"');

    this.namespace = this.argv.moduleNamespace;
    this.template = this.argv.moduleTemplate;

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

            code = uglify.uglify.gen_code(ast, {
                beautify: true
            }) + '\n';

            // "function(" => "function ("
            code = code.replace(/(function)(\()/g, "$1 $2");

            return code;
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

    this._initModuleTemplate();

    if (this.argv._ && this.argv._.length) {
        this.invoke(this.argv._);
    }
}

MustacheWax.prototype = {

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

    _initModuleTemplate: function () {
        this.log('initializing template: ' + this.template);
        var precompiled = require(this.template);
        this.templateFn = Handlebars.template(precompiled);
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
        this.log('processTemplate: template="' + template + '", root="' + root + '"');
        var precompiled,
            self = this,
            extn = /\.(handlebars|mustache)$/,
            tmpl = template,
            stat = fs.statSync(tmpl);

        if (stat.isDirectory()) {
            fs.readdirSync(template).forEach(function (file) {
                var filePath = path.join(template, file);

                if (extn.test(filePath) || fs.statSync(filePath).isDirectory()) {
                    self.processTemplate(filePath, root || template);
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

        return this.templateFn({
            prefix: this.prefix,
            name: templateName,
            ns: this.namespace,
            precompiled: precompiledFn
        });
    },

    renderOutput: function (cb) {
        var self = this,
            output = self.output,
            pregex = self.pregex,

            outDir  = self.argv.outputDir,
            outFile = self.argv.outputFile,

            remaining = output.length,
            callback = function (err) {
                if (err) {
                    if (err.code === 'EACCES') {
                        if (!self.argv.quiet) {
                            console.error(err.path + " is not writable. Skipping!");
                        }
                    }
                }
                if (cb) {
                    cb(err);
                }
            },

            // render must be bound to instance to ensure
            // nested this._render call has correct context
            render = self.render.bind(self);

        if (remaining) {
            if (outDir) {
                self.log("\nWriting module files: " + outDir + "\n#####################\n");

                output.forEach(function (moduleData) {
                    // read out the generated module name from the module data
                    var matched = moduleData.substring(0, moduleData.indexOf('\n')).match(pregex),
                        moduleName = matched[1],
                        modulePath = path.resolve(outDir, moduleName);

                    self.log(matched.input);
                    self.log('        "' + moduleName + '"');

                    mkdirp(modulePath, function (dirErr, made) {
                        if (dirErr) {
                            return callback(dirErr);
                        }

                        // this creates a YUI Builder pattern path
                        // e.g., .../template-foo/template-foo.js
                        var moduleFile = path.resolve(modulePath, moduleName + '.js');

                        fs.writeFile(moduleFile, render(moduleData), 'utf8', function (fileErr) {
                            if (fileErr) {
                                return callback(fileErr);
                            }

                            if (!self.argv.quiet) {
                                console.log('Wrote ' + moduleFile);
                            }

                            if (--remaining === 0) {
                                callback(null);
                            }
                        });
                    });
                });
            }
            else if (outFile) {
                outDir = path.resolve(path.dirname(outFile));
                self.log("outDir  = " + outDir);
                self.log("outFile = " + outFile);

                // ensure full path to output file exists before writing
                exists(outDir, function (ok) {
                    if (ok) {
                        fs.writeFile(outFile, render(output), 'utf8', callback);
                    }
                    else {
                        mkdirp(outDir, function (outErr) {
                            if (outErr) {
                                return callback(outErr);
                            }
                            fs.writeFile(outFile, render(output), 'utf8', callback);
                        });
                    }
                });
            }
            else {
                console.log(render(output));
                callback(null);
            }
        }
        else {
            callback(new Error('No output available to render'));
        }
    }

};

module.exports = MustacheWax;

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
