// @importedBy bde-app.html

/* global XMLHttpRequest */

(function () {
  'use strict';

  Polymer({
    is: 'bde-app',

    properties: {

      /**
       * Metadata of the current element, which is beeing created via the BDE.
       *
       * @type {Object}
       * @property currentComponentMetadata
       */
      currentComponentMetadata: {
        type: Object,
        value: function () {
          return {
            manifest: null,
            endpointId: null,
            artifactId: null
          };
        },
        notify: true
      },

      /**
       * Represents the manifest of the current edited cubble component, concording to the specifications.
       *
       * @type {Object}
       * @property manifest
       */
      manifest: {
        type: Object
      },

      /**
       * Computed value, which returns the outerHeight value of the current window object.
       *
       * @type {Number}
       * @property screenHeight
       */
      screenHeight: {
        type: Number,
        value: function () {
          return window.outerHeight;
        }
      },

      /**
       * Computed value, which returns the outerWidth value of the current window object.
       *
       * @type {Number}
       * @property screenWidth
       */
      screenWidth: {
        type: Number,
        value: function () {
          return window.outerWidth;
        }
      },

      /**
       * String value used to determine, which is the current selected view of the BDE application.
       *
       * @type {String}
       * @property selectedPage
       */
      selectedPage: {
        type: String,
        value: 'dataflowView',
        observer: 'selectedPageChanged'
      },

      /**
       * Settings property of the BDE App, saved in local storage. Contains the data for URL and storeName of the base.
       *
       * @type {Object}
       * @property settings
       */
      settings: {
        type: Object
      },

      /**
       * Helper property to paper-drawer-panel explorer window, controls its force-narrow attribute.
       *
       * @type {Boolean}
       * @property showExplorer
       */
      showExplorer: {
        type: Boolean,
        value: true
      },

      /**
       * Manifest metadata object for the selected compound component in the BDE.
       *
       * @type {Object}
       * @property selectedArtifact
       */
      selectedArtifact: {
        type: Object
      },

      /**
       * Boolean value indicating the loading of the application, overlays a paper-spinner if true otherwise hidden.
       *
       * @type {Object}
       * @property loading
       */
      loading: {
        type: Boolean,
        value: false
      },

      /**
       * Helper value, determines the version of the BDE, as described in its manifest, used for display and in the design-view.
       *
       * @type {Object}
       * @property bdeVersion
       */
      bdeVersion: {
        type: String,
        value: 'unknown'
      }
    },

    listeners: {
      'graph-needs-update': 'handleGraphUpdate',
      'bde-manifest-loaded': 'handleLoaded',
      'bde-manifest-loading': 'handleLoading',
      'bde-member-loaded': 'handleLoaded',
      'bde-member-loading': 'handleLoading',
      'iron-select': '_handlePageSelect',
      'iron_deselect': '_handlePageDeselect',
      'bde-dataflow-view-reload-required': '_handleBdeDataflowViewReloadRequired'
    },

    /**
     * Polymer attached function, sets the manifest, drawerPanel and binds a resize handler.
     *
     * @method attached
     */
    attached: function () {
      // Bind webpackage node to local scope
      this.set('manifest', this.$.manifest);

      // Show the Explorer
      this.$.drawerPanel.openDrawer();

      // Attach resize listener
      // (cannot use listeners for window events)
      window.addEventListener('resize', this.handleResize.bind(this));
    },

    /**
     * Polymer ready function. Loads BDE version
     *
     * @method ready
     */
    ready: function () {
      this.loadBdeVersion();
    },

    /**
     * Change handler for the current selected page, executed by iron-pages.
     *
     * @param  {[string]} newpage [the newly selected page]
     * @param  {[string]} oldpage [the previous page]
     * @method selectedPageChanged
     */
    selectedPageChanged: function (newpage, oldpage) {
      if (!newpage) {
        return;
      }
      if (newpage === 'dataflowView') {
        this.activateFlow();
      }
    },

    /**
     * Helper function to compute the baseURL for the repository-browser by the given parameters.
     *
     * @param  {[string]} baseUrl [URL of the base]
     * @param  {[string]} store   [storename of the given store]
     * @param  {[string]} partial [appendix for the couchdb artifact search]
     * @return {[string]}         [complete url of the couchdb in the base]
     * @method computeBaseUrl
     */
    computeBaseUrl: function (baseUrl, store, partial) {
      if (!partial || typeof partial !== 'string') {
        throw new TypeError('`partial` must be a string');
      }

      // Make sure partial starts with a slash
      partial = partial.replace(/^\/?/, '/');

      try {
        return baseUrl + '/' + store + partial;
      } catch (e) {
        return '';
      }
    },

    /**
     * Helper function to rerender the-graph element of the BDE included in the dataflowView.
     *
     * @method handleGraphUpdate
     */
    handleGraphUpdate: function () {
      this.$.dataflowView.rerender();
    },

    /**
     * Helper function for loading of the BDE, set loading property to true.
     *
     * @method handleLoading
     */
    handleLoading: function () {
      this.loading = true;
    },

    /**
     * Helper function to set the loading property to false after loading.
     *
     * @method handleLoaded
     */
    handleLoaded: function () {
      this.loading = false;
    },

    /**
     * Helper function, which changes the width and height on change of the window.
     * @param  {[Event]} event [windo change event]
     * @method handleResize
     */
    handleResize: function (event) {
      this.set('screenWidth', window.outerWidth);
      this.set('screenHeight', window.outerHeight);
    },

    // loadManifest: function (manifest) {
    //   this.$.manifest.loadManifest(manifest);
    // },

    /**
     * Callback function on-tap of a paper-button to load only compound components from the base, sets the value compoundOnly and opend the repository-browser element.
     *
     * @method getCompoundFromBase
     */
    getCompoundFromBase: function () {
      this.$.browser.compoundOnly = true;
      // this.$.parser.showCompoundMembers = true;
      this.$.browser.toggleDialog();
    },

    // deprecated ??
    _computeAddComponent: function (sidebar) {
      return (sidebar) ? 'push-right' : '';
    },

    _concatArray: function () {
      return [].concat.apply(this, arguments);
    },

    /**
     * Helper function listener, reloads the dataflowView element (the-graph).
     *
     * @method _handleBdeDataflowViewReloadRequired
     */
    _handleBdeDataflowViewReloadRequired: function () {
      this.$.dataflowView.reload();
    },

    /**
     * Helper function, for selecting a page to call the resizeView helper function.
     *
     * @param  {[Event]} event [onTapEvent]
     * @method _handlePageSelect
     */
    _handlePageSelect: function (event) {
      if (event.detail.item.id === 'dataflowView') {
        this._resizeView(event.detail.item);
      }
    },

    /**
     * Helper function to call the resize function.
     *
     * @param  {[String]} view [the current BDE view]
     * @method _resizeView
     */
    _resizeView: function (view) {
      view.handleResize();
    },

    /**
     * Handler for the open property of the settings dialog.
     *
     * @method storeSettingsBtnHandler
     */
    storeSettingsBtnHandler: function () {
      this.$.storeSettings.opened = !this.$.storeSettings.opened;
    },

    /**
     * Handler for the open property of the about dialog.
     *
     * @method aboutBtnHandler
     */
    aboutBtnHandler: function () {
      this.$.about.opened = !this.$.about.opened;
    },

    /**
     * Handler for the open property of the helpPage dialog.
     *
     * @method helpBtnHandler
     */
    helpBtnHandler: function () {
      this.$.help.opened = !this.$.help.opened;
    },

    /**
     * Handler for the open property of the confirmation dialog.
     *
     * @method confirmationHandler
     */
    confirmationHandler: function () {
      this.$.confirm.opened = !this.$.confirm.opened;
    },

    /**
     * Handler for the open property of the base-deployment dialog.
     *
     * @method openDeployDialog
     */
    openDeployDialog: function () {
      this.$.deployDialog.opened = !this.$.deployDialog.opened;
    },

    /**
     * Handler function to create a new webpackage; calls resetBDE.
     *
     * @method newWebpackageBtnHandler
     */
    newWebpackageBtnHandler: function () {
      this.resetBDE();
    },

    /**
     * Manifest reset function.
     *
     * @method resetBDE
     */
    resetBDE: function () {
      this.$.manifest.reset();
    },

    /**
     * Init function to set the settings for the base.
     *
     * @method initializeDefaultSettings
     */
    initializeDefaultSettings: function () {
      this.set('settings', {
        baseUrl: 'https://cubbles.world',
        store: 'sandbox'
      });
    },

    /**
     * Function to determine the BDE version. For this a XHttpRequest is used to get the manifest.webpackage from the parent directory of the BDE app and set the value to the bdeVersion property.
     * NOTE: webserver configuration must allow this, as well it must serve the right directories.
     *
     * @method loadBdeVersion
     */
    loadBdeVersion: function () {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            this.set('bdeVersion', JSON.parse(xhr.responseText).version);
          } else {
            console.error('BDE version could no be determined. Error loading bde  manifest. Request returned a status of ' + xhr.status);
          }
        }
      }.bind(this);
      xhr.open('GET', '../manifest.webpackage', true);
      xhr.send();
    },

    /**
     * Sets the attibutes after tapping the dataflowView button.
     */
    activateFlow: function () {
      this.$.flowIcon.setAttribute('ariaActiveAttribute', 'aria-pressed');
      this.$.designIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
      this.$.appIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
    },

    /**
     * Sets the attibutes after tapping the desigView button.
     */
    activateDesign: function () {
      this.$.flowIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
      this.$.designIcon.setAttribute('ariaActiveAttribute', 'aria-pressed');
      this.$.appIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
    },

    /**
     * Sets the attibutes after tapping the applicationView button.
     */
    activateApp: function () {
      this.$.flowIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
      this.$.designIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
      this.$.appIcon.setAttribute('ariaActiveAttribute', 'aria-pressed');
    }
  });
})();
