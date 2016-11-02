// @importedBy bde-explorer.html

Polymer({
  is: 'bde-explorer',

  properties: {

    /**
     * The manifest element
     * @type Object
     * @property manifest
     */
    manifest: {
      type: Object
    },

    /**
     * Metadata of the current element, which is beeing created via the BDE.
     * It has the properties "manifest", "artifactId" and "endpointId".
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
          endpointId: null,
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
    '_manifestChanged(manifest.*)',
    '_selectedCompoundChanged(selectedCompound.*)',
    '_currentComponentMetadataChanged(currentComponentMetadata.*)',
    '_artifactIdChanged(currentComponentMetadata.artifactId)'
  ],

  listeners: {
    'bde_compound_select': '_handleBdeCompoundSelect',
    'compoundSelector.iron-items-changed': '_handleCompoundItemsChanged'
  },

  /* ***************************************************************************/
  /* *************************** public methods ********************************/
  /* ***************************************************************************/
  /**
   * Open the dialog for add a new compound
   */
  addCompound: function () {
    this.$.compoundCreator.open();
  },

  /**
   * Handler after the list of compounds is changed, and the dom-repeat template of the compound list is updated.
   * @param {Event} e Event
   */
  compoundListDomChange: function (e) {
    // First time recive just one dom-ready event with the target compound List, later comming 2 events, use just the second event
    if (!this.$.compoundSelector.selected) {
      this.$.compoundSelector.select(this.selectedCompound.artifactId);
      // Fire own event, because iron-select handler not always received after initialisation.
      // self-fired iron-select events also not received
      this.fire('bde_compound_select', this.selectedCompound.artifactId);
    }
  },

  /**
   * Handler after the list of endpoints is changed, and the dom-repeat template of the compound list is updated.
   * @param {Event} e Event
   */
  endpointTemplateDomChange: function (e) {
    // First time recive just one dom-ready event with the target compound List, later comming 2 events, use just the second event
    if (this.selectedCompound) {
      this.$.compoundSelector.select(this.selectedCompound.artifactId);
      // Fire own event, because iron-select handler not always received after initialisation.
      // self-fired iron-select events also not received
      this.fire('bde_compound_select', this.selectedCompound.artifactId);
    }
  },

  /**
   * Handler method for select an artifact or an endpoint.
   * @param Event} e Event
   */
  explorerItemSelected: function (e) {
    var item = e.detail.item;

    if (item.dataset.artifactId && item.dataset.artifactId !== this.currentComponentMetadata.artifactId) {
      this._deselectCompound();
      this._selectCompound(item.dataset.artifactId, item.dataset.endpointId);
    } else if (item.dataset.endpointId && item.dataset.endpointId !== this._createEndpointMenuItemId(this.currentComponentMetadata.artifactId, this.currentComponentMetadata.endpointId)) {
      this._selectEndpoint(item.dataset.endpointId);
    }
  },

  /**
   * Handler method after added a new compound to the manifest.
   * @param {Event} e Event
   */
  handleNewCompound: function (e) {
    this.push('manifest.artifacts.compoundComponents', e.detail.value);
    this.notifyPath('manifest.artifacts.compoundComponents', this.manifest.artifacts.compoundComponents.slice());
  },

  /**
   * Open the compound details editor dialog.
   * @param {Event} e Event
   */
  openCompoundDetails: function (e) {
    e.stopPropagation();
    this.$.explorerDetails.set('artifactType', 'compoundComponent');
    this.$.explorerDetails.set('artifactIndex', parseInt(e.currentTarget.dataset.index));
    this.$.explorerDetails.open();
  },

  /**
   * Open the webpackage metainfo dialog.
   * @param {Event} e Event
   */
  openWebpackageMetaInfo: function (e) {
    this.$.webpackageMetaInfo.open();
  },

  /**
   * Toggle the "Application" menu
   */
  toggleApps: function () {
    if (this.toggleMenus) {
      this._compoundsOpen = false;
      this._elementariesOpen = false;
      this._utilitiesOpen = false;
    }
    this._appsOpen = !this._appsOpen;
  },

    /**
    * Toggle the "Compounds" menu
    */
  toggleCompounds: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._elementariesOpen = false;
      this._utilitiesOpen = false;
    }
    this._compoundsOpen = !this._compoundsOpen;
  },

    /**
    * Toggle the "Elementaries" menu
    */
  toggleElementaries: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._compoundsOpen = false;
      this._utilitiesOpen = false;
    }
    this._elementariesOpen = !this._elementariesOpen;
  },

    /**
    * Toggle the "Utilities" menu
    */
  toggleUtilities: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._compoundsOpen = false;
      this._elementariesOpen = false;
    }
    this._utilitiesOpen = !this._utilitiesOpen;
  },

  /* ***************************************************************************/
  /* *************************** private methods *******************************/
  /* ***************************************************************************/
  /**
   * Handler method: called if the artifactId in currentComponentMetadata changed.
   * @param artifactId
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
   * @private
   */
  _calculateToggleIcon: function (state) {
    return state ? 'icons:expand-less' : 'icons:expand-more';
  },

  /**
   * Create a unique string, which represents the endpoint in relation to the artifact.
   * @param {String} artifactId artifact id
   * @param {String} endpointId endpoint id
   * @returns {string} a combination of artifact id and endpoint id separeted by "_"
   * @private
   */
  _createEndpointMenuItemId: function (artifactId, endpointId) {
    return artifactId + '_' + endpointId;
  },

  /**
   * Create a unique id for the endpointmenu
   * @param {String} artifactId artifact id
   * @returns {string} a unique id for endpoints menu for the artifact.
   * @private
   */
  _createIdForEndpointsMenu: function (artifactId) {
    return 'endpoints_' + artifactId;
  },

  /**
   * Create a unique id for the dom-repeat template in endpointmenu
   * @param {String} artifactId artifact id
   * @returns {string} a unique id for endpoints dom-repeate template for the artifact.
   * @private
   */
  _createIdForEndpointsMenuTemplate: function (artifactId) {
    return 'endpoints_template_' + artifactId;
  },

  /**
   * Handle mathod for changes of currentComponentMetadta
   * @param {Object} changeRecord the polymer change record
   * @private
   */
  _currentComponentMetadataChanged: function (changeRecord) {
    var regexpr = /(.*compoundComponents\.#\d+\.)(.*)/ig;
    var matches = regexpr.exec(changeRecord.path);
    if (matches) {
      // Notify selectedCompound changes to the manifest
      this.notifyPath(changeRecord.path.substr(changeRecord.path.indexOf('.') + 1), changeRecord.value);
      var path = matches[ 2 ];
      if (path) {
        // set the selected Compound
        this.set('selectedCompound.' + path, changeRecord.value);
      }
    }
  },

  /**
   * Deselect all comounds.
   * @private
   */
  _deselectCompound: function () {
    var menu = this.$$('#compoundSelector');
    // menu.selected = null;
    Polymer.dom(menu).querySelectorAll('paper-submenu').forEach(function (subMenu) {
      subMenu.close();
      Polymer.dom(subMenu).querySelector('paper-menu').selected = null;
    });
  },

  /**
   * Check, if a and b equals. Helper method for usage in polymer elements.
   * @param {*} a
   * @param {*} b
   * @returns {boolean} a and b equals
   * @private
   */
  _equals: function (a, b) {
    return a === b;
  },

  /**
   * Check if the groupId is defined.
   * Helper method for usage in polymer elements.
   * @param {*} groupId
   * @returns {boolean} true if groupId exists and not null.
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
   * @param {Event} e Event
   */
  _handleBdeCompoundSelect: function (e) {
    var artifactId = e.detail;

    var elem = this.$.compoundSelector.querySelector('[data-artifact-id = ' + artifactId + ']');
    if (elem) {
      elem.is = 'compound';
    }
    if (artifactId && (artifactId !== this.currentComponentMetadata.artifactId || artifactId !== this.$.compoundSelector.selected )) {
      this._deselectCompound();
      this._selectCompound(artifactId);
    }
  },

  /**
   * Handler method after iron-item-changed in the compound menu.
   * @param {Event} event Event
   * @private
   */
  _handleCompoundItemsChanged: function (event) {
    // find added paper-submenu and ignore added text nodes
    var addedItem = event.detail.addedNodes.find((item) => item.tagName && item.tagName.toLowerCase() === 'paper-submenu');
    if (addedItem && addedItem !== this.$.compoundSelector.selectedItem) {
      this.$.compoundSelector.select(addedItem.dataset.artifactId);
    }
  },

  /**
   * Handler method after manifest property changed
   * @param changeRecord
   * @private
   */
  _manifestChanged: function (changeRecord) {
    var path = changeRecord.path.replace('manifest', 'currentComponentMetadata.manifest');
    this.set(path, changeRecord.value);
    if (this.selectedCompound) {
      var compoundInManifest = this.manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === this.selectedCompound.artifactId);
      if (compoundInManifest) {
        this.set('selectedCompound', compoundInManifest);
      }
    }
    if (this.manifest) {
      var menu = this.$$('#compoundSelector');
      Polymer.dom(menu).querySelectorAll('paper-submenu').forEach(function (subMenu) {
        subMenu.close();
      });
    }
  },

  /**
   * Select an app in "Applications" menu
   * @param {Event} e Event
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
   * @private
   */
  _selectCompound: function (artifactId) {
    this.set('currentComponentMetadata.artifactId', artifactId);
    var subMenu = this.$$('[data-artifact-id=' + artifactId + ']');
    subMenu.open();
    if (Polymer.dom(subMenu).querySelector('[data-endpoint-id]')) {
      Polymer.dom(subMenu).querySelector('paper-menu').select(Polymer.dom(subMenu).querySelector('[data-endpoint-id]').dataset.endpointId);
    } else {
      Polymer.dom(subMenu).querySelector('paper-menu').addEventListener('dom-change', function (e) {
        e.target.closest('paper-menu').select(Polymer.dom(subMenu).querySelector('[data-endpoint-id]').dataset.endpointId);
      });
    }
    var compound = this.manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === artifactId);
    this.set('selectedCompound', compound);
  },

  /**
   * Handler method if the selected compound changed.
   * @param {Object} changeRecord Polymer change record
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
   * @param {Event} e Event
   * @private
   */
  _selectElementary: function (e) {
    var item = this.$.elementaryList.itemForElement(e.target);
    item.is = 'elementary';
    this.$.elementarySelector.select(item);

    this.fire('iron-select', { is: 'elementary', item: item });
  },

  /**
   * This EMthod set the selected Endpoint in currentComponentMetadata
   * @param {String} endpointId endpoint id
   * @private
   */
  _selectEndpoint: function (endpointId) {
    this.set('currentComponentMetadata.endpointId', endpointId.split('_')[ 1 ]);
  },

  /**
   * Select an app in "Utilities" menu
   * @param {Event} e Event
   * @private
   */
  _selectUtility: function (e) {
    var item = this.$.utilityList.itemForElement(e.target);
    item.is = 'utility';
    this.$.elementarySelector.select(item);

    this.fire('iron-select', { is: 'utility', item: item });
  }

});
