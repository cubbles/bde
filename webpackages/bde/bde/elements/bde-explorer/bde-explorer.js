// @importedBy bde-explorer.html

Polymer({
  is: 'bde-explorer',

  properties: {

    /**
     * Will be setted true, if the artifactId from edit dialog edited.
     * If this property is true, no reset and autolayout for datafloview.
     */
    isArtifactIdEdited: {
      type: Boolean,
      value: false
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
      notify: true,
      value: function () {
        return {
          artifactId: null,
          manifest: null
        };
      }
    },

    /**
     * Selected application artifact
     * @type Object
     */
    selectedApp: {
      type: Object,
      notify: true
    },

    /**
     * Selected compound component.
     * @type Object
     * @property selectedCompound
     */
    selectedCompound: {
      type: Object,
      notify: true
    },

    /**
     * Selected elementary component.
     * @type Object
     */
    selectedElementary: {
      type: Object,
      notify: true
    },

    /**
     * Selected utility artifact
     * @type Object
     */
    selectedUtility: {
      type: Object,
      notify: true
    },

    /**
     * Indicate if the menus "Appplications", "Compounds", "Elementaries" and "Utilities" toggles.
     * @type Boolean
     * @property toggleMenus
     */
    toggleMenus: {
      type: Boolean,
      value: true
    },

    /**
     * Save the state of the menu "Applications". (It's opened or not openend.)
     * @type Boolean
     * @properties _appsOpen
     * @private
     */
    _appsOpen: {
      type: Boolean,
      value: false
    },

    /**
     * Save the state of the menu "Compounds". (It's opened or not openend.)
     * @type Boolean
     * @properties _compoundsOpen
     * @private
     */
    _compoundsOpen: {
      type: Boolean,
      value: true
    },

    /**
     * Save the state of the menu "Elementaries". (It's opened or not openend.)
     * @type Boolean
     * @properties _elementariesOpen
     * @private
     */
    _elementariesOpen: {
      type: Boolean,
      value: false
    },
    /**
     * Save the state of the menu "Utilities". (It's opened or not openend.)
     * @type Boolean
     * @properties _utilitiesOpen
     * @private
     */
    _utilitiesOpen: {
      type: Boolean,
      value: false
    }

  },

  observers: [
    '_selectedCompoundChanged(selectedCompound.*)',
    '_currentComponentMetadataChanged(currentComponentMetadata.*)',
    '_artifactIdChanged(currentComponentMetadata.artifactId)'
  ],

  listeners: {
    'bde_compound_select': '_handleBdeCompoundSelect',
    'bde-manifest-loading': '_handleManifestLoaded'
  },

  /* ***************************************************************************/
  /* *************************** public methods ********************************/
  /* ***************************************************************************/

  /**
   * Reset the selection in the bde explorer
   * @method resetSelection
   */
  resetSelection: function () {
    this._deselectCompound();
  },

  /* ***************************************************************************/
  /* *************************** private methods *******************************/
  /* ***************************************************************************/

  /**
   * Open the dialog for add a new compound
   * @method _addCompound
   * @private
   */
  _addCompound: function () {
    this.$.compoundCreator.open();
  },

  /**
   * Handler method: called if the artifactId in currentComponentMetadata changed.
   * @param artifactId
   * @method _artifactIdChanged
   * @private
   */
  _artifactIdChanged: function (artifactId) {
    if (artifactId) {
      this.fire('bde_compound_select', artifactId);
    }
  },

  /**
   * Calculate the toggle icon, depend on state.
   * @param {Boolean} state represents, if the dialog openened or not.
   * @returns {string} calculated icon
   * @method _calculateToggleIcon
   * @private
   */
  _calculateToggleIcon: function (state) {
    return state ? 'icons:expand-less' : 'icons:expand-more';
  },

  /**
   * Handler after the list of compounds is changed, and the dom-repeat template of the compound list is updated.
   * @param {Event} e dom-change event on compoundList
   * @method _compoundListDomChange
   * @private
   */
  _compoundListDomChange: function (e) {
    // First time recive just one dom-ready event with the target compound List, later comming 2 events, use just the second event
    this.debounce('compoundList_changed', function () {
      if (e.target.id === 'compoundList' && !this.$.compoundSelector.selected) {
        this.$.compoundSelector.select(this.selectedCompound.artifactId);
        // Fire own event, because iron-select handler not always received after initialisation.
        // self-fired iron-select events also not received
        this.fire('bde_compound_select', this.selectedCompound.artifactId);
      }
    }, 50);
  },

  /**
   * Tha handle method for changes of currentComponentMetadata
   * @param {Object} changeRecord the polymer change record
   * @method _currentComponentMetadataChanged
   * @private
   */
  _currentComponentMetadataChanged: function (changeRecord) {
    if (this.selectedCompound) {
      var compoundInManifest = this.currentComponentMetadata.manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === this.selectedCompound.artifactId);
      if (compoundInManifest) {
        this.set('selectedCompound', compoundInManifest);
      }
    }
  },

  /**
   * Deselect all comounds.
   * @method _deselectCompound
   * @private
   */
  _deselectCompound: function () {
    var menu = this.$$('#compoundSelector');
    menu.selected = null;
  },
  /**
   * Check, if a and b equals. Helper method for usage in polymer elements.
   * @param {*} a
   * @param {*} b
   * @returns {boolean} a and b equals
   * @method _equals
   * @private
   */
  _equals: function (a, b) {
    return a === b;
  },

  /**
   * Handler method for select an compound.
   * @param Event} e iron-select event (on compound artifact)
   * @method _explorerCompoundSelected
   * @private
   */
  _explorerCompoundSelected: function (e) {
    var item = e.detail.item;

    if (item.id && item.id !== this.currentComponentMetadata.artifactId) {
      this._selectCompound(item.id);
      // If isArtifactIdEdited is true, no reset and autolayout for dataflowview.
      if (this.isArtifactIdEdited) {
        this.set('isArtifactIdEdited', false);
      } else {
        this.fire('bde-current-artifact-change');
      }
    }
  },

  /**
   * Check if the groupId is defined.
   * Helper method for usage in polymer elements.
   * @param {*} groupId
   * @returns {boolean} true if groupId exists and not null.
   * @method _groupIdDefined
   * @private
   */
  _groupIdDefined: function (groupId) {
    if (groupId) {
      return true;
    }
    return false;
  },

  /**
   * event listener for own bde-compound-select evevt (fired after initialisation)
   * This event fired additional to iron-select, becouse iron-select can not always received by initialisation
   * @param {Event} e bde_compound_select event
   * @method _handleBdeCompoundSelect
   * @private
   */
  _handleBdeCompoundSelect: function (e) {
    var artifactId = e.detail;

    var elem = this.$.compoundSelector.querySelector('#' + artifactId);
    if (elem) {
      elem.is = 'compound';
    }
    if (artifactId && (artifactId !== this.currentComponentMetadata.artifactId || artifactId !== this.$.compoundSelector.selected)) {
      this._deselectCompound();
      this._selectCompound(artifactId);
      if (this.isArtifactIdEdited) {
        this.set('isArtifactIdEdited', false);
      } else {
        this.fire('bde-current-artifact-change');
      }
    }
  },

  /**
   * Handler method after added a new compound to the manifest.
   * @param {Event} e change event on last-artifact-changed property
   * @method _handleNewCompound
   * @private
   */
  _handleNewCompound: function (e) {
    this.push('currentComponentMetadata.manifest.artifacts.compoundComponents', e.detail.value);
    this.notifyPath('currentComponentMetadata.manifest.artifacts.compoundComponents', this.currentComponentMetadata.manifest.artifacts.compoundComponents.slice());
    this.$.compoundSelector.select(e.detail.value.artifactId);
  },

  /**
   * Open the compound details editor dialog.
   * @param {Event} e tap event on gear by side of a compound
   * @method _openCompoundDetails
   * @private
   */
  _openCompoundDetails: function (e) {
    e.stopPropagation();
    this.$.explorerDetails.set('artifactType', 'compoundComponent');
    // TODO check it
    this.$.explorerDetails.set('artifactIndex', parseInt(e.currentTarget.dataset.index));
    this.$.explorerDetails.open();
  },

  /**
   * Open the webpackage metainfo dialog.
   * @method _openWebpackageMetaInfo
   * @param {Event} e tap event on gear of webpacakge
   * @method _openWebpackageMetaInfo
   * @private
   */
  _openWebpackageMetaInfo: function (e) {
    this.$.webpackageMetaInfo.open();
  },

  /**
   * Select an app in "Applications" menu
   * @param {Event} e tap event on "Applications"
   * @method _selectApp
   * @private
   */
  _selectApp: function (e) {
    var item = this.$.appList.itemForElement(e.target);
    item.is = 'app';
    this.$.appSelector.select(item);

    this.fire('iron-select', { is: 'app', item: item });
  },

  /**
   * Select a compound in "Compounds" menu
   * @param {String} artifactId the artifactId
   * @method _selectCompound
   * @private
   */
  _selectCompound: function (artifactId) {
    this.set('currentComponentMetadata.artifactId', artifactId);
    if (this.currentComponentMetadata.manifest) {
      var compound = this.currentComponentMetadata.manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === artifactId);
      this.set('selectedCompound', compound);
    }
  },

  /**
   * Handler method if the selected compound changed.
   * @param {Object} changeRecord Polymer change record
   * @method _selectedCompoundChanged
   * @private
   */
  _selectedCompoundChanged: function (changeRecord) {
    if (!changeRecord || !this.currentComponentMetadata.manifest) {
      return;
    }

    var path = changeRecord.path;
    var artifactPath = new Polymer.Collection(this.currentComponentMetadata.manifest.artifacts.compoundComponents).getKey(this.selectedCompound);
    if (artifactPath) {
      // Set in  currentComponentMetadata and notify changes
      path = path.replace('selectedCompound', 'currentComponentMetadata.manifest.artifacts.compoundComponents.' + artifactPath);
      this.set(path, changeRecord.value);
    }
  },

  /**
   * Select an app in "Elementaries" menu
   * @param {Event} e tap event on "Elementaries"
   * @method _selectElementary
   * @private
   */
  _selectElementary: function (e) {
    var item = this.$.elementaryList.itemForElement(e.target);
    item.is = 'elementary';
    this.$.elementarySelector.select(item);

    this.fire('iron-select', { is: 'elementary', item: item });
  },

  /**
   * Select an app in "Utilities" menu
   * @param {Event} e tap event on "Utilities"
   * @method _selectUtility
   * @private
   */
  _selectUtility: function (e) {
    var item = this.$.utilityList.itemForElement(e.target);
    item.is = 'utility';
    this.$.elementarySelector.select(item);

    this.fire('iron-select', { is: 'utility', item: item });
  },

  /**
   * Toggle the "Application" menu
   * @method _toggleApps
   * @private
   */
  _toggleApps: function () {
    if (this.toggleMenus) {
      this._compoundsOpen = false;
      this._elementariesOpen = false;
      this._utilitiesOpen = false;
    }
    this._appsOpen = !this._appsOpen;
  },

  /**
   * Toggle the "Compounds" menu
   * @method _toggleCompounds
   * @private
   */
  _toggleCompounds: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._elementariesOpen = false;
      this._utilitiesOpen = false;
    }
    this._compoundsOpen = !this._compoundsOpen;
  },

  /**
   * Toggle the "Elementaries" menu
   * @method _toggleElementaries
   * @private
   */
  _toggleElementaries: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._compoundsOpen = false;
      this._utilitiesOpen = false;
    }
    this._elementariesOpen = !this._elementariesOpen;
  },

  /**
   * Toggle the "Utilities" menu
   * @method _toggleUtilities
   * @private
   */
  _toggleUtilities: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._compoundsOpen = false;
      this._elementariesOpen = false;
    }
    this._utilitiesOpen = !this._utilitiesOpen;
  }

});
