/* global _ */
Polymer({
  is: 'bde-webpackage-meta-info',
  properties: {
    manifest: {
      type: Object,
      notify: true
    },
    opened: {
      type: Boolean,
      value: false
    },
    licenses: {
      type: Array,
      value: [
        { value: 'None', label: 'None' },
        { value: 'MIT', label: 'MIT' },
        { value: 'Apache-2', label: 'Apache-2' },
        { value: 'GPL-3', label: 'GPL-3' },
        { value: '', label: 'Other' }
      ]
    },
    selectedLicense: {
      type: String,
      value: 'None'
    },
    keywords: {
      type: String,
      value: ''
    },
    _editingManifest: {
      type: Object
    },
    _validForm: {
      type: Boolean,
      value: true
    },
    initializedContributors: {
      type: Boolean,
      value: false
    },
    initializedMan: {
      type: Boolean,
      value: false
    },
    initializedRunnables: {
      type: Boolean,
      value: false
    }
  },
  observers: [
    'manifestChanged(manifest.*)'
  ],

  contributorsDomChanged: function (event) {
    // first time (initial) not expand the last element, just by add new item
    if (!this.initializedContributors) {
      this.set('initializedContributors', true);
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
  manDomChanged: function (event) {
    // first time (initial) not expand the last element, just by add new item
    if (!this.initializedMan) {
      this.set('initializedMan', true);
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
  runnablesDomChanged: function (event) {
    // first time (initial) not expand the last element, just by add new item
    if (!this.initializedRunnables) {
      this.set('initializedRunnables', true);
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
  dialogOpenHandler: function (event) {
    console.log('this.manifest', this.manifest);
    console.log(' _.clone(this.manifest)', _.clone(this.manifest.toValidManifest()));
    this.set('_editingManifest', _.clone(this.manifest.toValidManifest()));
    this.set('_validForm', true);
  },
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
  keywordsChanged: function () {
    if (!this._editingManifest) {
      return;
    }
    this._editingManifest.keywords = [];
    var keywords = this.keywords.split(',');
    keywords.forEach(function (keyword) {
      this.push('_editingManifest.keywords', keyword.trim())
    }.bind(this));

  },
  manifestChanged: function () {
    if (this.manifest.man && typeof this.manifest.man === 'string') {
      this.set('manifest.man', [ this.manifest.man ]);
    }
    if (this.manifest.license) {
      this.selectedLicense = this.manifest.license;
    }
    if (this.manifest.keywords) {
      this.keywords = this.manifest.keywords.join(', ');
    }
  },
  open: function () {
    this.opened = true;
  },
  close: function () {
    this.opened = false;
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
        var tempManifest = this.manifest;
        _.extend(tempManifest, this._editingManifest);
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
  }
});
