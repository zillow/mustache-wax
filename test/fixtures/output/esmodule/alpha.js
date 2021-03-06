// @module template-alpha
import 'handlebars-base';
import Y from 'yui-instance';
Y.namespace("Template")["alpha"] = Y.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.alpha || (depth0 != null ? depth0.alpha : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"alpha","hash":{},"data":data}) : helper)))
    + "\n";
},"useData":true});
