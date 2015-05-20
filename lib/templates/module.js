module.exports = 
{"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "YUI.add(\""
    + escapeExpression(lambda((depth0 != null ? depth0.prefix : depth0), depth0))
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "\", function (Y) {\n    Y.namespace(\""
    + escapeExpression(lambda((depth0 != null ? depth0.ns : depth0), depth0))
    + "\")[\""
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "\"] = Y.Handlebars.template(";
  stack1 = lambda((depth0 != null ? depth0.precompiled : depth0), depth0);
  if (stack1 != null) { buffer += stack1; }
  return buffer + ");\n}, \"@VERSION@\", { \"requires\": [\"handlebars-base\"] });\n";
},"useData":true}

