YUI.add("{{prefix}}{{name}}", function (Y) {
    var tmpl = new Hogan.Template({{{precompiled}}});
    Y.namespace("{{ns}}")["{{name}}"] = function (context, partials, indent) {
        partials = Y.merge(partials, Hogan.partials);
        return tmpl.render(context, partials, indent);
    };
}, "@VERSION@", { "requires": ["hogan-base"] });