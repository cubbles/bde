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
      type: Array
    },

    /**
     * Global app settings
     *
     * @type {Object}
     * @private
     */
    _settings: {
      type: Object
    }
  },

  listeners: {
    'bde-select-compound': 'handleItemSelect'
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
   * Handles the input of a search term in the input field
   * and returns the filtered array matching the expression in the input.
   * As well as resizing the dialog, based on search result.
   *
   * @method handleInput
   */
  handleInput: function (event) {
    this.debounce('handleInput', function () {
      var searchTerm = event.target.value.replace(/[*,?]/g, '');
      var filtered = JSON.parse(JSON.stringify(this._cubbles || []));

      // Scroll to top of the list
      this.$.list.scrollTarget.scrollTop = 0;

      if (searchTerm.length === 0) {
        this.set('_filtered', []);
        return;
      }

      if (this.appsOnly) {
        filtered = filtered.filter(i => i.artifactType == 'app');
      }

      if (this.elementariesOnly) {
        filtered = filtered.filter(i => i.artifactType == 'elementaryComponent');
      }

      if (this.compoundsOnly) {
        filtered = filtered.filter(i => i.artifactType == 'compoundComponent');
      }

      if (this.utilitiesOnly) {
        filtered = filtered.filter(i => i.artifactType == 'utility');
      }

      filtered = filtered.filter(i => -1 != i.artifactId.indexOf(searchTerm) || -1 != i.name.indexOf(searchTerm));
      var sorted = filtered.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
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
        if (a.version < b.version) {
          return -1;
        }
        if (a.version > b.version) {
          return 1;
        }
        if (a.artifactId < b.artifactId) {
          return -1;
        }
        if (a.artifactId > b.artifactId) {
          return 1;
        }
        return 0;
      });

      filtered = filtered.sort(sorted);

      this.set('_filtered', filtered);

      this.async(() => this.$.list.fire('iron-resize'));
    }.bind(this), 125);
  },

  /**
   * Item was selected from the list of results
   */
  handleItemSelect: function (event) {
    var artifact = event.detail;
    var parts = artifact.webpackageId.match(/([^.]+)@/);
    var component = {
      name: parts[ 1 ] + '/' + artifact.artifactId,
      icon: 'cog',
      description: artifact.description || '',
      inports: [],
      outports: []
    };

    component.inports = artifact.slots
      .filter(function (slot) { return slot.direction.indexOf('input') !== -1; })
      .map(function (slot) {
        return {
          name: slot.slotId,
          type: slot.type
        }
      });

    component.outports = artifact.slots
      .filter(function (slot) { return slot.direction.indexOf('output') !== -1; })
      .map(function (slot) {
        return {
          name: slot.slotId,
          type: slot.type
        }
      });

    var member = {
      memberId: artifact.artifactId + '_' + Math.random().toString(36).substring(7),
      componentId: parts[ 1 ] + '/' + artifact.artifactId,
      displayName: artifact.artifactId,
      description: artifact.description || '',
      metadata: {
        webpackageId: artifact.webpackageId,
        artifactId: artifact.artifactId
      }
    };

    this.selected = event.detail;
    this.fire('library-update-required', { item: component });
    this.fire('iron-selected', { item: member });
  },

  /**
   * Handles the initial AJAX response and applies a prefiltering of the result list.
   *
   * @method handleResponse
   * @param  {[Event]} event [Response of AJAX call.]
   */
  // TODO (ene): use couchDB functionality for filtering certain document-attributes, like modelVersion...
  handleResponse: function () {
    var cubbles = this.$.ajax.lastResponse
        .filter(item => item.modelVersion.match(/8.3/)
        )
        .
        filter(item => item.artifactType == 'compoundComponent' ||
          item.artifactType == 'elementaryComponent'
        )
      ;

    this.set('_cubbles', cubbles);
  },

  _computeBaseUrl: function (baseUrl, store) {
    return baseUrl.replace(/[/]?$/, '/') + store + '/_design/couchapp-artifactsearch/_list/listArtifacts/viewArtifacts';
  }
});
