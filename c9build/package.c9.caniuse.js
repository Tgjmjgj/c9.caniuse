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
        "nodegit": "https://github.com/nodegit/nodegit.git"
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
        [
            "text!./bar.xml",
           "text!./bar.less",
            "./mode/extensions",
            "path",
            "./mode/caniuse"
        ],
       function(markup, css, extensions, path, caniuse) {
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
        var loaded = false;
        var onFocusEventSet = false;
        var bar = null;
        console.log("markup is " + markup);
        console.log("css is " + css);
        console.log("extensions is " + extensions);
        console.log("path is " + path);
        console.log("caniuse is " + caniuse);

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
            console.log("editor is " + editor);
            if (editor.type != "ace")
                return;

            editor.once("draw", function() {
                ui.insertCss(css, plugin);
                ui.insertMarkup(editor.aml, markup, plugin);
                bar = plugin.getElement("caniuse-bar");
                console.log("bar is " + bar);
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
