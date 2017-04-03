/**
 * Created by jtrs on 22.03.2017.
 */
'use strict';
/**
 * Split the url parameter to baseUrl, store webpackageId and artifactId and returns with an object with this properties.
 * @param {string} url the url for spitting
 * @returns {{}} an object with properties baseUrl, store, webpackageId and artifactId
 */
function splitUrl (url) { // eslint-disable-line no-unused-vars
  var splittedValues = {};
  var regex = /^(https?:\/\/[^/]*)(\/)([^/]*)(\/)?(([^/]*@[^/]*)(\/)([^/]*))?$/;
  var result = regex.exec(url);
  if (!result) {
    return;
  }
  var baseUrl = result[ 1 ];
  if (baseUrl) {
    splittedValues.baseUrl = baseUrl;
  }
  var store = result[ 3 ];
  if (store) {
    splittedValues.store = store;
  }
  var webpackageId = result[ 6 ];
  if (webpackageId) {
    splittedValues.webpackageId = webpackageId;
  }
  var artifactId = result[ 8 ];
  if (artifactId) {
    splittedValues.artifactId = artifactId;
  }
  return splittedValues;
}

/**
 * Opens a XMLHttpRequest for testing the values of the input field for the store URL.
 * If the connection can be established, requestSuccess is set to ture otherwise false.
 *
 * @param  {Function} callback [callback function of the request]
 * @method testStoreConnection
 */
function testStoreConnection (url, callback) {  // eslint-disable-line no-unused-vars
  var xhr = new XMLHttpRequest();
  // var self = this;
  xhr.onreadystatechange = function () {
    var requestSuccess = false;
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        requestSuccess = true;
      } else {
        requestSuccess = false;
      }
      callback.apply(xhr, [ requestSuccess ]);
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}

/**
 * Build and return the url parameter from baseUrl, store, webpackageId and artifact
 * @param {string} baseUrl the base url without store
 * @param {string} store the store
 * @param {string} webpackageId the webpackageId
 * @param {string} artifactId the artifactId
 * @returns {string} the url
 */
function buildParamUrl (baseUrl, store, webpackageId, artifactId) { // eslint-disable-line no-unused-vars
  var url = baseUrl;
  if (store) {
    url += '/' + store;
  }
  if (webpackageId) {
    url += '/' + webpackageId;
  }
  if (artifactId) {
    url += '/' + artifactId;
  }
  return url;
}
