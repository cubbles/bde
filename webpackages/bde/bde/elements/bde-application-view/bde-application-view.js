// @importedBy bde-application-view.html
'use strict';

Polymer({

  is: 'bde-application-view',

  properties: {

    /**
     * Loaded property to show a paper-spinner on loading the iframe if loaded is false.
     * Is set to true after the date are successfully sent to the iframe.
     *
     * @type {Boolean}
     * @property loaded
     */
    loaded: {
      type: Boolean,
      value: false,
      notify: true
    },

    /**
     * Helper property for checking DOMContentLoaded event from the iframe.
     *
     * @type {Boolean}
     * @property firstDomLoaded
     */
    firstDomLoaded: {
      type: Boolean,
      value: false
    },

    /**
     * Manifest metadata from the current cubble component.
     *
     * @type {Object}
     * @property currentComponentMetadata
     */
    currentComponentMetadata: {
      type: Object
    },

    /**
     * Settings property containing the current stores URL and storename.
     *
     * @type {Object}
     * @property settings
     */
    settings: {
      type: Object
    }
  },

  observers: [
    'currentComponentMetadataChanged(currentComponentMetadata.*)'
  ],

  /**
   * Polymer created function. Registers an event listener to the message from the iframe to the window,
   * callback function 'handleMessage' evaluates the message.
   *
   * @method created
   */
  created: function () {
    // NOTE: Polymer does not let me bind to window in `listeners`
    window.addEventListener('message', this.handleMessage.bind(this), false);
  },

  /**
   * Polymer ready function. Adds event listener to listen to selecting the application view, to reload the iframe.
   *
   * @method ready
   */
  ready: function () {
    this.parentNode.addEventListener('iron-select', this.entryHandler);
  },

  /**
   * Callback function to evaluate the message from the iframe. Sets the firstDomLoaded property.
   *
   * @param  {[Event]} event [Message sent from the iframe]
   * @method handleMessage
   */
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

      // NOTE: if you reload the frame, before the content is loaded, the url is 'about:blank' (sometimes || in Firefox)
      // The solution: on the very first time you must wait for the DOMContentReady-Event before reload the iframe
      // The iframe sends a message, if catch the DOMContentReady event. See "#currentComponentMetadataChanged"
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

  /**
   * Helper function to check the entry to the application view via the parent node to refresh the view.
   *
   * @param  {[Event]} e [parentNode select event]
   * @method entryHandler
   */
  entryHandler: function (e) {
    var applicationView = e.detail.item;
    if (!applicationView || !applicationView.id || applicationView.id !== 'applicationView') {
      return;
    }
    applicationView.refreshApplication();
  },

  /**
   * Observer function for the change of the manifest metadata.
   * Refresh the application view on change.
   *
   * @method currentComponentMetadata
   */
  currentComponentMetadataChanged: function (changeRecord) {
    console.log('changeRecord', changeRecord);
    if (!this.currentComponentMetadata || !this.currentComponentMetadata.manifest || !this.currentComponentMetadata.artifactId) {
      return;
    }
    if (this.currentComponentMetadata.manifest.artifacts.compoundComponents &&
      this.currentComponentMetadata.manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === this.currentComponentMetadata.artifactId)) {
      this.refreshApplication();
    }
  },

  /**
   * Refreshes the application view and sends the current manifest metadata to the iframe with the current settings.
   *
   * @method refreshApplication
   */
  refreshApplication: function () {
    this.currentComponentMetadata.settings = this.settings;

    // NOTE: if you reload the frame, before the content is loaded, the url is 'about:blank' (sometimes || in Firefox)
    // The solution:  on the very first time you must wait for the DOMContentReady-Event before reload the iframe
    // The iframe sends a message, if catch the DOMContentReady event. See event handler "handleMessage"
    if (this.firstDomLoaded) {
      this.reloadIframe(() => {
        this._postMessage('currentComponentMetadata', this.currentComponentMetadata);
      });
    }
  },

  /**
   * Callback function to reload the application views iframe, of it is not already loaded.
   *
   * @param  {Function} cb [description]
   * @method reloadIframe
   */
  reloadIframe: function (cb) {
    this.loaded = false;

    this.$.iframe.onload = cb.bind(this);
    this.$.iframe.contentWindow.location.reload();
  },

  /**
   * Posts a message to the inherit iframe. Used for submitting tha actual manifest metadata to the iframe.
   *
   * @param  {[Object]} message [description]
   * @param  {[Object]} data    [description]
   * @method _postMessage
   */
  _postMessage: function (message, data) {
    this.debounce('postMessage', () => {
      var payload = { 'message': message };
      payload.data = {};
      if (data) {
        Object.keys(data).forEach(function (key) {
          if (key === 'manifest' && data[ key ]) {
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
