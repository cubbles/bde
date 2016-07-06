/**
 * This generates ../the-graph/font-awesome-unicode-map.js for use in our SVG
 */

"use strict";

const fs = require('fs')

function generateFile(err, data) {
  if (err) { throw err; }

  var match, key, u;
  var linePattern = /@fa-var-[^;]*/g;
  var namePattern = /@fa-var-(.*): \"\\(.*)\"/;
  var lines = data.match(linePattern);
  var icons = {};
  
  lines.forEach(function(line) {
    match = namePattern.exec(line);
    if (match) {
      key = match[1];
      u = "%u" + match[2];
      u = unescape(u);
      icons[key] = u;
    }
  });

  var output = "/**\n * this file is generated via `gulp build-fa` \n */\n\n" +
    "(function(context) {\n" +
    "\"use strict\";\n\n" +
    "context.TheGraph.FONT_AWESOME = " + JSON.stringify(icons, null, 2) + ";\n\n" +
    "})(this);";

  fs.writeFile(__dirname + "/../build/font-awesome-unicode-map.js", output, function(err) {
    if (err) { throw err; }

    console.log("Font Awesome icons map saved with", Object.keys(icons).length, "icons and aliases.");
  });
}

fs.readFile(__dirname + "/../bower_components/font-awesome/less/variables.less", "utf8", generateFile);