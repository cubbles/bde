Polymer({

  is: 'bde-repository-browser',

  properties: {

    /**
     * The object data of the selected item from the Base.
     * @type Object
     */
    addedItem: {
      type: Object,
      notify: true,
      observer: 'handleAddedItem'
    },

    /**
     * The specified URL to the Base.
     *
     * @property url
     * @type String
     */
    url: {
      type: String
    },

    /**
     * Array for the filtered ajax response.
     *
     * @property filtered
     * @type array
     */
    filtered: {
      type: Array,
      value: function () {
        return [];
      }
    },

    /**
     * Array for the ajax response.
     *
     * @property response
     * @type array
     */
    response: Array,

    /**
     * Value of the search field.
     * @property searchTerm
     * @type {Object}
     */
    searchTerm: {
      type: String,
      value: ''
    },

    /**
     * Value to only search for compound components.
     * @property compoundOnly
     * @type {Object}
     */
    compoundOnly: {
      type: Boolean,
      value: false,
      notify: true,
      observer: 'compoundOnlyChanged'
    },

    /**
     * Webpackage metadata for the selected component.
     * @property manifest
     * @type {Object}
     */
    manifest: {
      type: Object,
      notify: true
    },

    settings: {
      type: Object
    }

  },
  observers: [
    'baseUrlChanged(settings.baseUrl)',
    'storeChanged(settings.store)'
  ],
  /**
   * Observer for the compoundOnly property. Sets searchTerm and filtered property.
   * @method compoundOnlyChanged
   */
  compoundOnlyChanged: function () {
    this.searchTerm = '';
    this.filtered = [];
  },

  /**
   * Computes the headers string, based on search method.
   * @method computeLabel
   * @param  {[Boolean]} compoundOnly [Parameter for the selection of the return value.]
   * @return {[String]}
   */
  computeLabel: function (compoundOnly) {
    return compoundOnly
      ? 'Open Compound Component From Base'
      : 'Find Cubble Component';
  },

  /**
   * Toggles the display-attribute of the dialog-overlay of the '#searchDialog'.
   *
   * @method toggleDialog
   */
  toggleDialog: function () {
    this.$.searchDialog.toggle();
  },

  /**
   * Closes the '#searchDialog' after selecting a component from the list.
   *
   * @method handleAddedItem
   */
  handleAddedItem: function () {
    this.$.searchDialog.close();
  },

  /**
   * Handles the input of a search term in the input field and returns the filtered array matching the expression in the input. As well as resizing the dialog, based on search result.
   *
   * @method handleInput
   * @param evt keyup-event
   */
  handleInput: function (evt) {
    this.debounce('handleInput', function () {
      var searchTerm = evt.target.value.replace(/[*,?]/, '');
      var filtered = JSON.parse(JSON.stringify(this.cubbles));

      // Scroll to top of the list
      this.$.scroll.scrollTarget.scrollTop = 0;

      if (searchTerm.length === 0) {
        this.set('filtered', []);
        return;
      }

      if (this.compoundOnly) {
        filtered = filtered.filter((i) => i.artifactType === 'compoundComponent');
      }

      filtered = filtered.filter((i) => i.artifactId.indexOf(searchTerm) !== -1);

      var sorted = filtered.sort(this._sortArtifacts);
      this.set('filtered', sorted);

      this.$.list.fire('iron-resize');
    }.bind(this), 125);
  },
  _sortArtifacts: function (a, b) {
    if (a.artifactId < b.artifactId) {
      return -1;
    }
    if (a.artifactId > b.artifactId) {
      return 1;
    }
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

    return 0;
  },
  /**
   * Handles the initial AJAX response and applies a prefiltering of the result list.
   *
   * @method handleResponse
   * @param  {[Event]} event [Response of AJAX call.]
   */
  // TODO (ene): use couchDB functionality for filtering certain document-attributes, like modelVersion...
  handleResponse: function (event) {
    if (!Array.isArray(this.$.webblebase.lastResponse)) {
      this.set('cubbles', []);
    } else {
      this.set('cubbles', this.$.webblebase.lastResponse
        .filter((i) => i.modelVersion.match(/8.3/) &&
        (i.artifactType === 'compoundComponent' ||
        i.artifactType === 'elementaryComponent')));
    }
  },

  /**
   * Clear the input of the search field on button click.
   *
   * @method clearInput
   */
  clearInput: function () {
    this.$.baseSearch.value = '';
    this.filtered = [];
    this.$.baseSearch.focus();
  },
  baseUrlChanged: function (baseUrl) {
    this.resetSearch();
  },
  storeChanged: function (store) {
    this.resetSearch();
  },
  resetSearch: function () {
    this.set('searchTerm', '');
    this.set('filtered', []);
  }
});