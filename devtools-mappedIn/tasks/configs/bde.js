'use strict';

/**
 * Contains bde specific tasks configuration
 *
 */
module.exports.tasks = {

  noflo_browser: {
    options: {
      // Task-specific options go here.
    },
    build: {
      files: {
        '<%= workspacePath%>/bde/bde/build/noflo.js': ['node_modules/noflo/component.json'],
      }
    }
  },

  uglify: {
    options: {
        banner: '/* NoFlo - Flow-Based Programming environment. See http://noflojs.org for more information. */',
      report: 'min'
    },
    noflo: {
      files: {
        '<%= workspacePath%>/bde/bde/build/noflo.min.js': ['<%= workspacePath%>/bde/bde/build/noflo.js']
      }
    }
  }

};
