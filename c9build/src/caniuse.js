define(function(require, exports, module) {
    "use strict";

    var browsers = require("./browsers");
    var data = require("./data.json");
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

    // TODO: Buggy, improve
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
