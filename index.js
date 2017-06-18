define(function(require, exports, module) {
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
        var path = require("path");
        var extensions = require("./src/extensions");
        var caniuse = require("./src/caniuse");

        var markup = require("text!./bar.xml");
        var css = require("text!./bar.less");
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

        // Insert markup
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
