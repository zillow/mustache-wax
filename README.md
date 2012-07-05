Mustachio
=========

This is a utility to wrap precompiled [Mustache][] templates (using [Handlebars][]) in [YUI][] modules, for ease of reuse as dependencies.

[Mustache]: http://mustache.github.com/
[Handlebars]: http://handlebarsjs.com/
[YUI]: http://yuilibrary.com/

Installation
------------

Install globally via npm:

    npm -g install mustachio

Or clone the [repo](https://github.com/zillow/mustachio) and link globally:

    git clone git://github.com/zillow/mustachio.git
    npm link mustachio

Usage
-----

### CLI Options

    -v, --verbose          Verbose logging                             [boolean]
    -d, --outputDir        Output base directory                        [string]
    -f, --outputFile       Output File                                  [string]
    -p, --modulePrefix     Module prefix         [string]  [default: "template"]
    -n, --moduleNamespace  Module namespace      [string]  [default: "Template"]
    -t, --moduleTemplate   Module template file
                                    [string]  [default: "./templates/module.js"]
    -k, --known            Known helpers                                [string]
    -o, --knownOnly        Known helpers only                          [boolean]
    -b, --beautify         Beautify output                             [boolean]
    -m, --min              Minimize output                             [boolean]
    -s, --simple           Output template function only               [boolean]
    -r, --root             Template root, stripped from template names  [string]

### Integrating with YUI Loader

To enable seamless use with YUI, provide this group to the [sandbox config](http://yuilibrary.com/yui/docs/yui/#config):

```js
YUI_config.groups = {
    "templates": {
        combine   : true,
        comboBase : "/combo/tmpl",
        root      : "/build/",
        patterns  : {
            "template-": {
                configFn: function (me) {
                    me.requires = [ "handlebars-base" ];
                }
            }
        }
    }
};
```

License
-------

Copyright (c) 2012 Zillow Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
