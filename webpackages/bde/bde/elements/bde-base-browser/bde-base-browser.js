// @importedBy bde-base-browser.html
/* globals _ */
'use strict';

Polymer({
  is: 'bde-base-browser',

  properties: {

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
     * Object referencing the manifest of the current selected  Cubble.
     *
     * @type {Object}
     * @property manifest
     */
    manifest: {
      type: Object
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
     * @property _loading
     */
    _loading: {
      type: Boolean,
      value: false
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
    },

    /**
     * Array of the components of the current webpackage.
     *
     * @type {Array}
     * @property _ownComponents
     */
    _ownComponents: {
      type: Array,
      value: function () {
        return [];
      }
    },

    /**
     * The search term from the `paper-input` field.
     *
     * @type {String}
     * @property _searchTerm
     */
    _searchString: {
      type: String,
      notify: true
    },

    /**
     * The selected artifact
     *
     * @type {Object}
     * @property _selected
     */
    _selected: {
      type: Object,
      notify: true
    }
  },

  listeners: {
    'bde-select-compound': '_handleItemSelect',
    'bde-member-data-loaded': '_handleLoaded',
    'bde-member-data-loading': '_handleLoading',
    'bde-select-endpoint': '_endpointSelected',
    'iron-overlay-opened': '_handleDialogOpen',
    'iron-overlay-closed': '_handleDialogClose'
  },

  observers: [
    '_settingsChanged(settings.baseUrl,settings.store)'
  ],

  attached: function () {
    this.async(function () {
      this.$.endpointsDialog.refit();
    });
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

  refreshBrowserList: function() {
    // Renew Filter after selected a member for disable other webpacakgeversionen
    this.set('_filtered', []);
    this._filterList(this._searchString);
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
   * @method _computeUrl
   */
  _computeUrl: function (baseUrl, store) {
    return baseUrl.replace(/[/]?$/, '/') + store + '/_design/couchapp-artifactsearch/_list/listArtifacts/viewArtifacts';
  },

  /**
   * Get the component list of the current webpackage.
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
   * The handler method for select an endpoint.
   *
   * @param  {[Event]} event [description]
   * @method _endpointSelected
   */
  _endpointSelected: function (event) {
    var item = event.detail;
    var artifact = JSON.parse(item.artifact);
    var endpointId = item.endpointId;
    this._selectComponentAsMember(artifact, endpointId);
  },

  /**
   * Filter the list of components to see
   *
   * @param  {[String]} searchString [String from input]
   * @method _filterList
   */
  _filterList: function (searchString) {
    // for edge
    searchString = searchString || '';
    var searchTerm = searchString.replace(/[*,?]/g, '');
    var filtered = _.clone(this._cubbles || []);
    filtered = filtered.concat(this._ownComponents);

    // Scroll to top of the list
    this.$.list.scrollTarget.scrollTop = 0;

    if (searchTerm.length === 0) {
      this.set('_filtered', []);
      return;
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
   * Generate a unique display name for the choosen component.
   * (Search in all members displayname with patterns  {artifactId}-{number}, find the largest number,
   * and added as a new displayname {artifactId}-{bigestNumber + 1}, or if no displayname with the pattern exist added {artifactId}-1
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
   * The handler method for dialog open. Set the focus to the search field.
   *
   * @param  {[Event]} event [description]
   * @method handleDialogOpen
   */
  _handleDialogOpen: function (event) {
    this.set('_ownComponents', this._currentManifestComponents());
    this.async(function () {
      document.activeElement.blur();
      this.$.search._focusableElement.focus();
    });
  },

  /**
   * The handler method for dialog close.
   *
   * @param  {[Event]} event [description]
   * @method handleDialogClose
   */
  _handleDialogClose: function (event) {
    this.async(function () {
      this.$.search._focusableElement.blur();
    });
  },
  /**
   * Handles the input of a search term in the input field
   * and returns the filtered array matching the expression in the input.
   * As well as resizing the dialog, based on search result.
   *
   * @method _handleInput
   */
  _handleInput: function (event) {
    this.debounce('handleInput', function () {
      this._filterList(event.target.value);
    }.bind(this), 125);
  },

  /**
   * Item was selected from the list of results.
   *
   * @method _handleItemSelect
   */
  _handleItemSelect: function (event) {
    var artifact = event.detail;
    this.set('_selected', artifact);
    if (artifact.endpoints) {
      if (artifact.endpoints.length > 1) {
        var dialog = this.$.endpointsDialog;
        dialog.open();
      } else {
        this._selectComponentAsMember(artifact, artifact.endpoints[ 0 ].endpointId);
      }
    } else {
      this._selectComponentAsMember(artifact);
    }
  },

  /**
   * Sets _loading property to false.
   * @method _handleLoaded
   */
  _handleLoaded: function () {
    this._loading = false;
  },

  /**
   * Sets _loading property to true.
   *
   * @method _handleLoading
   */
  _handleLoading: function () {
    this._loading = true;
  },

  /**
   * Handles the initial AJAX response and applies a prefiltering of the result list.
   *
   * @method handleResponse
   * @param  {[Event]} event [Response of AJAX call.]
   */
  _handleResponse: function () {
    var cubbles = this.$.ajax.lastResponse.filter((item) => item.modelVersion.match(/8.3/) || item.modelVersion.match(/9.1/))
      .filter((item) => item.artifactType === 'compoundComponent' || item.artifactType === 'elementaryComponent');
    this.set('_cubbles', cubbles);
  },

  /**
   * Create a metadata object for the chosen Cubble component and dispatch it in 'iron-selected' event.
   *
   * @param {[String]} artifact   [description]
   * @param {[String]} endpointId [description]
   * @method _selectComponentAsMember
   */
  _selectComponentAsMember: function (artifact, endpointId) {
    // start of loading animation, must be ended with this.fire('bde-member-loaded');
    this.fire('bde-member-loading');
    /**
     * Setting the cubble metadata.
     * @type {Object}
     */
    var cubble = {
      memberId: artifact.artifactId + '-' + Math.random().toString(36).substring(7),
      displayName: this._generateDisplayName(artifact.artifactId),
      metadata: {
        webpackageId: artifact.webpackageId,
        artifactId: artifact.artifactId
      }
    };

    if (endpointId) {
      cubble.metadata.endpointId = endpointId;
    }

    this.fire('iron-selected', { item: cubble });
  },

  /**
   * Sets the baseUrl of the iron-ajax element for retrieving the cubble components from base.
   *
   * @method settingsChanged
   */
  _settingsChanged: function () {
    this.$.ajax.set('url', this._computeUrl(this.settings.baseUrl, this.settings.store));
    this.clearInput();
  },

  /**
   * Sort the atifactlist by artifactId, webpackagename and groupId and the version.
   * Sort first by artifactId ascending, than by groupId combined with webpackageName ascending too, than versions number descending.
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
