Polymer({
  is: 'bde-explorer-details',
  properties: {

    artifact: {
      type: Object,
      notify: true
    },

    manifest: {
      type: Object,
      notify: true
    },

    opened: {
      type: Boolean,
      value: false
    },

    _editingArtifact: {
      type: Object
    },

    artifactType: {
      type: String,
      value: 'compoundComponent'
    },

    artifactIndex: {
      type: Number
    },

    validForm: {
      type: Boolean,
      value: true
    }
  },

  observers: [
    'artifactChanged(artifact.*)'
  ],

  artifactChanged: function () {
    this.set('_editingArtifact', JSON.parse(JSON.stringify(this.artifact)));
    this.set('validForm', true);
  },

  dialogOpenHandler: function (event) {
    this.set('_editingArtifact', JSON.parse(JSON.stringify(this.artifact)));
    this.set('validForm', true);
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

  _artifactIsApp: function (artifact) {
    return this.artifactType === 'appComponent';
  },

  _artifactIsCompound: function (artifact) {
    return this.artifactType === 'compoundComponent';
  },

  _artifactIsElementary: function (artifact) {
    return this.artifactType === 'elementaryComponent';
  },

  _artifactIsUtility: function (artifact) {
    return this.artifactType === 'utilityComponent';
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
  _isInputSlot: function (slot) {
    for (var i = 0; i < slot.direction.length; i++) {
      if (slot.direction[i] === 'input') {
        return true;
      }
    }
    return false;
  },
  _isOutputSlot: function (slot) {
    for (var i = 0; i < slot.direction.length; i++) {
      if (slot.direction[i] === 'output') {
        return true;
      }
    }
    return false;
  },
  _createItem: function (itemName) {
    switch (itemName) {
      case '':
        return {};
      case 'runnable':
        return {name: 'Runnable ' + this._editingArtifact.runnables.length, path: '', description: ''};
      case 'endpoint':
        return {
          endpointId: 'endpoint' + this._editingArtifact.endpoints.length,
          description: '',
          resources: [{prod: '', dev: ''}],
          dependencies: []
        };
      case 'endpointResource':
        return {prod: '', dev: ''};
      case 'endpointDependency':
        return '';
      case 'slot':
        return {
          slotId: 'slot' + this._editingArtifact.slots.length,
          type: '',
          direction: [],
          description: ''
        };
      case 'member':
        return {
          memberId: 'member' + this._editingArtifact.members.length,
          componentId: '',
          displayName: '',
          description: ''
        };
      case 'connection':
        return {
          connectionId: 'connection' + this._editingArtifact.connections.length,
          source: {memberIdRef: '', slot: ''},
          destination: {memberIdRef: '', slot: ''},
          copyValue: false,
          repeatedValues: false,
          hookFunction: '',
          description: ''
        };
      case 'init':
        return {memberIdRef: '', slot: '', value: '', description: ''};
      default:
        return {};
    }
  },
  _createPath: function () {
    var path = Array.prototype.slice.call(arguments).join('.');
    return '_editingArtifact.' + path;
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
  validateEditingArtifact: function () {
    if (this.$.artifactForm.validate()) {
      this.set('artifact', this._editingArtifact);
      this.set('manifest.artifacts.' + this.artifactType + 's.' + this.artifactIndex, this._editingArtifact);
      this.$.dialog.close();
    } else {
      this.set('validForm', false);
    }
  }
});
