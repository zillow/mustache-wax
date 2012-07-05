module.exports = function(Handlebars, depth0, helpers, partials, data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self = this, functionType = "function", helperMissing = helpers.helperMissing, undef = void 0, escapeExpression = this.escapeExpression;
    buffer += 'YUI.add("';
    foundHelper = helpers.prefix;
    stack1 = foundHelper || depth0.prefix;
    if (typeof stack1 === functionType) {
        stack1 = stack1.call(depth0, {
            hash: {}
        });
    } else if (stack1 === undef) {
        stack1 = helperMissing.call(depth0, "prefix", {
            hash: {}
        });
    }
    buffer += escapeExpression(stack1);
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if (typeof stack1 === functionType) {
        stack1 = stack1.call(depth0, {
            hash: {}
        });
    } else if (stack1 === undef) {
        stack1 = helperMissing.call(depth0, "name", {
            hash: {}
        });
    }
    buffer += escapeExpression(stack1) + '", function (Y) {\n    Y.namespace("';
    foundHelper = helpers.ns;
    stack1 = foundHelper || depth0.ns;
    if (typeof stack1 === functionType) {
        stack1 = stack1.call(depth0, {
            hash: {}
        });
    } else if (stack1 === undef) {
        stack1 = helperMissing.call(depth0, "ns", {
            hash: {}
        });
    }
    buffer += escapeExpression(stack1) + '")["';
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if (typeof stack1 === functionType) {
        stack1 = stack1.call(depth0, {
            hash: {}
        });
    } else if (stack1 === undef) {
        stack1 = helperMissing.call(depth0, "name", {
            hash: {}
        });
    }
    buffer += escapeExpression(stack1) + '"] = Y.Handlebars.template(';
    foundHelper = helpers.precompiled;
    stack1 = foundHelper || depth0.precompiled;
    if (typeof stack1 === functionType) {
        stack1 = stack1.call(depth0, {
            hash: {}
        });
    } else if (stack1 === undef) {
        stack1 = helperMissing.call(depth0, "precompiled", {
            hash: {}
        });
    }
    if (stack1 || stack1 === 0) {
        buffer += stack1;
    }
    buffer += ');\n}, "@VERSION@", { "requires": ["handlebars-base"] });\n';
    return buffer;
};