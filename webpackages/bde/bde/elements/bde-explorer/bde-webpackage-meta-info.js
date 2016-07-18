Polymer({
  is: 'bde-webpackage-meta-info',
  properties: {
    manifest: {
      type: Object,
      notify: true,
      observer: 'manifestChanged'
    },
    opened: {
      type: Boolean,
      value: false
    },
    licenses: {
      type: Array,
      value: [
        {value: 'None', label: 'None'},
        {value: 'MIT', label: 'MIT'},
        {value: 'Apache-2', label: 'Apache-2'},
        {value: 'GPL-3', label: 'GPL-3'},
        {value: '', label: 'Other'}
      ]
    },
    selectedLicense: {
      type: String,
      value: 'None'
    },
    keywords: {
      type: String,
      value: '',
      observer: 'keywordsChanged'
    }
  },
  _decideLicense: function (selectedLicense, otherLicense) {
    if (!this.manifest) {
      return;
    }
    if (selectedLicense) {
      this.manifest.license = selectedLicense;
    }
    else {
      this.manifest.license = otherLicense;
    }
  },
  keywordsChanged: function () {
    if (!this.manifest) {
      return;
    }
    this.manifest.keywords = this.keywords.replace(/ /g, '').split(',');
  },
  manifestChanged: function () {
    if (this.manifest.man && typeof this.manifest.man === 'string') {
      this.set('manifest.man', [this.manifest.man]);
    }
    if (this.manifest.license) {
      this.selectedLicense = this.manifest.license;
    }
    if (this.manifest.keywords) {
      keywords = this.manifest.keywords.join(', ');
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
  _createItem: function (itemName) {
    var newIndex;
    switch (itemName) {
      case 'contributor':
        newIndex = this.manifest.contributors.length;
        return {name: 'Contributor ' + newIndex};
      case 'runnable':
        newIndex = this.manifest.runnables.length;
        return {name: 'Runnable ' + newIndex, path: '', description: ''};
      case 'man':
        newIndex = this.manifest.man.length;
        return '';
      default:
        return {};
    }
  },
  _createPath: function () {
    var path = Array.prototype.slice.call(arguments).join('.');
    return 'manifest.' + path;
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
