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
    'manifestChanged(manifest.*)',
    'selectedCompoundChanged(selectedCompound.*)',
    'currentComponentMetadataChanged(currentComponentMetadata.*)'
  ],

  listeners: {
    'bde_compound_select': 'handleBdeCompoundSelect',
    'compoundSelector.iron-items-changed': '_handleCompoundItemsChanged'
  },

  currentComponentMetadataChanged: function (changeRecord) {
    // Notify selectedCompound changes
    var regexpr = /(.*compoundComponents\.#\d+\.)(.*)/ig;
    var matches = regexpr.exec(changeRecord.path);
    if (matches) {
      var path = matches[2];
      if (path) {
        this.set('selectedCompound.' + path, changeRecord.value);
      }
    }
  },
  ready: function () {
    // Bind dom-change to wait for dom-repeat
    this.$.compoundSelector.addEventListener('dom-change', this.onDomChange.bind(this));
  },
  onDomChange: function (e) {
    // First time recive just one dom-ready event with the target compound List, later comming 2 events, use just the second event
    if (e.target.id === 'compoundList' && !this.$.compoundSelector.selected) {
      this.$.compoundSelector.select(this.selectedCompound.artifactId);
      // Fire own event, because iron-select handler not always received after initialisation.
      // self-fired iron-select events also not received
      this.fire('bde_compound_select', this.selectedCompound.artifactId);
    }
    if (e.target.id.indexOf('endpoints_template') > -1) {
      this.$.compoundSelector.select(this.selectedCompound.artifactId);
      // Fire own event, because iron-select handler not always received after initialisation.
      // self-fired iron-select events also not received
      this.fire('bde_compound_select', this.selectedCompound.artifactId);
    }
  },

  addApp: function () {
    // this.$.addAppDialog.open();
  },

  openWebpackageMetaInfo: function (e) {
    this.$.webpackageMetaInfo.open();
  },

  openCompoundDetails: function (e) {
    e.stopPropagation();
    this.$.explorerDetails.set('artifactType', 'compoundComponent');
    // this.$.explorerDetails.set('artifact', this.selectedCompound);
    this.$.explorerDetails.set('artifactIndex', parseInt(e.currentTarget.dataset.index));
    this.$.explorerDetails.open();
  },

  addCompound: function () {
    this.$.compoundCreator.open();
  },
  manifestChanged: function (changeRecord) {
    var path = changeRecord.path.replace('manifest', 'currentComponentMetadata.manifest');
    this.set(path, changeRecord.value);
    if (this.selectedCompound) {
      this.set('selectedCompound', this.manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === this.selectedCompound.artifactId));
    }
    if (this.manifest) {
      var menu = this.$$('#compoundSelector');
      Polymer.dom(menu).querySelectorAll('paper-submenu').forEach(function (subMenu) {
        subMenu.close();
      });
    }
  },

  handleNewCompound: function (e) {
    this.push('manifest.artifacts.compoundComponents', e.detail.value);
    this.notifyPath('manifest.artifacts.compoundComponents', this.manifest.artifacts.compoundComponents.slice());
  },

  _handleCompoundItemsChanged: function (event) {
    // find added paper-submenu and ignore added text nodes
    var addedItem = event.detail.addedNodes.find((item) => item.tagName && item.tagName.toLowerCase() === 'paper-submenu');
    if (addedItem !== this.$.compoundSelector.selectedItem) {
      this.$.compoundSelector.select(addedItem.dataset.artifactId);
    }
  },
  openSettings: function (e) {
    e.stopPropagation();
    var item = e.model.dataHost.itemForElement(e.target);
    item.is = e.model.dataHost.id.replace(/List/, '');

    this.fire('bde-explorer-open-settings', { item: item });
  },

  selectApp: function (e) {
    var item = this.$.appList.itemForElement(e.target);
    item.is = 'app';
    this.$.appSelector.select(item);

    this.fire('iron-select', { is: 'app', item: item });
  },

  explorerItemSelected: function (e) {
    var item = e.detail.item;

    if (item.dataset.artifactId && item.dataset.artifactId !== this.currentComponentMetadata.artifactId) {
      this.deselectCompound();
      this.selectCompound(item.dataset.artifactId, item.dataset.endpointId);
    } else if (item.dataset.endpointId && item.dataset.endpointId !== this._createEndpointMenuItemId(this.currentComponentMetadata.artifactId, this.currentComponentMetadata.endpointId)) {
      this.selectEndpoint(item.dataset.endpointId);
    }
  },

  /**
   * event listener for own bde-compound-select evevt (fired after initialisation)
   * This event fired additional to iron-select, becouse iron-select can not always received by initialisation
   * @param e
   */
  handleBdeCompoundSelect: function (e) {
    var artifactId = e.detail;

    var elem = this.$.compoundSelector.querySelector('[data-artifact-id = ' + artifactId + ']');
    if (elem) {
      elem.is = 'compound';
    }
    if (artifactId && artifactId !== this.currentComponentMetadata.artifactId) {
      this.deselectCompound();
      this.selectCompound(artifactId);
    }
  },
  deselectCompound: function () {
    var menu = this.$$('#compoundSelector');
    // menu.selected = null;
    Polymer.dom(menu).querySelectorAll('paper-submenu').forEach(function (subMenu) {
      subMenu.close();
      Polymer.dom(subMenu).querySelector('paper-menu').selected = null;
    });
  },

  selectCompound: function (artifactId) {
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

  selectedCompoundChanged: function (changeRecord) {
    if (!changeRecord || !this.currentComponentMetadata.manifest) {
      return;
    }

    var path = changeRecord.path;
    var artifactPath = new Polymer.Collection(this.currentComponentMetadata.manifest.artifacts.compoundComponents).getKey(this.selectedCompound);
    path.replace('selectedCompound', 'currentComponentMetadata.manifest.artifacts.compoundComponents.' + artifactPath);
    this.set(path, changeRecord.value);
  },

  selectEndpoint: function (endpointId) {
    this.set('currentComponentMetadata.endpointId', endpointId.split('_')[ 1 ]);
  },

  selectElementary: function (e) {
    var item = this.$.elementaryList.itemForElement(e.target);
    item.is = 'elementary';
    this.$.elementarySelector.select(item);

    this.fire('iron-select', { is: 'elementary', item: item });
  },

  selectUtility: function (e) {
    var item = this.$.utilityList.itemForElement(e.target);
    item.is = 'utility';
    this.$.elementarySelector.select(item);

    this.fire('iron-select', { is: 'utility', item: item });
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

  _equals: function (a, b) {
    return a === b;
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
  _groupIdDefined: function (groupId) {
    if (groupId) {
      return true;
    }
    return false;
  }
});
