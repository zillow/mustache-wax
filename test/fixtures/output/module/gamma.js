YUI.add("template-gamma", function (Y) {
    Y.namespace("Template")["gamma"] = Y.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.gamma || (depth0 != null ? depth0.gamma : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"gamma","hash":{},"data":data}) : helper)))
    + "\n";
},"useData":true});
}, "@VERSION@", { "requires": ["handlebars-base"] });
