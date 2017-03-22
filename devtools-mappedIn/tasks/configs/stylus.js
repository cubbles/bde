'use strict';

var glob = require('glob');
var stylExpand = glob.sync('./themes/*.styl').join(' ');

module.exports.tasks = {

  exec: {
    build_stylus: {
      command: 'node ./node_modules/stylus/bin/stylus ' + stylExpand
    }
  }
};
