// @importedBy bde-app.html

/* global XMLHttpRequest */
(function () {
  'strict mode';
  Polymer({
    is: 'bde-app',

    properties: {

      /**
       * Metadata of the current element, which is beeing created via the BDE.
       * It has the properties "manifest", "artifactId".
       *
       * @type {Object}
       * @property currentComponentMetadata
       */
      currentComponentMetadata: {
        type: Object,
        value: function () {
          return {
            manifest: this.manifest,
            artifactId: 'new-compound'
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
        observer: '_selectedPageChanged'
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
      'graph-needs-update': '_handleGraphUpdate',
      'bde-manifest-loaded': '_handleLoaded',
      'bde-manifest-loading': '_handleLoading',
      'bde-member-loaded': '_handleLoaded',
      'bde-member-loading': '_handleLoading',
      'bde-new-manifest': '_handleNewManifest',
      'iron-select': '_handlePageSelect',
      'iron_deselect': '_handlePageDeselect',
      'bde-current-artifact-change': '_currentArtifactReset',
      'bde-current-artifact-edited': '_currentArtifactReload',
      'bde-current-artifact-id-edited': '_setIsCurrentArtifactIdEdited',
      'bde-reset-webpackage-change': '_handleResetWebpackage',
      'bde-load-manifest': '_loadManifest'
    },

    observers: [
      '_manifestChanged(manifest.*)'
    ],
    /* ********************************************************************/
    /* ************************* Lifecycle methods ************************/
    /* ********************************************************************/
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
      window.addEventListener('resize', this._handleResize.bind(this));
    },

    /**
     * Polymer ready function. Loads BDE version
     *
     * @method ready
     */
    ready: function () {
      this._loadBdeVersion();
    },

    /* ********************************************************************/
    /* ************************** public methods **************************/
    /* ********************************************************************/

    /**
     * Manifest reset function.
     *
     * @method resetBDE
     */
    resetBDE: function () {
      this.$.dataflowView.reset();
      this.$.dataflowView.reload();
      this.$.manifest.reset();
    },

    /* ********************************************************************/
    /* ************************** private methods *************************/
    /* ********************************************************************/

    /**
     * Handler for the open property of the about dialog.
     *
     * @method _aboutBtnHandler
     * @private
     */
    _aboutBtnHandler: function () {
      this.$.about.opened = !this.$.about.opened;
    },

    /**
     * Sets the attibutes after tapping the applicationView button.
     * @private
     * @method _activateApp
     */
    _activateApp: function () {
      this.$.flowIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
      this.$.designIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
      this.$.appIcon.setAttribute('ariaActiveAttribute', 'aria-pressed');
    },

    /**
     * Sets the attibutes after tapping the desigView button.
     * @private
     * @method _activateDesign
     */
    _activateDesign: function () {
      this.$.flowIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
      this.$.designIcon.setAttribute('ariaActiveAttribute', 'aria-pressed');
      this.$.appIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
    },

    /**
     * Sets the attibutes after tapping the dataflowView button.
     * @private
     * @method _activateFlow
     */
    _activateFlow: function () {
      this.$.flowIcon.setAttribute('ariaActiveAttribute', 'aria-pressed');
      this.$.designIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
      this.$.appIcon.setAttribute('ariaActiveAttribute', 'aria-not-pressed');
    },

    /**
     * Helper function to compute the baseURL for the repository-browser by the given parameters.
     *
     * @param  {[string]} baseUrl [URL of the base]
     * @param  {[string]} store   [storename of the given store]
     * @param  {[string]} partial [appendix for the couchdb artifact search]
     * @return {[string]}         [complete url of the couchdb in the base]
     * @method _computeBaseUrl
     * @private
     */
    _computeBaseUrl: function (baseUrl, store, partial) {
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
     * Handler for the open property of the confirmation dialog.
     *
     * @method _confirmationHandler
     * @private
     */
    _confirmationHandler: function () {
      this.$.confirmNewWebpackage.opened = !this.$.confirmNewWebpackage.opened;
    },

    /**
     * Handler Method for the event "bde-current-artifact-edited".
     * Reset and reload the dataflowview.
     * @private
     * @method _currentArtifactReload
     */
    _currentArtifactReload: function () {
      this._currentArtifactReset();
      this.$.dataflowView.reload();
    },

    /**
     * Handler Method for the event "bde-current-artifact-change".
     * Reset the dataflowview.
     * @private
     * @method _currentArtifactReset
     */
    _currentArtifactReset: function () {
      this.$.dataflowView.reset();
      // this.$.dataflowView.set('autolayoutAfterRerender', true);
    },

    /**
     * Callback function on-tap of a paper-button to load only compound components from the base, sets the value compoundOnly and opend the repository-browser element.
     *
     * @method _getCompoundFromBase
     * @private
     */
    _getCompoundFromBase: function () {
      this.$.browser.toggleDialog();
    },

    /**
     * Helper function to rerender the-graph element of the BDE included in the dataflowView.
     *
     * @method handleGraphUpdate
     * @private
     */
    _handleGraphUpdate: function () {
      this.$.dataflowView.rerender();
    },

    /**
     * Helper function to set the loading property to false after loading.
     *
     * @method _handleLoaded
     * @private
     */
    _handleLoaded: function () {
      this.loading = false;
    },

    /**
     * Helper function for loading of the BDE, set loading property to true.
     *
     * @method _handleLoading
     * @private
     */
    _handleLoading: function () {
      this.loading = true;
    },

    /**
     * Handler method for change the bde-new-manifest event.
     * @private
     * @method _handleNewManifest
     */
    _handleNewManifest: function () {
      this.$.explorer.resetSelection();
    },

    /**
     * Helper function, for selecting a page to call the resizeView helper function.
     *
     * @param  {[Event]} event [onTapEvent]
     * @method _handlePageSelect
     * @private
     */
    _handlePageSelect: function (event) {
      if (event.detail.item.id === 'dataflowView') {
        this._resizeView(event.detail.item);
      }
    },
    _handleResetWebpackage: function (evt) {
      var artifact = evt.detail;
      this.set('currentComponentMetadata.artifactId', artifact.artifactId);
    },
    /**
     * Helper function, which changes the width and height on change of the window.
     * @param  {[Event]} event [windo change event]
     * @method _handleResize
     * @private
     */
    _handleResize: function (event) {
      this.set('screenWidth', window.outerWidth);
      this.set('screenHeight', window.outerHeight);
    },

    /**
     * Handler for the open property of the helpPage dialog.
     *
     * @method _helpBtnHandler
     * @private
     */
    _helpBtnHandler: function () {
      this.$.help.opened = !this.$.help.opened;
    },

    /**
     * Init function to set the settings for the base.
     *
     * @method initializeDefaultSettings
     * @private
     */
    _initializeDefaultSettings: function () {
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
     * @private
     */
    _loadBdeVersion: function () {
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
     * Handler method for bde-load-manifest event. Trigger the bde-manifest to load the evnt detail transported new manifest.
     * @param {Event} evt bde-load-manifest event
     * @private
     */
    _loadManifest: function (evt) {
      var manifest = evt.detail;
      this.$.manifest.loadManifest(manifest);
    },

    /**
     * Handler method after manifest property changed.
     * Update the property "currentComponentMetadata" with the changes.
     * @param changeRecord
     * @private
     */
    _manifestChanged: function (changeRecord) {
      var path = changeRecord.path.replace('manifest', 'currentComponentMetadata.manifest');
      this.set(path, changeRecord.value);
    },

    /**
     * Handler function to create a new webpackage; calls resetBDE.
     *
     * @method newWebpackageBtnHandler
     * @private
     */
    _newWebpackageBtnHandler: function () {
      this.resetBDE();
    },

    /**
     * Handler for the open property of the base-deployment dialog.
     *
     * @method _openDeployDialog
     * @private
     */
    _openDeployDialog: function () {
      this.$.deployDialog.opened = !this.$.deployDialog.opened;
    },

    /**
     * Change handler for the current selected page, executed by iron-pages.
     *
     * @param  {[string]} newpage [the newly selected page]
     * @param  {[string]} oldpage [the previous page]
     * @method _selectedPageChanged
     * @private
     */
    _selectedPageChanged: function (newpage, oldpage) {
      if (!newpage) {
        return;
      }
      if (newpage === 'dataflowView') {
        this._activateFlow();
      }
    },

    /**
     * Helper function to call the resize function.
     *
     * @param  {[String]} view [the current BDE view]
     * @method _resizeView
     * @private
     */
    _resizeView: function (view) {
      view.handleResize();
    },

    /**
     * Handler method for the bde-current-artifact-id-edited event.
     * @private
     * @method _setIsCurrentArtifactIdEdited
     */
    _setIsCurrentArtifactIdEdited: function () {
      this.$.explorer.set('isArtifactIdEdited', true);
    },

    /**
     * Handler for the open property of the settings dialog.
     *
     * @method _storeSettingsBtnHandler
     * @private
     */
    _storeSettingsBtnHandler: function () {
      this.$.storeSettings.opened = !this.$.storeSettings.opened;
    }
  });
})();
