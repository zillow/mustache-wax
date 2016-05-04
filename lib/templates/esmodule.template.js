// @module {{prefix}}{{name}}
import 'handlebars-base';
import Y from 'yui-instance';
Y.namespace("{{ns}}")["{{name}}"] = Y.Handlebars.template({{{precompiled}}});
