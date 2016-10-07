(function () {
  'use strict';

  var crcRoot = document.querySelector('#crcRoot');
  // (erne-mt) TODO: needs update ???
  var rteWebpackage = 'cubx.core.rte@1.10.0-SNAPSHOT';

  // const DEBUG = false;
  // window.__console__ = window.console;
  // window.console = {
  //     'log': function () {
  //         if (DEBUG) window.__console__.log.apply(window.__console__, arguments);
  //     }
  // };

  /**
   * Handles incoming message from the parent window.
   *
   * @param  {[Event]} event [Post message event from parent]
   */
  function _handleMessage (event) {
    var data = event.data || {};
    if (!data || !data.message) {
      return;
    }

    switch (data.message) {
      case 'debug':
        // console.log('got', data);
        break;

      case 'currentComponentMetadata':
        if (data.data) {
          _handleCurrentComponentMetadata.call(this, data.data);
        }
        break;
    }
  };

  /**
   * Parses the manifest metadata and appends the new compoudn component as DOM element.
   *
   * @param  {[Object]} currentComponentMetadata [current component manifest metadata]
   * @return {[type]}                          [description]
   */
  function _handleCurrentComponentMetadata (currentComponentMetadata) {
    if (typeof currentComponentMetadata.manifest === 'string') {
      currentComponentMetadata.manifest = JSON.parse(currentComponentMetadata.manifest);
    }

    // Cannot handle resetting CIF container, yet
    if (window.cif) {
      document.location.reload();
      return;
    }

    var component = document.createElement(currentComponentMetadata.artifactId);
    crcRoot.appendChild(component);

    var baseUrl = currentComponentMetadata.settings.baseUrl + '/' + currentComponentMetadata.settings.store + '/';
    var crcLoaderUrl = baseUrl + rteWebpackage + '/crc-loader/js/main.js';
    var webComponentsUrl = baseUrl + rteWebpackage + '/webcomponents/webcomponents-lite.js';

    var webpackageId = currentComponentMetadata.manifest.name + '@' +
      currentComponentMetadata.manifest.version + '/' +
      currentComponentMetadata.artifactId + '/' +
      currentComponentMetadata.endpointId;
    if (currentComponentMetadata.manifest.groupId && currentComponentMetadata.manifest.groupId.length > 0) {
      webpackageId = currentComponentMetadata.manifest.groupId + '.' + webpackageId;
    }

    // Create rootDependencies object
    window.cubx = {
      CRCInit: {
        allowAbsoluteResourceUrls: true,
        rootDependencies: [
          {
            endpoint: webpackageId,
            manifest: currentComponentMetadata.manifest
          }
        ]
      }
    };


    _injectScript(webComponentsUrl, function () {
      // console.log('Webcomponents injected...');
    });

    _injectScript(crcLoaderUrl, function () {
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent('iframeReady', true, true, {});
      // Dispatch this 'iframeReady' event so that the CRC starts working
      document.dispatchEvent(event);
      // console.log('crcLoader script injected...');
    },
    {'data-crcinit-loadcif': 'true', 'data-cubx-startevent': 'iframeReady'});
  };

  /**
   * Injects javascript of the component to the head of the iframe.
   *
   */
  function _injectScript (src, cb, additionalAttrs) {
    var head = document.querySelector('head');
    var script = document.createElement('script');
    script.async = false;
    script.type = 'text/javascript';

    script.onload = function () {
      cb.call(this);
    }.bind(this);

    script.src = src;
    if (additionalAttrs) {
      for (var attr in additionalAttrs) {
        script.setAttribute(attr, additionalAttrs[ attr ]);
      }
    }
    head.appendChild(script);
  };

  /**
   * Post message to parent window.
   *
   */
  function _postMessage (incomingMessage, data) {
    var message = { message: incomingMessage };

    if (data) { message.data = data; }

    window.parent.postMessage(
      JSON.parse(JSON.stringify(message)),
      document.location.origin
    );
  };

  window.addEventListener('message', _handleMessage, false);
  window.addEventListener('DOMContentLoaded', function (e) {
    _postMessage('DOMContentLoaded');
  }, false);
  window.addEventListener('cifReady', function (e) {
    _postMessage('loaded');
  }, false);

}());
