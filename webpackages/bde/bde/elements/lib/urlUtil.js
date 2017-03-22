/**
 * Created by jtrs on 22.03.2017.
 */
'use strict';
function splitUrl (url) { // eslint-disable-line no-unused-vars
  var splittedValues = {};
  var regex = /(.*)(\/)(.*)((\/)((.*@.*)(\/)(.*))?)?/;
  var result = regex.exec(url);
  console.log('result', result);
  if (!result) {
    return;
  }
  var baseUrl = result[1];
  if (baseUrl) {
    splittedValues.baseUrl = baseUrl;
  }
  var store = result[3];
  if (store) {
    splittedValues.store = store;
  }
  var webpackageId = result[5];
  if (webpackageId) {
    splittedValues.webpackageId = webpackageId;
  }
  var artifactId = result[7];
  if (artifactId) {
    splittedValues.artifactId = artifactId;
  }
  return splittedValues;
}
