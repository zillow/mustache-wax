module.exports = function(Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [ 4, ">= 1.0.0" ];
    helpers = this.merge(helpers, Handlebars.helpers);
    data = data || {};
    var buffer = "", stack1, stack2, functionType = "function", escapeExpression = this.escapeExpression;
    buffer += 'YUI.add("' + escapeExpression((stack1 = depth0.prefix, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + escapeExpression((stack1 = depth0.name, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '", function (Y) {\n    Y.namespace("' + escapeExpression((stack1 = depth0.ns, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '")["' + escapeExpression((stack1 = depth0.name, typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + '"] = Y.Handlebars.template(';
    stack2 = (stack1 = depth0.precompiled, typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
    if (stack2 || stack2 === 0) {
        buffer += stack2;
    }
    buffer += ');\n}, "@VERSION@", { "requires": ["handlebars-base"] });\n';
    return buffer;
};