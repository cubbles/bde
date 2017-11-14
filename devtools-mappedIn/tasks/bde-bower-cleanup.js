'use strict';
var cleanUpBowerDep = require('../lib/cleanUpBowerDependencies');

module.exports = function (grunt) {
  grunt.registerTask('bdeCleanUpBower', 'Cleanup all bower dependencies (delete demos and images)', function () {
    cleanUpBowerDep(grunt);
  });
};
