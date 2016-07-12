Polymer({
  is: 'bde-explorer-details',
  properties: {

    artifact: {
      type: Object,
      notify: true
    },

    opened: {
      type: Boolean,
      value: false
    },

    artifactType: {
      type: String,
      value: 'compoundComponent'
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

  _artifactIsApp: function (artifact) {
    return this.artifactType == 'appComponent';
  },

  _artifactIsCompound: function (artifact) {
    return this.artifactType === 'compoundComponent';
  },

  _artifactIsElementary: function (artifact) {
    return this.artifactType === 'elementaryComponent';
  },

  _artifactIsUtility: function (artifact) {
    return this.artifactType == 'utilityComponent';
  },

  _idForCollapse: function (index, prefix) {
    prefix = prefix || ''
    return prefix + 'collapse' + index;
  },

  _calculateToggleIcon: function (state) {
    return state ? 'icons:arrow-drop-up' : 'icons:arrow-drop-down';
  },

  _isObject: function (value) {
    return typeof value === 'object';
  },
  _isInputSlot: function (slot) {
    for (var i = 0; i < slot.direction.length; i++) {
      if (slot.direction[ i ] === 'input') {
        return true;
      }
    }
    return false;
  },
  _isOutputSlot: function (slot) {
    for (var i = 0; i < slot.direction.length; i++) {
      if (slot.direction[ i ] === 'output') {
        return true;
      }
    }
    return false;
  },
  addRunnable: function () {
    var newIndex = this.artifact.runnables.length;
    this.push(
      'artifact.runnables',
      {
        name: 'runnable' + newIndex,
        path: '',
        description: ''
      });
  },
  addEndpoint: function () {
    this.push(
      'artifact.endpoints',
      {
        endpointId: 'endpoint' + this.artifact.endpoints.length,
        description: '',
        resources: [ { prod: '', dev: '' } ],
        dependencies: []
      });
  },
  addEndpointResource: function (e) {
    var endpointId = e.currentTarget.dataset.endpointId;
    var i = this.indexOfItemByProperty(this.artifact.endpoints, 'endpointId', endpointId);
    this.push('artifact.endpoints.' + i + '.resources', { prod: '', dev: '' });
  },
  addEndpointDependency: function (e) {
    var endpointId = e.currentTarget.dataset.endpointId;
    var i = this.indexOfItemByProperty(this.artifact.endpoints, 'endpointId', endpointId);
    this.push('artifact.endpoints.' + i + '.dependencies', '');
  },
  addSlot: function () {
    this.push(
      'artifact.slots',
      {
        slotId: 'slot' + this.artifact.slots.length,
        type: '',
        direction: [],
        description: ''
      });
  },
  addMember: function () {
    this.push(
      'artifact.members',
      {
        memberId: 'member' + this.artifact.members.length,
        componentId: '',
        displayName: '',
        description: ''
      });
  },
  addConnection: function () {
    this.push(
      'artifact.connections',
      {
        connectionId: 'connection' + this.artifact.connections.length,
        source: { memberIdRef: '', slot: '' },
        destination: { memberIdRef: '', slot: '' },
        copyValue: false,
        repeatedValues: false,
        hookFunction: '',
        description: ''
      }
    );
  },
  addInit: function () {
    this.push('artifact.inits', { memberIdRef: '', slot: '', value: '', description: '' });
  },
  indexOfItemByProperty: function (list, property, value) {
    for (var i = 0; i < list.length; i++) {
      if (list[ i ][ property ] === value) {
        return i;
      }
    }
    return -1;
  },
  _createPath: function () {
    var path = Array.prototype.slice.call(arguments).join('.');
    return 'artifact.' + path;
  },
  removeItem: function (e) {
    var itemIndex = e.currentTarget.dataset.itemIndex;
    var path = e.currentTarget.dataset.path;
    this.splice(path, itemIndex, 1);
  }
});
