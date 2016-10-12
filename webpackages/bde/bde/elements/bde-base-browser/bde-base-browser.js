// @importedBy bde-base-browser.html
/* globals _ */
'use strict';

Polymer({
  is: 'bde-base-browser',

  properties: {
    /**
     * The search term from the `paper-input` field.
     *
     * @type {String}
     * @property searchTerm
     */
    searchTerm: {
      type: String,
      notify: true
    },

    /**
     * The selected artifact
     *
     * @type {Object}
     * @property selected
     */
    selected: {
      type: Object,
      notify: true
    },

    /**
     * Boolean value to display only app artifacts.
     *
     * @type {Boolean}
     * @property appsOnly
     */
    appsOnly: {
      type: Boolean,
      value: false
    },

    /**
     * Boolean value to display only elementary artifacts.
     *
     * @type {Boolean}
     * @property elementariesOnly
     */
    elementariesOnly: {
      type: Boolean,
      value: false
    },

    /**
     * Boolean value to display only compound artifacts.
     *
     * @type {Boolean}
     * @property compoundsOnly
     */
    compoundsOnly: {
      type: Boolean,
      value: false
    },

    /**
     * Boolean value to display only utility artifacts.
     *
     * @type {Boolean}
     * @property utilitiesOnly
     */
    utilitiesOnly: {
      type: Boolean,
      value: false
    },

    /**
     * Property referencing the global app settings.
     *
     * @type {Object}
     * @property selected
     */
    settings: {
      type: Object
    },

    /**
     * Loading property of the app, to display a paper-spinner while loading.
     *
     * @type {Boolean}
     * @property loading
     */
    loading: {
      type: Boolean,
      value: false
    },

    /**
     * Array for the Cubble endpoints.
     *
     * @type {Array}
     * @property endpoints
     */
    endpoints: {
      type: Array
    },

    /**
     * Object referencing the manifest of the Cubble.
     *
     * @type {Object}
     * @property manifest
     */
    manifest: {
      type: Object
    },

    /**
     * Array of user generated components.
     *
     * @type {Array}
     * @property ownComponents
     */
    ownComponents: {
      type: Array,
      value: function () {
        return [];
      }
    },

    /**
     * The current edited component.
     *
     * @type {Object}
     * @property currentComponent
     */
    currentComponent: {
      type: Object
    },

    /**
     * Array containing all cubbles in the base.
     *
     * @type {Array}
     * @property _cubbles
     */
    _cubbles: {
      type: Array
    },

    /**
     * Cubbles array filtered by the criteria from the input field.
     *
     * @type {Array}
     * @property _filtered
     */
    _filtered: {
      type: Array,
      value: function () {
        return [];
      }
    }
  },

  listeners: {
    'bde-select-compound': 'handleItemSelect',
    'bde-member-data-loaded': 'handleLoaded',
    'bde-member-data-loading': 'handleLoading',
    'bde-select-endpoint': 'endpointSelected',
    'iron-overlay-opened': 'handleDialogOpen',
    'iron-overlay-closed': 'handleDialogClose'
  },

  observers: [
    'settingsChanged(settings.baseUrl,settings.store)'
  ],

  attached: function () {
    this.async(function () {
      this.$.endpointsDialog.refit();
    });
  },

  /**
   * Adds the chosen Cubble component and sets the respective metadata.
   *
   * @param {[String]} artifact   [description]
   * @param {[String]} endpointId [description]
   * @method addMember
   */
  addMember: function (artifact, endpointId) {
    // start of loading animation, must be ended with this.fire('bde-member-loaded');
    this.fire('bde-member-loading');
    this.filterList(this.$.search.value);
    /**
     * Setting the cubble metadata.
     * @type {Object}
     */
    var cubble = {
      memberId: artifact.artifactId + '-' + Math.random().toString(36).substring(7),
      displayName: this._generateDisplayName(artifact.artifactId),
      metadata: {
        webpackageId: artifact.webpackageId,
        artifactId: artifact.artifactId,
        endpointId: endpointId
      }
    };

    this.fire('iron-selected', { item: cubble });
  },

  /**
   * Clear the input of the search field on button click.
   *
   * @method clearInput
   */
  clearInput: function () {
    this.set('_filtered', []);
    this.$.search.value = '';
    this.$.search.focus();
  },

  /**
   * Open the memberSelectDialog.
   *
   * @method open
   */
  open: function () {
    this.$.memberSelectDialog.open();
  },

  /**
   * Close the memberSelectDialog.
   *
   * @method close
   */
  close: function () {
    this.$.memberSelectDialog.close();
  },

  /**
   * [endpointSelected description]
   *
   * @param  {[Event]} event [description]
   * @method endpointSelected
   */
  endpointSelected: function (event) {
    var item = event.detail;
    var artifact = JSON.parse(item.artifact);
    var endpointId = item.endpointId;
    this.addMember(artifact, endpointId);
  },

  /**
   * [handleDialogOpen description]
   *
   * @param  {[Event]} event [description]
   * @method handleDialogOpen
   */
  handleDialogOpen: function (event) {
    this.set('ownComponents', this._currentManifestComponents());
    this.async(function () {
      document.activeElement.blur();
      this.$.search._focusableElement.focus();
    });
  },

  /**
   * [handleDialogClose description]
   *
   * @param  {[Event]} event [description]
   * @method handleDialogClose
   */
  handleDialogClose: function (event) {
    this.async(function () {
      this.$.search._focusableElement.blur();
    });
  },

  /**
   * Handles the input of a search term in the input field
   * and returns the filtered array matching the expression in the input.
   * As well as resizing the dialog, based on search result.
   *
   * @method handleInput
   */
  handleInput: function (event) {
    this.debounce('handleInput', function () {
      this.filterList(event.target.value);
    }.bind(this), 125);
  },

  /**
   * [filterList description]
   *
   * @param  {[String]} searchString [String from input]
   * @method filterList
   */
  filterList: function (searchString) {
    // for edge
    searchString = searchString || '';
    var searchTerm = searchString.replace(/[*,?]/g, '');
    var filtered = _.clone(this._cubbles || []);
    filtered = filtered.concat(this.ownComponents);

    // Scroll to top of the list
    this.$.list.scrollTarget.scrollTop = 0;

    if (searchTerm.length === 0) {
      this.set('_filtered', []);
      return;
    }

    if (this.appsOnly) {
      filtered = filtered.filter((i) => i.artifactType === 'app');
    }

    if (this.elementariesOnly) {
      filtered = filtered.filter((i) => i.artifactType === 'elementaryComponent');
    }

    if (this.compoundsOnly) {
      filtered = filtered.filter((i) => i.artifactType === 'compoundComponent');
    }

    if (this.utilitiesOnly) {
      filtered = filtered.filter((i) => i.artifactType === 'utility');
    }

    filtered = filtered.filter(function (item) {
      if (item.artifactId.indexOf(searchTerm) !== -1 || (item.name && item.name.indexOf(searchTerm) !== -1)) {
        return true;
      }
      return false;
    });

    filtered = filtered.sort(this._sortArtifacts);

    this.set('_filtered', filtered);

    this.async(() => this.$.list.fire('iron-resize'));
  },

  /**
   * Item was selected from the list of results.
   *
   * @method handleItemSelect
   */
  handleItemSelect: function (event) {
    var artifact = event.detail;
    this.set('selected', artifact);
    if (artifact.endpoints.length > 1) {
      var dialog = this.$.endpointsDialog;
      dialog.open();
    } else {
      this.addMember(artifact, artifact.endpoints[ 0 ].endpointId);
    }
  },

  /**
   * Sets loading property to false.
   * @method handleLoaded
   */
  handleLoaded: function () {
    this.loading = false;
  },

  /**
   * Sets loading property to true.
   *
   * @method handleLoading
   */
  handleLoading: function () {
    this.loading = true;
  },

  /**
   * Handles the initial AJAX response and applies a prefiltering of the result list.
   *
   * @method handleResponse
   * @param  {[Event]} event [Response of AJAX call.]
   */
  handleResponse: function () {
    var cubbles = this.$.ajax.lastResponse.filter((item) => item.modelVersion.match(/8.3/))
      .filter((item) => item.artifactType === 'compoundComponent' || item.artifactType === 'elementaryComponent');
    this.set('_cubbles', cubbles);
  },

  /**
   * Sets the baseUrl of the iron-ajax element for retrieving the cubble components from base.
   *
   * @method settingsChanged
   */
  settingsChanged: function () {
    this.$.ajax.set('url', this._computeBaseUrl(this.settings.baseUrl, this.settings.store));
    this.clearInput();
  },

  /* *********************************************************************************/
  /* ***************************** private methods ***********************************/
  /* *********************************************************************************/

  /**
   * Computes an URL for the selected Base, more precisely the couchDB at the selected base.
   *
   * @param  {[String]} baseUrl [baseUrl of the base]
   * @param  {[String]} store   [Name of the store at the base]
   * @return {[String]}         [String representing the couchDB at the base]
   * @method _computeBaseUrl
   */
  _computeBaseUrl: function (baseUrl, store) {
    return baseUrl.replace(/[/]?$/, '/') + store + '/_design/couchapp-artifactsearch/_list/listArtifacts/viewArtifacts';
  },

  /**
   * [_currentManifestComponents description]
   *
   * @return {[Array]} [Array of current components]
   * @method _currentManifestComponents
   */
  _currentManifestComponents: function () {
    var components = [];
    if (this.manifest) {
      var compounds = this.manifest.artifacts.compoundComponents;
      if (compounds) {
        compounds.forEach(function (item) {
          var newReference = JSON.parse(JSON.stringify(item));
          newReference.webpackageId = 'this';
          newReference.artifactType = 'compoundComponent';
          components.push(newReference);
        });
      }
      var elementaries = this.manifest.artifacts.elementaryComponents;
      if (elementaries) {
        elementaries.forEach(function (item) {
          var newReference = JSON.parse(JSON.stringify(item));
          newReference.webpackageId = 'this';
          newReference.artifactType = 'elementaryComponent';
          components.push(newReference);
        });
      }
    }
    return components;
  },

  /**
   * [_generateDisplayName description]
   *
   * @param  {[String]} artifactId [current cubble's artifactId]
   * @return {[String]}            [modified artifactId]
   * @method _generateDisplayName
   */
  _generateDisplayName: function (artifactId) {
    var members = this.currentComponent.members;
    var filteredMembers = members.filter(function (member) {
      return member && member.displayName && member.displayName.startsWith(artifactId);
    });
    if (filteredMembers.length === 0) {
      return artifactId;
    }
    var max = 0;
    filteredMembers.forEach(function (member) {
      var ext = member.displayName.substr(artifactId.length);
      if (ext.startsWith('-') && !isNaN(ext.substr(1))) {
        max = Math.max(max, ext.substr(1));
      }
    });
    return artifactId + '-' + (++max);
  },

  /**
   * [_sortArtifacts description]
   *
   * @param  {[type]} a [description]
   * @param  {[type]} b [description]
   */
  _sortArtifacts: function (a, b) {
    if (a.artifactId < b.artifactId) {
      return -1;
    }
    if (a.artifactId > b.artifactId) {
      return 1;
    }
    if (a.webpackageId === 'this' && b.webpackageId !== 'this') {
      return -1;
    }
    if (a.webpackageId !== 'this' && b.webpackageId === 'this') {
      return 1;
    }
    if (a.webpackageId !== 'this' && b.webpackageId !== 'this') {
      // fill qualified webpackageName
      var aWebpackageName = a.name;
      var bWebpackageName = b.name;
      if (a.groupId && a.groupId.length > 0) {
        aWebpackageName = a.groupId + '.' + aWebpackageName;
      }
      if (b.groupId && b.groupId.length > 0) {
        bWebpackageName = b.groupId + '.' + bWebpackageName;
      }
      if (aWebpackageName < bWebpackageName) {
        return -1;
      }
      if (aWebpackageName > bWebpackageName) {
        return 1;
      }
    }
    if (!a.version && b.version) {
      return -1;
    }
    if (a.version && !b.version) {
      return 1;
    }
    if (a.version && b.version) {
      // Cut SNAPSHOT
      var aVersion = a.version;

      if (a.version.indexOf('-SNAPSHOT') > -1) {
        aVersion = a.version.substring(0, a.version.indexOf('-SNAPSHOT'));
      }
      var bVersion = b.version;

      if (b.version.indexOf('-SNAPSHOT') > -1) {
        bVersion = b.version.substring(0, b.version.indexOf('-SNAPSHOT'));
      }
      // Without SNAPSHOT descending
      if (aVersion > bVersion) {
        return -1;
      }
      if (aVersion < bVersion) {
        return 1;
      }
      // whit SNAPSHOT Version (ascending)
      if (aVersion === bVersion && a.version < b.version) {
        return -1;
      }
      if (aVersion === bVersion && a.version > b.version) {
        return 1;
      }
    }
    return 0;
  }

});
