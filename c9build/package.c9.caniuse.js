define("plugins/c9.caniuse/package.c9.caniuse", [], {
    "name": "c9.caniuse",
    "version": "1.0.5",
    "description": "caniuse.com plugin for Cloud9",
    "main": "caniuse.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/tgjmjgj/c9.caniuse.git"
    },
    "keywords": [
        "caniuse",
        "c9"
    ],
    "author": "Ozcan Ovunc",
    "license": "MIT",
    "contributors": [
        {
            "name": "Pavel Karpovich",
            "email": "Chesh397@mail.ru"
        }
    ],
    "permissons": "world",
    "bugs": {
        "url": "https://github.com/tgjmjgj/c9.caniuse/issues"
    },
    "homepage": "https://github.com/tgjmjgj/c9.caniuse#readme",
    "dependencies": {
        "caniuse-db": "https://github.com/Fyrd/caniuse.git"
    },
    "categories": [
        "Extension Packs"
    ],
    "c9": {
        "plugins": [
            {
                "packagePath": "plugins/c9.caniuse/c9.caniuse"
            }
        ]
    }
});

define("plugins/c9.caniuse/mode/extensions",[], function(require, exports, module) {
    "use strict";
    module.exports = [".css", ".less"];
});

define("plugins/c9.caniuse/mode/browsers",[], function(require, exports, module) {
    "use strict";
    module.exports = ["chrome", "edge", "firefox", "opera", "safari"];
});

define("plugins/c9.caniuse/mode/caniuse",[], function(require, exports, module) {
    "use strict";

    var browsers = require("plugins/c9.caniuse/mode/browsers");
    var data = require("plugins/c9.caniuse/mode/data.json");
    console.log("data:\n" + data);
    data = JSON.parse(data).data;

    module.exports = function(feature) {
        var info;
        feature = feature.replace(/\W*/g, '');
        info = data[feature];
        if (!info) {
            feature = feature && slowFind(feature);
            info = feature && data[feature];
        }
        return info && getSupportVersions(info.stats) || {};
    };

    function slowFind(query) {
        var categories, description, key, keywords, matcher, ref, ref1, results, title;
        results = [];
        ref = data;
        for (key in ref) {
            ref1 = ref[key], title =
                ref1.title, description =
                ref1.description, keywords =
                ref1.keywords, categories =
                ref1.categories;
            matcher = (key + title + description + keywords + categories);
            matcher = matcher.toLowerCase().replace(/\W*/g, '');
            if (matcher.match(query)) {
                results.push(key);
            }
        }
        return results[0];
    }
    function getMinimumSupportedVersion(browserVersions) {
        var minVersion = null;
        Object.keys(browserVersions).forEach(function(version) {
            if (browserVersions[version] === "y" && !minVersion)
                minVersion = version;
        });
        return minVersion;
    }

    function getSupportVersions(stats) {
        var report = {};
        Object.keys(stats).forEach(function(browser) {
            var browserVersions = stats[browser];
            var version = getMinimumSupportedVersion(browserVersions);
            if (browsers.indexOf(browser) > -1)
                report[browser] = version;
        });
        return report;
    }
});

