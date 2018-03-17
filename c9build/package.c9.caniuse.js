define("plugins/c9.caniuse/package.c9.caniuse", [], {
    "name": "c9.caniuse",
    "description": "Caniuse for Cloud9",
    "version": "1.0.5",
    "author": "Ozcan Ovunc",
    "contributors": [
        {
            "name": "Pavel Karpovich",
            "email": "Chesh397@mail.ru"
        }
    ],
    "permissons": "world",
    "engines": {
        "c9": ">=3.0.0"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/tgjmjgj/c9.caniuse.git"
    },
    "categories": [
        "Extension Packs"
    ],
    "license": "MIT",
    "dependencies": {
        "nodegit": "^0.21.1"
    },
    "c9": {
        "plugins": [
            {
                "packagePath": "plugins/c9.caniuse/c9.caniuse"
            }   
        ]
    }
});

define("plugins/c9.caniuse/c9.caniuse",
       [],
       function(require, exports, module) {
    main.consumes = ["Plugin", "tabManager", "ui", "ace", "fs", "language"];
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
        console.log("require: \n" + require);
        console.log("exports: \n" + exports);
        console.log("module: \n" + module);
        console.log("options: \n" + options);
        console.log("optionsJSON: \n");
        for (let opt in options) {
            console.log(opt);
        }
        console.log(options.packagePath);
        console.log(options.staticPrefix);
        console.log(options.consumes);
        console.log("imports: \n" + imports);
        console.log("importsJSON: \n");
        for (let prop in imports) {
            console.log(prop);
        }
        for (let plugin in imports.Plugin) {
            console.log("Plugin:\t" + plugin);
        }
        for (let a in imports.ace) {
            console.log("ace:\t" + a);
        }
        for (let a in imports.tabManager) {
            console.log("tabManager:\t" + a);
        }
        for (let a in imports.ui) {
            console.log("ui:\t" + a);
        }
        var language = imports.language;
        var ja = imports.jasonanalyzer;
        var fs = imports.fs;
        console.log("language: \n" + language);
        console.log("ja:\n" + ja);
        console.log("fs:\n" + fs);

        console.log("register: \n" + register);
        var path = require("path");
        var extensions = require("./mode/extensions");
        var caniuse = require("./mode/caniuse");
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
        var path = require("path");
        console.log(path);
        var path1 = require("path");
        console.log(path1);
        var crypto = require("crypto");
        console.log(crypto);
        var http = require("http");
        console.log(http);
        var util = require("util");
        console.log(util);
        var nodegit = require("nodegit");
        console.log(nodegit);

        var css = require("syle!!plugins/c9.caniuse/bar.less");
        var css1 = require("plugins/c9.caniuse/bar.less");
        var css2 = require("style!./bar.less");
        var css3 = require("./bar.less");
        var css4 = require(options.staticPrefix + "/bar.less");
        var css5 = require("style!https://tgjmjgj.github.io/c9.caniuse/c9build/bar.less");
        var css6 = require("style!bar.less");

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
                console.log(extension);
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
