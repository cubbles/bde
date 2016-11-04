// @importedBy bde-webpackage-meta-info.html
/* global _ */
Polymer({
  is: 'bde-webpackage-meta-info',
  properties: {

    /**
     * The manifest element
     * @type Object
     * @property manifest
     */
    manifest: {
      type: Object,
      notify: true
    },
    /**
     * Opened attribute of the paper-dialog.
     *
     * @type {Boolean}
     * @property opened
     */
    opened: {
      type: Boolean,
      value: false
    },
    /**
     * Internal property for editing manifest properties without save them in manifest property (Cancel possieble)
     * @type Object
     * @property _editingManifest
     */
    _editingManifest: {
      type: Object
    },

    /**
     * Indicate, that the contributors are initialized
     * @type Boolean
     * @property _initializedContributors
     */
    _initializedContributors: {
      type: Boolean,
      value: false
    },
    /**
     * Indicate, that the manuals are initialized.
     * @type Boolean
     * @property _initializedMan
     */
    _initializedMan: {
      type: Boolean,
      value: false
    },

    /**
     * Indicate, that the runnables are initialized.
     * @type Boolean
     * @property _initializedRunnables
     */
    _initializedRunnables: {
      type: Boolean,
      value: false
    },
    /**
     * Internal Attribute for comma separated keywords string.
     * @type String
     * @property _keywords
     */
    _keywords: {
      type: String,
      value: ''
    },
    /**
     * Internal Attribute for license list
     * @type Array
     * @property _licenses
     */
    _licenses: {
      type: Array,
      value: [
        { value: 'None', label: 'None' },
        { value: 'MIT', label: 'MIT' },
        { value: 'Apache-2', label: 'Apache-2' },
        { value: 'GPL-3', label: 'GPL-3' },
        { value: '', label: 'Other' }
      ]
    },
    /**
     * Internal propert for hold the selected license from  _linceses
     * @type String
     * @property _selectedLicense
     */
    _selectedLicense: {
      type: String,
      value: 'None'
    },
    /**
     * Internal property indicates, if the form is valid.
     * @type Boolean
     * @property _validForm
     */
    _validForm: {
      type: Boolean,
      value: true
    }
  },
  observers: [
    '_manifestChanged(manifest.*)'
  ],
  /**
   * Open the dialog
   */
  open: function () {
    this.opened = true;
  },
  /**
   * Close the dialog
   */
  close: function () {
    this.opened = false;
  },
  /**
   * Handler method after the contributor list changed in dom
   * @param {Evnt} event dom-change event
   */
  _contributorsDomChanged: function (event) {
    // first time (initial) not expand the last element, just by add new item
    if (!this._initializedContributors) {
      this.set('_initializedContributors', true);
      return;
    }
    if (this._editingManifest && this._editingManifest.contributors && this._editingManifest.contributors.length > 0) {
      var id = this._idForCollapse(this._editingManifest.contributors.length - 1, 'contributor_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },
  /**
   * This handler method is called after the dialog openend.
   * @param event
   * @private
   */
  _dialogOpenHandler: function (event) {
    this.set('_editingManifest', _.cloneDeep(this.manifest.toValidManifest()));
    this.set('_validForm', true);
  },
  /**
   * Save the selected licence if exists or the manual edited licence.
   * @param {String} selectedLicense the selected licence
   * @param {String} otherLicense typed l
   * @private
   */
  _decideLicense: function (selectedLicense, otherLicense) {
    if (!this._editingManifest) {
      return;
    }
    if (selectedLicense) {
      this._editingManifest.license = selectedLicense;
    } else {
      this._editingManifest.license = otherLicense;
    }
  },
  _keywordsChanged: function () {
    if (!this._editingManifest) {
      return;
    }
    this._editingManifest.keywords = [];
    var keywords = this._keywords.split(',');
    keywords.forEach(function (keyword) {
      this.push('_editingManifest.keywords', keyword.trim());
    }.bind(this));
  },
  _manDomChanged: function (event) {
    // first time (initial) not expand the last element, just by add new item
    if (!this._initializedMan) {
      this.set('_initializedMan', true);
      return;
    }
    if (this._editingManifest && this._editingManifest.man && this._editingManifest.man.length > 0) {
      var id = this._idForCollapse(this._editingManifest.man.length - 1, 'man_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },
  _manifestChanged: function () {
    if (this.manifest && this.manifest.man && typeof this.manifest.man === 'string') {
      this.set('manifest.man', [ this.manifest.man ]);
    }
    if (this.manifest && this.manifest.license) {
      this.selectedLicense = this.manifest.license;
    }
    if (this.manifest && this.manifest.keywords) {
      this._keywords = this.manifest.keywords.join(', ');
    }
  },
  _runnablesDomChanged: function (event) {
    // first time (initial) not expand the last element, just by add new item
    if (!this._initializedRunnables) {
      this.set('_initializedRunnables', true);
      return;
    }
    if (this._editingManifest && this._editingManifest.runnables && this._editingManifest.runnables.length > 0) {
      var id = this._idForCollapse(this._editingManifest.runnables.length - 1, 'runnable_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },

  toggleCollapse: function (e) {
    var collapseDiv = this.$$('#' + e.currentTarget.dataset.collapseId);
    collapseDiv.toggle();
    Polymer.dom(e.currentTarget).querySelector('iron-icon').icon = this._calculateToggleIcon(collapseDiv.opened);
  },
  removeItem: function (e) {
    var itemIndex = e.currentTarget.dataset.itemIndex;
    var path = e.currentTarget.dataset.path;
    this.splice(path, itemIndex, 1);
  },
  addNewItem: function (e) {
    var path = e.currentTarget.dataset.path;
    if (!this.get(path)) {
      this.set(path, []);
    }
    var item = this._createItem(e.currentTarget.dataset.itemName);
    this.push(path, item);
  },
  validateAndSave: function () {
    if (this.$.manifestForm.validate()) {
      if (!_.isEqual(this.manifest, this._editingManifest)) {
        var tempManifest = _.extend(this.manifest, this._editingManifest);
        this.set('manifest', tempManifest);
        this.$.manifestDialog.close();
      }
    } else {
      this.set('_validForm', false);
    }
  },
  _createItem: function (itemName) {
    var newIndex;
    switch (itemName) {
      case 'contributor':
        newIndex = this._editingManifest.contributors.length;
        return { name: 'Contributor ' + newIndex, email: '' };
      case 'runnable':
        newIndex = this._editingManifest.runnables.length;
        return { name: 'Runnable ' + newIndex, path: '', description: '' };
      case 'man':
        newIndex = this._editingManifest.man.length;
        return 'url' + newIndex;
      default:
        return {};
    }
  },
  _createPath: function () {
    var path = Array.prototype.slice.call(arguments).join('.');
    return '_editingManifest.' + path;
  },
  _idForCollapse: function (index, prefix) {
    prefix = prefix || '';
    return prefix + 'collapse' + index;
  },
  _calculateToggleIcon: function (state) {
    return state ? 'icons:expand-less' : 'icons:expand-more';
  },
  _isObject: function (value) {
    return typeof value === 'object';
  },
  _equals: function (a, b) {
    return a === b;
  },
  _validateForm: function () {
    this.debounce('validateForm', function () {
      this.$.manifestForm.validate();
    }, 2);
  }
});
