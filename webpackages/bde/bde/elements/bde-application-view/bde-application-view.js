(function () {
  'use strict';

  // window.addEventListener('message', console.log.bind(console));

  Polymer({

    is: 'bde-application-view',

    properties: {

      loaded: {
        type: Boolean,
        value: false,
        notify: true
      },

      firstDomLoaded: {
        type: Boolean,
        value: false
      },
      currentComponentMetadata: {
        type: Object
      },
      settings: {
        type: Object
      },
      active: {
        type: Boolean,
        value: false
      }
    },

    observers: [
      'currentComponentMetadataChanged(currentComponentMetadata.*)'
    ],

    created: function () {
      // Polymer does not let me bind to window in `listeners`
      window.addEventListener('message', this.handleMessage.bind(this), false);
    },

    ready: function () {
      this.parentNode.addEventListener('iron-select', this.entryHandler);
    },

    handleMessage: function (event) {
      var data = event.data || {};

      if (!data || !data.message) {
        return;
      }

      switch (data.message) {

        case 'loaded':
          this.loaded = true;
          // console.log('`loaded` event from iframe');
          break;
        // NOTE:
        // if you reload the frame, before the content loaded, is the url 'about:blank) (sometimes || in Firefox)
        // The solution:  on the very first time you must wait for the DOMContentReEady-Event before reload the iframe
        // The iframe send a message, if catch the DOMContentReady even. See "#currentComponentMetadataChanged"
        case 'DOMContentLoaded':
          if (!this.firstDomLoaded) {
            this.reloadIframe(() => {
              this.currentComponentMetadata.settings = this.settings;
              this._postMessage('currentComponentMetadata', this.currentComponentMetadata);
            });
          }
          this.firstDomLoaded = true;
      }
    },
    entryHandler: function (e) {
      var applicationView = e.detail.item;
      if (!applicationView || !applicationView.id || applicationView.id !== 'applicationView') {
        return;
      }
      applicationView.refreshApplication();
    },
    currentComponentMetadataChanged: function () {
      if (!this.active || !this.currentComponentMetadata || !this.currentComponentMetadata.manifest ||
            !this.currentComponentMetadata.artifactId || !this.currentComponentMetadata.endpointId) {
        return;
      }

      this.refreshApplication();
    },

    refreshApplication: function () {
      this.currentComponentMetadata.settings = this.settings;
      // NOTE:
      // if you reload the frame, before the content loaded, is the url 'about:blank) (sometimes || in Firefox)
      // The solution:  on the very first time you must wait for the DOMContentReEady-Event before reload the iframe
      // The iframe send a message, if catch the DOMContentReady even. See event handler "handleMessage"
      if (this.firstDomLoaded) {
        this.reloadIframe(() => {
          this._postMessage('currentComponentMetadata', this.currentComponentMetadata);
        });
      }
    },
    reloadIframe: function (cb) {
      this.loaded = false;

      this.$.iframe.onload = cb.bind(this);
      this.$.iframe.contentWindow.location.reload();
    },

    _postMessage: function (message, data) {
      this.debounce('postMessage', () => {
        var payload = { 'message': message };
        payload.data = {};
        if (data) {
          Object.keys(data).forEach(function (key) {
            if (key === 'manifest') {
              payload.data[ key ] = data[ key ].toValidManifest();
            } else {
              payload.data[ key ] = data[ key ];
            }
          });
        }
        this.$.iframe.contentWindow.postMessage(
          JSON.parse(JSON.stringify(payload)),
          document.location.origin
        );
      }, 500);
    }

  });
}());
