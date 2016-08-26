// @importedBy bde-base-browser.html

'use strict;'

Polymer({
  is: 'bde-base-browser',

  properties: {
    /**
     * The search term from the `paper-input` field.
     *
     * @type {String}
     */
    searchTerm: {
      type: String,
      notify: true
    },

    /**
     * The selected artifact
     *
     * @type {Object}
     */
    selected: {
      type: Object,
      notify: true
    },

    /**
     * Wether to display only app artifacts
     *
     * @type {Boolean}
     */
    appsOnly: {
      type: Boolean,
      value: false
    },

    /**
     * Wether to display only elementary artifacts
     *
     * @type {Boolean}
     */
    elementariesOnly: {
      type: Boolean,
      value: false
    },

    /**
     * Wether to display only compound artifacts
     *
     * @type {Boolean}
     */
    compoundsOnly: {
      type: Boolean,
      value: false
    },

    /**
     * Wether to display only utility artifacts
     *
     * @type {Boolean}
     */
    utilitiesOnly: {
      type: Boolean,
      value: false
    },

    /**
     * Global app settings
     *
     * @type {Object}
     * @private
     */
    settings: {
      type: Object
    },

    loading: {
      type: Boolean,
      value: false
    },

    endpoints: {
      type: Array
    },

    manifest: {
      type: Object
    },

    ownComponents: {
      type: Array,
      value: function () {
        return [];
      }
    },
    currentComponent: {
      type: Object
    },
    /**
     * All cubbles in the base
     *
     * @type {Array}
     * @private
     */
    _cubbles: {
      type: Array
    },

    /**
     * Cubbles filtered by the criteria
     *
     * @type {Array}
     * @private
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

  addMember: function (artifact, endpointId) {
    this.fire('bde-member-loading');
    this.filterList(this.$.search.value);
    var webpackageId;
    if (artifact.webpackageId === 'this') {
      webpackageId = 'this';
    } else {
      webpackageId = artifact.webpackageId;
    }

    var component = {
      name: webpackageId + '/' + artifact.artifactId,
      icon: 'cog',
      description: artifact.description || '',
      inports: [],
      outports: []
    };

    component.inports = artifact.slots
      .filter(function (slot) {
        return slot.direction.indexOf('input') !== -1;
      })
      .map(function (slot) {
        return {
          name: slot.slotId,
          type: slot.type
        };
      });

    component.outports = artifact.slots
      .filter(function (slot) {
        return slot.direction.indexOf('output') !== -1;
      })
      .map(function (slot) {
        return {
          name: slot.slotId,
          type: slot.type
        };
      });

    /**
     * Determine the 'is' property for the members array
     *
     * This should probably be deprecated and the artifactType be used
     * allover the app.
     *
     * @var {String} app|elementary|compound|utility
     */
    var is = (function (artifact) {
      if (artifact.artifactType === 'app') { return 'app'; }
      if (artifact.artifactType === 'elementaryComponent') { return 'elementary'; }
      if (artifact.artifactType === 'compoundComponent') { return 'compound'; }
      if (artifact.artifactType === 'utility') { return 'utility'; }
      throw new Error("Unknown artifactType '" + artifact.artifactType + "'");
    })(artifact);

    var cubble = {
      artifactId: artifact.artifactId,
      componentId: webpackageId + '/' + artifact.artifactId,
      memberId: artifact.artifactId + '-' + Math.random().toString(36).substring(7),
      displayName: this._generateDisplayName(artifact.artifactId),
      is: is,
      description: artifact.description,
      endpoints: artifact.endpoints,
      runnables: artifact.runnables,
      slots: artifact.slots,
      metadata: {
        webpackageId: artifact.webpackageId,
        artifactId: artifact.artifactId,
        endpointId: endpointId
      }
    };

    this.fire('library-update-required', { item: component });
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

  open: function () {
    this.$.memberSelectDialog.open();
  },

  close: function () {
    this.$.memberSelectDialog.close();
  },

  endpointSelected: function (event) {
    var item = event.detail;
    var artifact = JSON.parse(item.artifact);
    var endpointId = item.endpointId;
    this.addMember(artifact, endpointId);
  },

  handleDialogOpen: function (event) {
    this.set('ownComponents', this._currentManifestComponents());
    this.async(function () {
      document.activeElement.blur();
      this.$.search._focusableElement.focus();
    });
  },

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
  filterList: function (searchString) {
    var searchTerm = searchString.replace(/[*,?]/g, '');
    var filtered = JSON.parse(JSON.stringify(this._cubbles || []));
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
   * Item was selected from the list of results
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
  handleLoaded: function () {
    this.loading = false;
  },

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

  settingsChanged: function () {
    this.$.ajax.set('url', this._computeBaseUrl(this.settings.baseUrl, this.settings.store));
    this.clearInput();
  },

  /* *********************************************************************************/
  /* ***************************** private methods ***********************************/
  /* *********************************************************************************/

  _computeBaseUrl: function (baseUrl, store) {
    return baseUrl.replace(/[/]?$/, '/') + store + '/_design/couchapp-artifactsearch/_list/listArtifacts/viewArtifacts';
  },

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
