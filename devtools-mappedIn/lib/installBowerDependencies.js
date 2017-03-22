/* global module */
'use strict';
var execSync = require('child_process').execSync;
var del = require('del');
var path = require('path');

module.exports = function (grunt) {
  var webpackagePath = grunt.config.get('param.src');
  var vendorPath = path.join(webpackagePath, 'bde', grunt.config.get('bdeBowerInstall.vendorPath'));
  grunt.log.writeln('Installing dependencies defined in' + webpackagePath + '/bower.json ...');
  execSync('bower install', { cwd: webpackagePath });
  var returnValue = del.sync(
    [
      vendorPath + '/**/demo/',
      vendorPath + '/**/demos/',
      vendorPath + '/**/test/',
      vendorPath + '/**/tests/'
    ],
    {
      force: true
    });
  return returnValue;
};
