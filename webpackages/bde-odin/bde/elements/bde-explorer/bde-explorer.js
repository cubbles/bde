/* global buildWebpackageId */
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

    proposals: {
      type: Object
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
      type: Object
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
     * The settings
     */
    settings: {
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

    _proposalsOpen: {
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
    '_artifactIdChanged(currentComponentMetadata.artifactId)',
    '_proposalsChanged(proposals.*)',
    '_asgardActiveChanged(settings.asgard.active)'
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

  _addMember: function (e) {
    e.stopPropagation();
    let manifest = this.currentComponentMetadata.manifest;
    let hostArtifact = manifest.artifacts.compoundComponents.find(comp => comp.artifactId === this.currentComponentMetadata.artifactId);
    if (!hostArtifact) {
      console.error('Could not add member to manifest, becouse the artifact with artifactId "' + this.currentComponentMetadata.artifactId + '" not found in currentmetadata.manifest');
      return;
    }
    let element = e.currentTarget;
    console.log('####################', element);
    console.log('####################', element.dataset);
    let artifactId = element.dataset.artifactId;
    let webpackageId = element.dataset.webpackageId;
    let dependency = this._findDependencyToArtifactId(artifactId, hostArtifact);
    if (!dependency) {
      this._addDependency(hostArtifact, artifactId, webpackageId);
    }
    let memberId = artifactId + '-' + Math.random().toString(36).substring(7);
    let member = {
      memberId: memberId,
      artifactId: artifactId
    };
    hostArtifact.members.push(member);
    // let key = new Polymer.Collection(this.currentComponentMetadata.manifest.artifacts.compoundComponents).getKey(hostArtifact);
    // if (!key) {
    //   console.error('Could not add member to manifest, becouse the key of artifact with artifactId "' + this.currentComponentMetadata.artifactId + '" + not avaible');
    //   return;
    // }
    // let path = 'currentComponentMetadata.manifest.artifacts.compoundComponents.' + key + '.members';
    // console.log('add member path: ' + path);
    // this.push(path, member);
    this.set('currentComponentMetadata.manifest', manifest);
    this.fire('bde-current-artifact-edited');
  },
  _addDependency: function (hostArtifact, artifactId, webpackageId) {
    // let key = new Polymer.Collection(this.currentComponentMetadata.manifest.artifacts.compoundComponents).getKey(hostArtifact);
    // if (!key) {
    //   console.error('Could not add dependency to manifest, becouse the key of artifact with artifactId "' + this.currentComponentMetadata.artifactId + '" + not avaible');
    //   return;
    // }

    let dependency = {
      artifactId: artifactId
    };
    if (webpackageId === buildWebpackageId(this.currentComponentMetadata.manifest)) {
      dependency.webpackagId = webpackageId;
    }
    // console.log('dependency', dependency);
    // let path = 'currentComponentMetadata.manifest.artifacts.compoundComponents.' + key + '.dependencies';
    // console.log('add dependency path: ' + path);
    // this.push(path, dependency);
    hostArtifact.dependencies.push(dependency);
  },
  _findDependencyToArtifactId: function (artifactId, artifact) {
    return artifact.dependencies.find(dep => dep.artifactId === artifactId);
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

  _asgardActiveChanged: function (active) {
    if (active && this.$.proposalsPanel.classList.contains('hide')) {
      this.$.proposalsPanel.classList.remove('hide');
    }
    if (!active && !this.$.proposalsPanel.classList.contains('hide')) {
      this.$.proposalsPanel.classList.add('hide');
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

  _calculateProposalToggleIcon: function (state) {
    return state ? 'icons:expand-more' : 'icons:expand-less';
  },

  _clusterNumber: function (index) {
    return index + 1;
  },

  _clusterString: function (clusters) {
    return clusters.join(', ');
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
      if (e.target.id === 'compoundList' && !this.$.compoundSelector.selected && this.currentComponentMetadata.artifactId) {
        this.$.compoundSelector.select(this.currentComponentMetadata.artifactId);
        // Fire own event, because iron-select handler not always received after initialisation.
        // self-fired iron-select events also not received
        this.fire('bde_compound_select', this.currentComponentMetadata.artifactId);
      }
    }, 50);
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
      var artifact = this.currentComponentMetadata.manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === this.currentComponentMetadata.artifactId);
      if (artifact) {
        this.$.compoundDetails.set('artifact', artifact);
      }
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
    if (!elem) {
      return;
    }
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
    var artifact = e.detail.value;
    this.push('currentComponentMetadata.manifest.artifacts.compoundComponents', artifact);
    this.notifyPath('currentComponentMetadata.manifest.artifacts.compoundComponents', this.currentComponentMetadata.manifest.artifacts.compoundComponents.slice());
    this.set('settings.newArtifact', true);
    this.$.compoundSelector.select(e.detail.value.artifactId);
  },

  _clusterId: function (index) {
    return 'cluster' + index;
  },
  /**
   * Open the compound details editor dialog.
   * @param {Event} e tap event on gear by side of a compound
   * @method _openCompoundDetails
   * @private
   */
  _openCompoundDetails: function (e) {
    e.stopPropagation();
    let artifact = this.currentComponentMetadata.manifest.artifacts.compoundComponents.find((artifact) => artifact.artifactId === this.currentComponentMetadata.artifactId);
    this.$.compoundDetails.set('artifact', artifact);
    this.$.compoundDetails.set('artifactType', 'compoundComponent');
    // TODO check it
    this.$.compoundDetails.set('artifactIndex', parseInt(e.currentTarget.dataset.index));
    this.$.compoundDetails.open();
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

  _proposalsChanged: function (changeRecord) {
    this.set('_proposalsOpen', true);
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
    this.set('settings.artifactId', artifactId);
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

  _toggleProposals: function () {
    this._proposalsOpen = !this._proposalsOpen;
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
  },

  _showSuggestionWebpackageId: function (webpackageId) {
    let manifest = this.currentComponentMetadata.manifest;
    if (buildWebpackageId(manifest) === webpackageId) {
      return 'hide';
    } else {
      return '';
    }
  },

  _suggestionId: function (clusterId, suggestionId) {
    return 'cluster' + clusterId + 'suggestion' + suggestionId;
  }
});
