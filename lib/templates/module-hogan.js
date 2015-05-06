Hogan = require("hogan.js");

if (!!!templates) var templates = {};

templates["module-hogan"] = new Hogan.Template({
    code: function(c, p, i) {
        var t = this;
        t.b(i = i || "");
        t.b('YUI.add("');
        t.b(t.v(t.f("prefix", c, p, 0)));
        t.b(t.v(t.f("name", c, p, 0)));
        t.b('", function (Y) {');
        t.b("\n" + i);
        t.b("    var tmpl = new Hogan.Template(");
        t.b(t.t(t.f("precompiled", c, p, 0)));
        t.b(");");
        t.b("\n" + i);
        t.b('    Y.namespace("');
        t.b(t.v(t.f("ns", c, p, 0)));
        t.b('")["');
        t.b(t.v(t.f("name", c, p, 0)));
        t.b('"] = function (context, partials, indent) {');
        t.b("\n" + i);
        t.b("        partials = Y.merge(partials, Hogan.partials);");
        t.b("\n" + i);
        t.b("        return tmpl.render(context, partials, indent);");
        t.b("\n" + i);
        t.b("    };");
        t.b("\n" + i);
        t.b('}, "@VERSION@", { "requires": ["hogan-base"] });');
        return t.fl();
    },
    partials: {},
    subs: {}
});

module.exports = templates["module-hogan"];