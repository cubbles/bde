// @importedBy bde-repository-browser.html
/* globals _ */
'use strict';

Polymer({

  is: 'bde-repository-browser',

  properties: {

    /**
     * The object data of the selected item from the Base.
     *
     * @type Object
     * @property selectedItem
     */
    selectedItem: {
      type: Object,
      notify: true,
      observer: '_handleSelectedItem'
    },

    /**
     * The specified URL to the Base.
     *
     * @type String
     * @property url
     */
    url: {
      type: String
    },

    /**
     * Array for the filtered ajax response.
     *
     * @type Array
     * @property filtered
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
     * @type Array
     * @property response
     */
    response: Array,

    /**
     * Value of the search field.
     *
     * @type {Object}
     * @property searchTerm
     */
    searchTerm: {
      type: String,
      value: ''
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
      notify: true
    },

    /**
     *  Binding for the settings object of the application.
     *
     * @type {Object}
     * @property settings
     */
    settings: {
      type: Object
    }

  },

  observers: [
    '_baseUrlChanged(settings.baseUrl)',
    '_storeChanged(settings.store)'
  ],

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
   * @method _handleSelectedItem
   */
  _handleSelectedItem: function () {
    this.set('currentComponentMetadata.artifactId', this.selectedItem.artifactId);
    this.$.searchDialog.close();
  },

  /**
   * Handles the input of a search term in the input field and returns the filtered array matching the expression in the input. As well as resizing the dialog, based on search result.
   *
   * @param evt keyup-event
   * @method _handleInput
   */
  _handleInput: function (evt) {
    this.debounce('handleInput', function () {
      // for edge
      var searchString = evt.target.value || '';

      var searchTerm = searchString.replace(/[*,?]/, '');
      var filtered = _.clone(this.cubbles || []);

      // Scroll to top of the list
      this.$.scroll.scrollTarget.scrollTop = 0;

      if (searchTerm.length === 0) {
        this.set('filtered', []);
        return;
      }

      filtered = filtered.filter((i) => i.artifactId.indexOf(searchTerm) !== -1);

      var sorted = filtered.sort(this._sortArtifacts);
      this.set('filtered', sorted);

      this.$.list.fire('iron-resize');
    }.bind(this), 125);
  },

  /**
   * Helper function for sorting the artifacts.
   *
   * @method _sortArtifacts
   */
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
    // cut SNAPSHOT
    var aVersion = a.version;

    if (a.version.indexOf('-SNAPSHOT') > -1) {
      aVersion = a.version.substring(0, a.version.indexOf('-SNAPSHOT'));
    }
    var bVersion = b.version;

    if (b.version.indexOf('-SNAPSHOT') > -1) {
      bVersion = b.version.substring(0, b.version.indexOf('-SNAPSHOT'));
    }
    // without SNAPSHOT version (descending)
    if (aVersion > bVersion) {
      return -1;
    }
    if (aVersion < bVersion) {
      return 1;
    }
    // with SNAPSHOT version (ascending)
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
   * @param  {[Event]} event [Response of AJAX call.]
   * @method _handleResponse
   */
  // TODO (erne-mt): use couchDB functionality for filtering certain document-attributes, like modelVersion...
  _handleResponse: function (event) {
    if (!Array.isArray(this.$.cubblesbase.lastResponse)) {
      this.set('cubbles', []);
    } else {
      this.set('cubbles', this.$.cubblesbase.lastResponse
        .filter((i) => i.modelVersion.match(/9.1/) &&
        (i.artifactType === 'compoundComponent')));
    }
  },

  /**
   * Clear the input of the search field on button click.
   *
   * @method clearInput
   */
  _clearInput: function () {
    this.$.baseSearch.value = '';
    this.filtered = [];
    this.$.baseSearch.focus();
  },

  /**
   * Observer for changes in the baseUrl.
   *
   * @param  {[String]} baseUrl [the given baseUrl]
   * @method _baseUrlChanged
   */
  _baseUrlChanged: function (baseUrl) {
    this._resetSearch();
  },

  /**
   * Observer for changes in teh storeName.
   *
   * @param  {[String]} store [the given storeName]
   * @method _storeChanged
   */
  _storeChanged: function (store) {
    this._resetSearch();
  },

  /**
   * Function for reseting the search with new base parameters after change.
   *
   * @method resetSearch
   */
  _resetSearch: function () {
    this.set('searchTerm', '');
    this.set('filtered', []);
  }
});
