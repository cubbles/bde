'use strict';
var installBowerDep = require('../lib/installBowerDependencies');

module.exports = function (grunt) {
  grunt.registerTask('bdeBowerInstall', 'Install all bower dependencies needed for bde', function () {
    installBowerDep(grunt);
  });
};
