// @importedBy bde-app.html

/* global XMLHttpRequest, splitUrl, testStoreConnection, buildWebpackageId, buildParamUrl,fetch, createNewArtifact,splitWebpackageId */
(function () {
  'strict mode';
  Polymer({
    is: 'bde-app',

    properties: {

      /**
       * Helper value, determines the version of the BDE, as described in its manifest, used for display and in the design-view.
       *
       * @type {Object}
       * @property bdeVersion
       */
      bdeVersion: {
        type: String,
        value: 'unknown'
      },

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
            manifest: this.manifest
          };
        },
        notify: true
      },

      /**
       * default setting for store. This onject has the attributes baseUrl and store
       * @type Object
       * @property defaultSettings
       */
      defaultSettings: {
        type: Object
      },

      /**
       * error message
       * @type String
       * @property errorMessage
       */
      errorMessage: {
        type: String
      },

      /**
       * Indicate if error dialog opened or not.
       *
       * @type Boolean
       * @property errorDialogOpened
       * @default false
       */
      errorDialogOpened: {
        type: Boolean,
        value: false
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
       * Represents the manifest of the current edited cubble component, concording to the specifications.
       *
       * @type {Object}
       * @property manifest
       */
      manifest: {
        type: Object
      },

      /**
       * A map to cache the already resolved components. The key is the artifactId, the value has the property artifact with the artifact object, and the property componentId.
       * @type Object
       */
      resolutions: {
        type: Object,
        notify: true,
        value: function () {
          return {};
        }
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
        type: Object,
        value: function () {
          return {};
        }
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
      '_manifestChanged(manifest.*)',
      '_queryParamsChanged(location.params.*)',
      '_defaultSettingsChanged(defaultSettings.*)',
      '_currentComponentMetadataChanged(currentComponentMetadata.*)',
      '_settingsChanged(settings.*)'
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
      // read from query the url paramater
      this._readURLParamsInitial();

      // If no url param define deafults
      if (!this.searchParams.get('url')) {
        var evt = new Event('bde-reset-webpackage-change');
        var newCompoundName = 'new-compound';
        this.$.manifest.set('webpackageIdCounter', 1);
        this.$.manifest.set('artifactIdCounter', 1);
        var artifact = this._createNewArtifact({ artifactId: newCompoundName });
        this.set('settings.artifactId', artifact.artifactId);
        evt.detail = artifact;
        this._handleResetWebpackage(evt);
      }

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
     * Check if the webpackage name is "new-webpackage" or starts with "new-webpackage-<number>", and set the manifests createWe
     * @private
     */
    _checkWebpackageIdAndArtifactId: function () {
      var webpackageId = this.get('settings.webpackageId');
      var splittedWebpacakgeId = splitWebpackageId(webpackageId);
      var currentCount;
      if (splittedWebpacakgeId.name === 'new-webpackage') {
        this.$.manifest.set('webpackageIdCounter', 1);
      } else if (splittedWebpacakgeId.name.startsWith('new-webpackage-')) {
        var nameSplits = splittedWebpacakgeId.name.split('-');
        currentCount = nameSplits[ nameSplits.length - 1 ];
        if (!isNaN(currentCount)) {
          this.$.manifest.set('webpackageIdCounter', ++currentCount);
        }
      }
      var artifactId = this.get('settings.artifactId');
      if (artifactId === 'new-compound') {
        this.$.manifest.set('artifactIdCounter', 1);
      } else if (artifactId.startsWith('new-compound-')) {
        var artifactIdSplits = artifactId.split('-');
        currentCount = artifactIdSplits[ artifactIdSplits.length - 1 ];
        if (!isNaN(currentCount)) {
          this.$.manifest.set('artifactIdCounter', ++currentCount);
        }
      }
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
     * provide changes of artifactId
     * @param {string} artifactId new artifactId
     * @private
     */
    _changeArtifact: function (artifactId) {
      this.set('currentComponentMetadata.artifactId', artifactId);
      this.set('settings.artifactId', artifactId);
    },
    /**
     * Creates and returns a new artifact by using the artifactProperties
     * @param {object} artifactProperties
     * @returns {*}
     * @private
     */
    _createNewArtifact: function (artifactProperties) {
      var artifact = createNewArtifact(artifactProperties);
      this.push('manifest.artifacts.compoundComponents', artifact);
      return artifact;
    },

    /**
     * Crates a new webpackage by usage the webpacakgeId and artifactId. If no webpackageId or/and artifactId defined, use defaulst.
     *
     * @param {string} webpackageId
     * @param {string} artifactId
     * @returns {string} the webpackageId of the created webpackage
     * @private
     */
    _createNewWebpackage: function (webpackageId, artifactId) {
      var groupId;
      var name;
      var version;
      if (webpackageId) {
        var prop = splitWebpackageId(webpackageId);
        if (prop) {
          groupId = prop.groupId;
          name = prop.name;
          version = prop.version;
        }
      }

      this.$.manifest.reset(artifactId, groupId, name, version); // create manifest with a given artifactId

      webpackageId = buildWebpackageId(this.$.manifest);
      // this.set('settings.newWebpackage', true);
      this.set('settings.webpackageId', webpackageId);
      return webpackageId;
    },

    /**
     * Handle changes in currentComponentMetadata
     * @param {object} changeRecord
     * @private
     */
    _currentComponentMetadataChanged: function (changeRecord) {
      if (changeRecord.path.startsWith('currentComponentMetadata.settings')) {
        var path = changeRecord.path.replace('currentComponentMetadata.settings', 'settings');
        this.notifyPath(path, changeRecord.value);
      }
    },

    /**
     * Handle change on defaultSettings
     * @param {object} changeRecord
     * @private
     */
    _defaultSettingsChanged: function (changeRecord) {
      this.set('settings.baseUrl', this.defaultSettings.baseUrl);
      this.set('settings.store', this.defaultSettings.store);
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

    /**
     * Handle webpackage reset
     * @param {Event} evt
     * @private
     */
    _handleResetWebpackage: function (evt) {
      var artifact = evt.detail;
      this._changeArtifact(artifact.artifactId);
      if (this.manifest) {
        // this.set('settings.newWebpackage', true);
        this.set('settings.webpackageId', buildWebpackageId(this.manifest.groupId, this.manifest.name, this.manifest.version));
      }
      this.set('settings.artifactId', artifact.artifactId);
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
      this.set('defaultSettings', {
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
     * Load a webpackage defined in settings. If no existing webpackage found create a new webpackage. If no artifact found create a new artifact.
     * @private
     */
    _loadWebpackage: function () {
      if (!this.settings.webpackageId) {
        this._createNewWebpackage(null, this.settings.artifactId);
        this._setUrlParam(buildParamUrl(this.settings.baseUrl, this.settings.store, this.settings.webpackageId, this.settings.artifactId));
        // } else if (this.settings.newWebpackage) {
        //   var url = buildParamUrl(this.settings.baseUrl, this.settings.store, this.settings.webpackageId, this.settings.artifactId);
        //   this._setUrlParam(url);
      } else {
        var manifestUrl = buildParamUrl(this.settings.baseUrl, this.settings.store, this.settings.webpackageId) + '/manifest.webpackage';
        fetch(manifestUrl).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(response.status + ' ' + response.statusText);
        }).then(manifestObj => {
          this.$.manifest.loadManifest(manifestObj);
          if (manifestObj.artifacts.compoundComponents.find(comp => comp.artifactId === this.settings.artifactId)) {
            this.set('currentComponentMetadata.artifactId', this.settings.artifactId);
          } else {
            var artifact = this._createNewArtifact({
              artifactId: this.settings.artifactId
            });
            this.set('settings.artifactId', artifact.artifactId);
            this.set('currentComponentMetadata.artifactId', this.settings.artifactId);
          }
          this._setUrlParam(buildParamUrl(this.settings.baseUrl, this.settings.store, this.settings.webpackageId, this.settings.artifactId));
          this.fire('bde-load-manifest', manifestObj);
          this._currentArtifactReset();
        }).catch(error => {
          console.warn('Could not load the webpackage: "' + this.settings.webpackageId + '". Error:' + error.message);
          if (this.settings.artifactId) {
            this._createNewWebpackage(this.settings.webpackageId, this.settings.artifactId); // create webpacakge with the given artifactId
          } else {
            this._createNewWebpackage(this.settings.webpackageId); // create webpackage defaults
          }
          this._setUrlParam(buildParamUrl(this.settings.baseUrl, this.settings.store, this.settings.webpackageId, this.settings.artifactId));
          this._currentArtifactReset();
        });
      }
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
     * Read the query of the location, and initialize the settings object
     * @private
     */
    _readURLParamsInitial: function () {
      this.searchParams = new URLSearchParams(window.location.search);
      var url = this.searchParams.get('url');
      if (url) {
        var settingsObject = splitUrl(url);
        this._updateSettings(settingsObject);
        this._checkWebpackageIdAndArtifactId();
      }
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
     * Handle changes of the settings object. Load Webpacakge or artifact and update the query,
     * @param {object} changedRecord
     * @private
     */
    _settingsChanged: function (changedRecord) {
      if (!this.searchParams || !this.manifest) {
        return;
      }

      // url param from location
      var url = buildParamUrl(this.settings.baseUrl, this.settings.store, this.settings.webpackageId, this.settings.artifactId);
      if (changedRecord.path.startsWith('settings.webpackageId') || changedRecord.path.startsWith('settings.baseUrl') || changedRecord.path.startsWith('settings.store')) {
        // if baseUrl or store or webpackageId changed reload all things
        this.debounce('loadWebpackage', function () {
          this._loadWebpackage();
        }, 5);
      } else if (changedRecord.path.startsWith('settings.artifactId')) { // artifactId changed - load a just new artifact
        this.set('currentComponentMetadata.artifactId', this.settings.artifactId);
        this._setUrlParam(url);
      }
    },

    /**
     * Set the url param in the browser location field without reload the page.
     * @param {string} param the value of the url parameter
     * @private
     */
    _setUrlParam: function (param) {
      if (!this.searchParams.get('url')) {
        this.searchParams.append('url', param);
      } else {
        this.searchParams.set('url', param);
      }
      var newUrl = window.decodeURIComponent(window.location.pathname) + '?' + this.searchParams.toString();

      // Need to use a full URL in case the containing page has a base URI.
      var fullNewUrl = new URL(
        newUrl, window.location.protocol + '//' + window.location.host).href;
      window.history.replaceState({}, '', fullNewUrl);
    },

    /**
     * Handler for stopping a eventpropagation
     *
     * @method _stopEventPropagation
     * @param {event} e the event to stop propagation for
     * @private
     */
    _stopEventPropagation: function (e) {
      e.stopPropagation();
    },

    /**
     * Handler for the open property of the settings dialog.
     *
     * @method _storeSettingsBtnHandler
     * @private
     */
    _storeSettingsBtnHandler: function () {
      this.$.storeSettings.opened = !this.$.storeSettings.opened;
    },

    /**
     * Updated property setting with values from settingsObject (Object from splitting of the url paramater
     * @param {object} settingsObject
     * @private
     */
    _updateSettings: function (settingsObject) {
      if (!settingsObject) {
        return;
      }
      var self = this;
      if (settingsObject.baseUrl && settingsObject.store && settingsObject.baseUrl !== this.settings.baseUrl && settingsObject.store !== this.settings.store) {
        testStoreConnection(settingsObject.baseUrl + '/' + settingsObject.store, function (success) {
          if (!success) {
            self.set('errorMessage', 'The store url "' + settingsObject.baseUrl + '/' + settingsObject.store + '" is not valid. The application does not work without an existing store. Please correct the store url.');
            self.set('errorDialogOpened', true);
          }
        });
      }
      if (settingsObject.baseUrl) {
        this.set('settings.baseUrl', settingsObject.baseUrl);
      }
      if (settingsObject.store) {
        this.set('settings.store', settingsObject.store);
      }
      if (settingsObject.webpackageId) {
        this.set('settings.webpackageId', settingsObject.webpackageId);
      }
      if (settingsObject.artifactId) {
        this.set('settings.artifactId', settingsObject.artifactId);
      }
    }
  });
})();
