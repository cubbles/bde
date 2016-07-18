'use strict';

/**
 * Contains bde specific tasks
 */
module.exports = function (grunt) {
  grunt.registerTask('+build', 'Built the noflo library.', [
    'noflo_browser',
    'uglify:noflo'
  ]);
};
