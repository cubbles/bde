Polymer({
  is: 'bde-explorer',

  properties: {

    manifest: {
      type: Object,
      notify: true
    },
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

    selectedApp: {
      type: Object,
      notify: true
    },

    selectedCompound: {
      type: Object,
      notify: true
    },

    selectedElementary: {
      type: Object,
      notify: true
    },

    selectedUtility: {
      type: Object,
      notify: true
    },

    toggleMenus: {
      type: Boolean,
      value: true
    },

    _appsOpen: {
      type: Boolean,
      value: false
    },

    _compoundsOpen: {
      type: Boolean,
      value: true
    },

    _elementariesOpen: {
      type: Boolean,
      value: false
    },

    _utilitiesOpen: {
      type: Boolean,
      value: false
    }

  },

  observers: [
    '_manifestChanged(manifest.*)',
    '_selectedCompoundChanged(selectedCompound.*)',
    '_currentComponentMetadataChanged(currentComponentMetadata.*)'
  ],

  listeners: {
    'bde_compound_select': '_handleBdeCompoundSelect',
    'compoundSelector.iron-items-changed': '_handleCompoundItemsChanged'
  },

  addCompound: function () {
    this.$.compoundCreator.open();
  },

  compoundListDomChange: function (e) {
    // First time recive just one dom-ready event with the target compound List, later comming 2 events, use just the second event
    if (!this.$.compoundSelector.selected) {
      this.$.compoundSelector.select(this.selectedCompound.artifactId);
      // Fire own event, because iron-select handler not always received after initialisation.
      // self-fired iron-select events also not received
      this.fire('bde_compound_select', this.selectedCompound.artifactId);
    }
  },

  endpointTemplateDomChange: function (e) {
    // First time recive just one dom-ready event with the target compound List, later comming 2 events, use just the second event
    if (this.selectedCompound) {
      this.$.compoundSelector.select(this.selectedCompound.artifactId);
      // Fire own event, because iron-select handler not always received after initialisation.
      // self-fired iron-select events also not received
      this.fire('bde_compound_select', this.selectedCompound.artifactId);
    }
  },

  explorerItemSelected: function (e) {
    var item = e.detail.item;

    if (item.dataset.artifactId && item.dataset.artifactId !== this.currentComponentMetadata.artifactId) {
      this._deselectCompound();
      this._selectCompound(item.dataset.artifactId, item.dataset.endpointId);
    } else if (item.dataset.endpointId && item.dataset.endpointId !== this._createEndpointMenuItemId(this.currentComponentMetadata.artifactId, this.currentComponentMetadata.endpointId)) {
      this._selectEndpoint(item.dataset.endpointId);
    }
  },
  handleNewCompound: function (e) {
    this.push('manifest.artifacts.compoundComponents', e.detail.value);
    this.notifyPath('manifest.artifacts.compoundComponents', this.manifest.artifacts.compoundComponents.slice());
  },

  openCompoundDetails: function (e) {
    e.stopPropagation();
    this.$.explorerDetails.set('artifactType', 'compoundComponent');
    // this.$.explorerDetails.set('artifact', this.selectedCompound);
    this.$.explorerDetails.set('artifactIndex', parseInt(e.currentTarget.dataset.index));
    this.$.explorerDetails.open();
  },

  openSettings: function (e) {
    e.stopPropagation();
    var item = e.model.dataHost.itemForElement(e.target);
    item.is = e.model.dataHost.id.replace(/List/, '');

    this.fire('bde-explorer-open-settings', { item: item });
  },

  openWebpackageMetaInfo: function (e) {
    this.$.webpackageMetaInfo.open();
  },

  toggleApps: function () {
    if (this.toggleMenus) {
      this._compoundsOpen = false;
      this._elementariesOpen = false;
      this._utilitiesOpen = false;
    }
    this._appsOpen = !this._appsOpen;
  },

  toggleCompounds: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._elementariesOpen = false;
      this._utilitiesOpen = false;
    }
    this._compoundsOpen = !this._compoundsOpen;
  },

  toggleElementaries: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._compoundsOpen = false;
      this._utilitiesOpen = false;
    }
    this._elementariesOpen = !this._elementariesOpen;
  },

  toggleUtilities: function () {
    if (this.toggleMenus) {
      this._appsOpen = false;
      this._compoundsOpen = false;
      this._elementariesOpen = false;
    }
    this._utilitiesOpen = !this._utilitiesOpen;
  },

  _calculateToggleIcon: function (state) {
    return state ? 'icons:expand-less' : 'icons:expand-more';
  },

  _createEndpointMenuItemId: function (artifactId, endpointId) {
    return artifactId + '_' + endpointId;
  },

  _createIdForEndpointsMenu: function (artifactId) {
    return 'endpoints_' + artifactId;
  },

  _createIdForEndpointsMenuTemplate: function (artifactId) {
    return 'endpoints_template_' + artifactId;
  },

  _currentComponentMetadataChanged: function (changeRecord) {
    // Notify selectedCompound changes
    var regexpr = /(.*compoundComponents\.#\d+\.)(.*)/ig;
    var matches = regexpr.exec(changeRecord.path);
    if (matches) {
      var path = matches[ 2 ];
      if (path) {
        this.set('selectedCompound.' + path, changeRecord.value);
      }
    }
  },

  _deselectCompound: function () {
    var menu = this.$$('#compoundSelector');
    // menu.selected = null;
    Polymer.dom(menu).querySelectorAll('paper-submenu').forEach(function (subMenu) {
      subMenu.close();
      Polymer.dom(subMenu).querySelector('paper-menu').selected = null;
    });
  },

  _equals: function (a, b) {
    return a === b;
  },

  _groupIdDefined: function (groupId) {
    if (groupId) {
      return true;
    }
    return false;
  },

  /**
   * event listener for own bde-compound-select evevt (fired after initialisation)
   * This event fired additional to iron-select, becouse iron-select can not always received by initialisation
   * @param e
   */
  _handleBdeCompoundSelect: function (e) {
    var artifactId = e.detail;

    var elem = this.$.compoundSelector.querySelector('[data-artifact-id = ' + artifactId + ']');
    if (elem) {
      elem.is = 'compound';
    }
    if (artifactId && artifactId !== this.currentComponentMetadata.artifactId) {
      this._deselectCompound();
      this._selectCompound(artifactId);
    }
  },

  _handleCompoundItemsChanged: function (event) {
    // find added paper-submenu and ignore added text nodes
    var addedItem = event.detail.addedNodes.find((item) => item.tagName && item.tagName.toLowerCase() === 'paper-submenu');
    if (addedItem && addedItem !== this.$.compoundSelector.selectedItem) {
      this.$.compoundSelector.select(addedItem.dataset.artifactId);
    }
  },

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

  _selectApp: function (e) {
    var item = this.$.appList.itemForElement(e.target);
    item.is = 'app';
    this.$.appSelector.select(item);

    this.fire('iron-select', { is: 'app', item: item });
  },

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

  _selectedCompoundChanged: function (changeRecord) {
    if (!changeRecord || !this.currentComponentMetadata.manifest) {
      return;
    }

    var path = changeRecord.path;
    var artifactPath = new Polymer.Collection(this.currentComponentMetadata.manifest.artifacts.compoundComponents).getKey(this.selectedCompound);
    if (artifactPath) {
      path.replace('selectedCompound', 'currentComponentMetadata.manifest.artifacts.compoundComponents.' + artifactPath);
      this.set(path, changeRecord.value);
    }
  },

  _selectElementary: function (e) {
    var item = this.$.elementaryList.itemForElement(e.target);
    item.is = 'elementary';
    this.$.elementarySelector.select(item);

    this.fire('iron-select', { is: 'elementary', item: item });
  },

  _selectEndpoint: function (endpointId) {
    this.set('currentComponentMetadata.endpointId', endpointId.split('_')[ 1 ]);
  },

  _selectUtility: function (e) {
    var item = this.$.utilityList.itemForElement(e.target);
    item.is = 'utility';
    this.$.elementarySelector.select(item);

    this.fire('iron-select', { is: 'utility', item: item });
  }

});
