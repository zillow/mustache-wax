YUI.add("{{prefix}}{{name}}", function (Y) {
{{#if partials.length}}
    var partials = [],
        fn = Y.Handlebars.template({{{precompiled}}}),
        templateFn = fn;
    
    Y.Array.each({{json partials}}, function (partialName) {
        var partial = Y.namespace("{{ns}}")["{{prefix}}" + partialName];

        if (partial) {
            partials[partialName] = partial;
        }
    });

    templateFn = function (data) {
        return fn(data, {
            partials: partials
        });
    };
    Y.namespace("{{ns}}")["{{name}}"] = templateFn;
{{else}}
    Y.namespace("{{ns}}")["{{name}}"] = Y.Handlebars.template({{{precompiled}}});
{{/if}}

}, "@VERSION@", { "requires": {{json dependencies}} });
