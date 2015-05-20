YUI.add("template-beta", function (Y) {
    Y.namespace("Template")["beta"] = Y.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.beta || (depth0 != null ? depth0.beta : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"beta","hash":{},"data":data}) : helper)))
    + "\n";
},"useData":true});
}, "@VERSION@", { "requires": ["handlebars-base"] });
