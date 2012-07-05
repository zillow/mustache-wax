YUI.add("{{prefix}}{{name}}", function (Y) {
    Y.namespace("{{ns}}")["{{name}}"] = Y.Handlebars.template({{{precompiled}}});
}, "@VERSION@", { "requires": ["handlebars-base"] });
