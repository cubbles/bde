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
      callback.apply(xhr, [requestSuccess]);
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}
