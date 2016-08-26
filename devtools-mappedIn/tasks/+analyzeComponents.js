module.exports = function(grunt) {
    'use strict';
    grunt.registerTask('+analyzeComponent', 'analyze component using polymer-analyzer', function() {
        const Analyzer = require('polymer-analyzer/lib/analyzer').Analyzer;
        const FSUrlLoader = require('polymer-analyzer/lib/url-loader/fs-url-loader').FSUrlLoader;

        const path = require('path');


        var paths = require('../../webpackages/bde/temp/paths.json').filter(pfad => pfad.type === "file");

        paths.forEach(pfad => {
            var analyzer = new Analyzer({
                urlLoader: new FSUrlLoader(path.dirname(pfad.location)),
            });

            analyzer.analyze('/' + path.basename(pfad.location))
              .then((document) => {
                    console.log(document);
                })
              .catch(error => console.log(error));
        });
    });
}