define("plugins/c9.caniuse/c9.caniuse",[], function(require1, exports, module) {
var $build_deps$ = {require: require1, exports: exports, module: module};
exports = undefined; module = undefined;
function define(name, deps, m) {
    if (typeof name == "function") {
        m = name; deps = ["require", "exports", "module"]; name = $build_deps$.module.id
    }
    if (typeof name !== "string") {
        m = deps; deps = name; name = $build_deps$.module.id
    }
    if (!m) {
        m = deps; deps = [];
    }
    var ret = typeof m == "function" ?
        m.apply($build_deps$.module, deps.map(function(n){return $build_deps$[n] || require(n)})) : m
    if (ret != undefined) $build_deps$.module.exports = ret;
    if (name != $build_deps$.module.id && $build_deps$.module.define) {
        $build_deps$.module.define(name, [], function() { return $build_deps$.module.exports });
    }
}
define.amd = true;
define("plugins/c9.caniuse/c9.caniuse",
       [],
       function(require2, exports, module) {
    main.consumes = ["Plugin", "tabManager", "ui", "ace"];
    main.provides = ["c9.caniuse"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var plugin = new Plugin("ozcanovunc", main.consumes, {
            name: "c9.caniuse"
        });
        var tabManager = imports.tabManager;
        var ui = imports.ui;
        var ace = imports.ace;
        console.log("name:\n" + name);
        console.log("require: \n" + require);
        console.log("require1: \n" + require1);
        console.log("require2: \n" + require2);
        console.log("exports: \n" + exports);
        console.log("module: \n" + module);
        console.log("options: \n" + options);
        console.log("imports: \n" + imports);
        console.log("importsJSON: \n" + JSON.stringify(imports, null, 4));
        console.log("register: \n" + register);
        var path = require1("path");
        var extensions = require1("plugins/c9.caniuse/mode/extensions");
        var caniuse = require1("plugins/c9.caniuse/mode/caniuse");
        console.log("extensions:\n" + extensions);
        console.log("caniuse:\n" + caniuse);
        var markup = `
            <a:application xmlns:a="http://ajax.org/2005/aml">
                <a:bar id="caniuse-bar" skin="bar-status" skinset="c9statusbar" class="caniuse-bar" style="display:none;">
                    <a:label caption="CR" tooltip="Chrome" />
                    <a:label id="caniuse-chrome-version" />
                    <a:label id="caniuse-chrome-check" class="fa fa-check" />
                    <a:label id="caniuse-chrome-uncheck" class="fa fa-times" />
            
                    <a:label caption="Edge" class="caniuse-marginLeft" />
                    <a:label id="caniuse-edge-version" />
                    <a:label id="caniuse-edge-check" class="fa fa-check" />
                    <a:label id="caniuse-edge-uncheck" class="fa fa-times" />
            
                    <a:label caption="FF" class="caniuse-marginLeft" />
                    <a:label id="caniuse-firefox-version" />
                    <a:label id="caniuse-firefox-check" class="fa fa-check" />
                    <a:label id="caniuse-firefox-uncheck" class="fa fa-times" />
            
                    <a:label caption="OP" class="caniuse-marginLeft" />
                    <a:label id="caniuse-opera-version" />
                    <a:label id="caniuse-opera-check" class="fa fa-check" />
                    <a:label id="caniuse-opera-uncheck" class="fa fa-times" />
            
                    <a:label caption="SF" class="caniuse-marginLeft" />
                    <a:label id="caniuse-safari-version" />
                    <a:label id="caniuse-safari-check" class="fa fa-check" />
                    <a:label id="caniuse-safari-uncheck" class="fa fa-times" />
                </a:bar>
            </a:application>
        `
        var css = require1("text!plugins/c9.caniuse/bar.less");
        var css1 = require1("plugins/c9.caniuse/bar.less");
        var css2 = require1("text!./bar.less");
        var css3 = require1("./bar.less");
        var css4 = require1("https://tgjmjgj.github.io/c9.caniuse/c9build/bar.less");
        var css5 = require1("text!https://tgjmjgj.github.io/c9.caniuse/c9build/bar.less");
        var css6 = require1("bar.less");
        console.log("css is \n" + css);
        console.log("css1 is \n" + css1);
        console.log("css2 is \n" + css2);
        console.log("css3 is \n" + css3);
        console.log("css4 is \n" + css4);
        console.log("css5 is \n" + css5);
        console.log("css6 is \n" + css6);
        var loaded = false;
        var onFocusEventSet = false;
        var bar = null;

        plugin.freezePublicAPI({});

        plugin.on("load", function() {
            if (loaded) return;
            loaded = true;
        });

        plugin.on("unload", function() {
            plugin = null;
            loaded = false;
            onFocusEventSet = false;
            bar = null;
        });
        ace.on("create", function(e) {
            var editor = e.editor;
            if (editor.type != "ace")
                return;

            editor.once("draw", function() {
                ui.insertCss(css, plugin);
                ui.insertMarkup(editor.aml, markup, plugin);
                bar = plugin.getElement("caniuse-bar");
            }, editor);
        });

        tabManager.on("focus", function(e) {
            if (e.tab.editorType === "ace" && !onFocusEventSet) {
                onFocusEventSet = true;
                onFocus(e);
            }
        });

        function onFocus(e) {
            var tab = e.tab;
            var editor = tab.editor;
            var ace = editor.ace;
            var scroller = ace.renderer.scroller;

            scroller.addEventListener("mouseup", function() {
                var currentTab = tabManager.focussedTab;
                var title = currentTab.document.title;
                var extension = path.extname(title);
                if (extensions.indexOf(extension) > -1) {
                    var selectedText = ace.getCopyText() || "";
                    var report = caniuse(selectedText);
                    show(report);
                }
                else {
                    show();
                }
            });
        }

        function show(report) {
            report = report || {};
            var browsers = Object.keys(report);
            bar.$html.style.display = (browsers.length > 0) ? "" : "none";
            browsers.forEach(function(browser) {
                var version = report[browser];
                var lblVersion = plugin.getElement("caniuse-" + browser + "-version");
                var lblCheck = plugin.getElement("caniuse-" + browser + "-check");
                var lblUncheck = plugin.getElement("caniuse-" + browser + "-uncheck");

                if (version) {
                    lblVersion.setAttribute("caption", version);
                    lblCheck.$html.style.display = "";
                    lblUncheck.$html.style.display = "none";
                }
                else {
                    lblVersion.setAttribute("caption", "");
                    lblCheck.$html.style.display = "none";
                    lblUncheck.$html.style.display = "";
                }
            });
        }

        register(null, {
            "c9.caniuse": plugin
        });
    }
});
});
