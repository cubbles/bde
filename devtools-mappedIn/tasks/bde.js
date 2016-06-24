'use strict';

/**
 * Contains bde specific tasks
 */
module.exports = function (grunt) {

  grunt.registerTask('build', [
    'noflo_browser',
    'uglify:noflo'
  ]);

};
