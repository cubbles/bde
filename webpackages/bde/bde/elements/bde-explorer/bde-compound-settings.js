// @importedBy bde-compound-settings.html
/* global _ */
Polymer({
  is: 'bde-compound-settings',
  properties: {

    /**
     * The current selected artifact of the project.
     *
     * @type {Object}
     * @property artifact
     */
    artifact: {
      type: Object,
      notify: true
    },

    /**
     * Index of the current edited artifact.
     * Used for the order in which the components are displayed in the explorer.
     *
     * @type {Number}
     * @property artifactIndex
     */
    artifactIndex: {
      type: Number
    },

    /**
     * Value for the artifactType of the project.
     * Uses to determine the affiliation of the artifact in the explorer element.
     *
     * @type {String}
     * @property artifactType
     */
    artifactType: {
      type: String,
      value: 'compoundComponent'
    },

    /**
     * The manifest metadata of the current project.
     *
     * @type {Object}
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
     * Helper property to determine if the form is valid.
     *
     * @type {Boolean}
     * @property _validForm
     */
    _validForm: {
      type: Boolean,
      value: true
    },

    /**
     * The currently edited artifact of the project.
     * Helper property.
     *
     * @type {Object}
     * @property _editingArtifact
     */
    _editingArtifact: {
      type: Object
    }
  },

  listeners: {
    'change': '_handleChangedInitValue',
    'inits.dom-change': '_bindInputValidators'
  },
  observers: [
    'artifactChanged(artifact.*)',
    '_validFormChanged(_validForm)'
  ],

  /* *********************************************************************/
  /* ************************* Lifecycle Methods *************************/
  /* *********************************************************************/
  /**
   * Polymer ready function. Calls _bindValidators function.
   *
   * @method ready
   */
  ready: function () {
    this._bindValidators();
  },

  /* *********************************************************************/
  /* ************************* public Methods ****************************/
  /* *********************************************************************/

  /**
   * Adds a new component to the project, using the tap-event to determine, which item is to be added.
   *
   * @param {[Event]} e [tap event from paper-button]
   * @method addNewItem
   */
  addNewItem: function (e) {
    var path = e.currentTarget.dataset.path;
    if (!this.get(path)) {
      this.set(path, []);
    }
    var item = this._createItem(e.currentTarget.dataset.itemName, path);
    this.push(path, item);
  },

  /**
   * Artifact change handler.
   *
   * @param  {[type]} changeRecord [description]
   * @method artifactChanged
   */
  artifactChanged: function (changeRecord) {
    this.set('_editingArtifact', _.cloneDeep(this.artifact));
    this.set('_validForm', true);
  },

  /**
   * Closes the encompassing paper-dialog by setting the openend property to false.
   *
   * @method close
   */
  close: function () {
    this.opened = false;
  },

  /**
   * Connections change handler..
   *
   * @param  {[type]} event [description]
   * @method connectionsDomChanged
   */
  connectionsDomChanged: function (event) {
    if (this._editingArtifact && this._editingArtifact.connections && this._editingArtifact.connections.length > 0) {
      var id = this._idForCollapse(this._editingArtifact.connections.length - 1, 'connection_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },

  /**
   * Endpoints change handler
   *
   * @param  {[type]} event [description]
   * @method endpointsDomChanged
   */
  endpointsDomChanged: function (event) {
    if (this._editingArtifact && this._editingArtifact.endpoints && this._editingArtifact.endpoints.length > 0) {
      var id = this._idForCollapse(this._editingArtifact.endpoints.length - 1, 'endpoint_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },

  /**
   * Inits change handler.
   *
   * @param  {[type]} event [description]
   * @method initsDomChanged
   */
  initsDomChanged: function (event) {
    if (this._editingArtifact && this._editingArtifact.inits && this._editingArtifact.inits.length > 0) {
      var id = this._idForCollapse(this._editingArtifact.inits.length - 1, 'init_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },

  /**
   * Runnables change handler.
   * @param  {[type]} event [description]
   * @method runnablesDomChanged
   */
  runnablesDomChanged: function (event) {
    if (this._editingArtifact && this._editingArtifact.runnables && this._editingArtifact.runnables.length > 0) {
      var id = this._idForCollapse(this._editingArtifact.runnables.length - 1, 'runnable_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },

  /**
   * Dialog opened handler. Parses the current artifact metadata.
   *
   * @param  {[Event]} event [iron-overlay opened event]
   * @method dialogOpenHandler
   */
  dialogOpenHandler: function (event) {
    if (event.target !== event.currentTarget) {
      return;
    }
    let editingArtifact = JSON.parse(JSON.stringify(this.artifact));
    if (editingArtifact.inits) {
      editingArtifact.inits.forEach((init) => {
        init.value = JSON.stringify(init.value);
      });
    }
    if (editingArtifact.slots) {
      editingArtifact.slots.forEach((slot) => {
        if (!slot.type) {
          slot.type = 'any';
        }
      });
    }
    this.set('_editingArtifact', editingArtifact);

    this.$.members.render();
    this.set('_validForm', true);
  },

  /**
   * Members change handler.
   *
   * @param  {[type]} event [description]
   * @method membersDomChanged
   */
  membersDomChanged: function (event) {
    if (this._editingArtifact && this._editingArtifact.members && this._editingArtifact.members.length > 0) {
      var id = this._idForCollapse(this._editingArtifact.members.length - 1, 'member_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },

  /**
   * Dialog open function, sets opened property to true.
   *
   * @method open
   */
  open: function () {
    this.opened = true;
  },

  /**
   * Removes the current artifact from the project by determining the target of the actual tap.
   *
   * @param  {[Event]} e [tap Event from the corresponding 'delete' button]
   * @method removeItem
   */
  removeItem: function (e) {
    var itemIndex = e.currentTarget.dataset.itemIndex;
    var path = e.currentTarget.dataset.path;
    var removedObject = this.splice(path, itemIndex, 1)[0];
    if (path.indexOf('slots') > -1) { // of removed slot, it should be removed the connections and inits
      // remove connections
      let connectionIndex = this._findConnectionIndexBySlot(this._editingArtifact.connections, removedObject);
      while (connectionIndex > -1) {
        this.splice('_editingArtifact.connections', connectionIndex, 1);
        connectionIndex = this._findConnectionIndexBySlot(this._editingArtifact.connections, removedObject);
      }

      // remove inits
      let initIndex = this._findInitIndexBySlot(this._editingArtifact.inits, removedObject);
      while (initIndex > -1) {
        this.splice('_editingArtifact.inits', initIndex, 1);
        initIndex = this._findInitIndexBySlot(this._editingArtifact.inits, removedObject);
      }
    }
  },

  _findConnectionIndexBySlot: function (connections, slot) {
    return connections.findIndex(connection => {
      return (connection.source.slot === slot.slotId &&
          (connection.source.memberIdRef === '' || typeof connection.source.memberIdRef === 'undefined')) ||
        (connection.destination.slot === slot.slotId &&
          (connection.destination.memberIdRef === '' || typeof connection.destination.memberIdRef === 'undefined'));
    });
  },
  _findInitIndexBySlot: function (inits, slot) {
    return inits.findIndex(init => {
      return init.slot === slot.slotId && (init.memberIdRef === '' || typeof init.memberIdRef === 'undefined');
    });
  },
  /**
   * Slots change handler.
   *
   * @param  {[type]} event [description]
   * @method slotsDomChanged
   */
  slotsDomChanged: function (event) {
    if (this._editingArtifact && this._editingArtifact.slots && this._editingArtifact.slots.length > 0) {
      var id = this._idForCollapse(this._editingArtifact.slots.length - 1, 'slot_');
      var lastElem = this.querySelector('#' + id);
      if (lastElem && !lastElem.openend) {
        lastElem.toggle();
      }
    }
  },

  /**
   * Toggles the current div, by determining the target of the tap.
   *
   * @param  {[Event]} e [Tap event, to determine the current tap target.]
   * @method toggleCollapse
   */
  toggleCollapse: function (e) {
    var collapseDiv = this.$$('#' + e.currentTarget.dataset.collapseId);
    collapseDiv.toggle();
    Polymer.dom(e.currentTarget).querySelector('iron-icon').icon = this._calculateToggleIcon(collapseDiv.opened);
  },

  /**
   * Validation function called on submit of the form.
   * Validating the form and setting the respective input data to metadata.
   *
   * @method validateAndSave
   */
  validateAndSave: function () {
    if (this.$.artifactForm.validate()) {
      if (!_.isEqual(this.artifact, this._editingArtifact)) {
        if (this._editingArtifact.inits) {
          this._editingArtifact.inits.forEach((init) => {
            try {
              init.value = JSON.parse(init.value);
            } catch (err) {
              console.error(err);
            }
          });
        }
        if (this._editingArtifact.slots) {
          this._editingArtifact.slots.forEach((slot) => {
            if (slot.type === 'any') {
              delete slot.type;
            }
          });
        }
        this.set('artifact', this._editingArtifact);
        this.set('manifest.artifacts.' + this.artifactType + 's.' + this.artifactIndex, this._editingArtifact);
        this.fire('bde-current-artifact-edited');
      }
      this.$.compoundDialog.close();
    } else {
      this.set('_validForm', false);
    }
  },

  /* *********************************************************************/
  /* ************************* private Methods ***************************/
  /* *********************************************************************/
  /**
   * Returns artifactType as 'appComponent'
   *
   * @param  {[type]} artifact [description]
   * @return {[String]}          [artifactType]
   * @method _artifactIsApp
   */
  _artifactIsApp: function (artifact) {
    return this.artifactType === 'appComponent';
  },

  /**
   * Returns artifactType as 'compoundComponent'
   *
   * @param  {[type]} artifact [description]
   * @return {[String]}          [artifactType]
   * @method _artifactIsCompound
   */
  _artifactIsCompound: function (artifact) {
    return this.artifactType === 'compoundComponent';
  },

  /**
   * Returns artifactType as 'elementaryComponent'
   *
   * @param  {[type]} artifact [description]
   * @return {[String]}          [artifactType]
   * @method _artifactIsElementary
   */
  _artifactIsElementary: function (artifact) {
    return this.artifactType === 'elementaryComponent';
  },

  /**
   * Returns artifactType as 'utilityComponent'
   *
   * @param  {[type]} artifact [description]
   * @return {[String]}          [artifactType]
   * @method _artifactIsUtility
   */
  _artifactIsUtility: function (artifact) {
    return this.artifactType === 'utilityComponent';
  },

  /**
   * Binds a custom validator to the internal validator functions.  (this._validateInitValue and this._validateArtifactId)
   *
   * @param  {[type]} event [description]
   * @method _bindValidators
   */
  _bindValidators: function (event) {
    this._bindInputValidators();
    this.$.componentValidArtifactId.validate = this._validateArtifactId.bind(this);
  },

  _bindInputValidators: function () {
    var validatorList = Polymer.dom(this.root).querySelectorAll('.validValue');
    for (let i = 0; i < validatorList.length; i++) {
      let validatorEl = validatorList[ i ];
      // Register the validator again, becase the validator-name is not registered, becouse cumputed property
      // eslint-disable-next-line no-new
      new Polymer.IronMeta({ type: validatorEl.validatorType, key: validatorEl.validatorName, value: validatorEl });
      var validatebleEl = this.$$('[validator=' + validatorEl.validatorName + ']');
      validatebleEl.set('validator', '');
      validatebleEl.set('validator', validatorEl.validatorName);
      validatorEl.validate = function (value) {
        return this._validateInitValue(value, validatebleEl);
      }.bind(this);
    }
  },

  /**
   * Determines the current toggle state and return the corresponding value.
   *
   * @param  {[String]} state [attribute of the collapse]
   * @method _calculateToggleIcon
   */
  _calculateToggleIcon: function (state) {
    return state ? 'icons:expand-less' : 'icons:expand-more';
  },

  /**
   * Evaluates copy value flag for check or not check the checkbox.
   *
   * @param  {[type]} connection [description]
   * @return {[Boolean]}  [repeatedValues flag]
   * @method _repeatedValues
   */
  _copyValue: function (connection) {
    if (connection && typeof connection.copyValue === 'undefined') {
      connection.copyValue = true;
    }
    return connection.copyValue;
  },

  /**
   * This handler method is called after changed a copy value checkbox for a connection.
   * Save the changed value in the _editedArtifact property
   * @param {Event} evt change event
   * @private
   */
  _copyValueChanged: function (evt) {
    var connectionId = evt.target.dataset.connectionId;
    var connection = this._editingArtifact.connections.find((con) => con.connectionId === connectionId);
    var path = Polymer.Collection.get(this._editingArtifact.connections).getKey(connection);
    if (evt.target.checked) {
      this.set('_editingArtifact.connections.' + path + '.copyValue', true);
    } else {
      this.set('_editingArtifact.connections.' + path + '.copyValue', false);
    }
  },
  /**
   * Sets the metadata according the inputs.
   *
   * @param  {[String]} itemName
   * @param  {[String]} path
   * @method _createItem
   */
  _createItem: function (itemName, path) {
    var newIndex;
    switch (itemName) {
      case '':
        return {};
      case 'runnable':
        newIndex = this.get(path).length;
        return { name: 'Runnable ' + newIndex, path: '', description: '' };
      case 'endpoint':
        return {
          endpointId: 'endpoint' + this._editingArtifact.endpoints.length,
          description: '',
          resources: [ { prod: '', dev: '' } ],
          dependencies: []
        };
      case 'resource':
        return { prod: '', dev: '' };
      case 'dependency':
        return { artifactId: '' };
      case 'slot':
        return {
          slotId: 'slot' + this._editingArtifact.slots.length,
          type: '',
          direction: [ 'input', 'output' ],
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
          source: { memberIdRef: undefined, slot: '' },
          destination: { memberIdRef: '', slot: '' },
          copyValue: false,
          repeatedValues: false,
          hookFunction: '',
          description: ''
        };
      case 'init':
        return { memberIdRef: undefined, slot: '', value: '', description: '' };
      default:
        return {};
    }
  },

  /**
   * Determines he path of the inputted artifact.
   *
   * @return {[String]} [path of the artifact]
   * @method _createPath
   */
  _createPath: function () {
    var path = Array.prototype.slice.call(arguments).join('.');
    return '_editingArtifact.' + path;
  },

  _getSlotDirectionId: function (i, direction) {
    return 'slot_' + direction + '_' + i;
  },

  /**
   * Init value change handler
   *
   * @param  {[type]} event [description]
   * @method _handleChangedInitValue
   */
  _handleChangedInitValue: function (event) {
    var sourceEl = event.target;
    if (sourceEl.tagName.toLowerCase() === 'textarea') {
      var textareaElem = sourceEl.closest('bde-textarea');
      if (textareaElem.classList.contains('initValue')) {
        var value = textareaElem.value;
        this.set(textareaElem.dataset.path, value);
      }
    }
    if (sourceEl.classList.contains('slotDirectionInput')) {
      this._setSlotDirection(sourceEl.dataset.slotId, 'input', sourceEl.checked);
    }
    if (sourceEl.classList.contains('slotDirectionOutput')) {
      this._setSlotDirection(sourceEl.dataset.slotId, 'output', sourceEl.checked);
    }
  },

  /**
   * Helper function to determine the id of the current collapsable element.
   *
   * @param  {[type]} index  [description]
   * @param  {[type]} prefix [description]
   * @return {[String]}        [compound string]
   * @method _idForCollapse
   */
  _idForCollapse: function (index, prefix) {
    prefix = prefix || '';
    return prefix + 'collapse' + index;
  },

  /**
   * Returns an id for the element.
   *
   * @param  {[type]} index [description]
   * @return {[String]}       [id]
   * @method _initTextareaId
   */
  _initTextareaId: function (index) {
    return 'initValue' + index;
  },

  /**
   * Returns the data path for the inits.
   *
   * @param  {[type]} index [description]
   * @return {[String]}       [dataPath]
   * @method _initValueDataPath
   */
  _initValueDataPath: function (index) {
    return '_editingArtifact.inits.' + index + '.value';
  },

  /**
   * Checks if the current slot is an input slot.
   *
   * @param  {[Object]} slot [slots of the artifact]
   * @return {Boolean}      [Corresponding to result of the check]
   * @method _isInputSlot
   */
  _isInputSlot: function (slot) {
    for (var i = 0; i < slot.direction.length; i++) {
      if (slot.direction[ i ] === 'input') {
        return true;
      }
    }
    return false;
  },

  /**
   * Determines if the parameter value is an Object.
   * Helper function.
   *
   * @param  {[Object]} value [description]
   * @return {Boolean}       [result of the object check]
   * @method _isObject
   */
  _isObject: function (value) {
    return typeof value === 'object';
  },

  /**
   * Checks if the current slot is an output slot.
   *
   * @param  {[Object]} slot [slots of the artifact]
   * @return {Boolean}      [Corresponding to result of the check]
   */
  _isOutputSlot: function (slot) {
    for (var i = 0; i < slot.direction.length; i++) {
      if (slot.direction[ i ] === 'output') {
        return true;
      }
    }
    return false;
  },

  /**
   * Generate an id attribute value for the dom element.
   * @param {Number} index index of the member object in members
   * @returns {string} the generated member id, wich is a combination of 'member_' and the index.
   * @private
   */
  _memberDomId: function (index) {
    return 'member_' + index;
  },

  /**
   * A handler method for memberId changes.
   * @param {Event} event the change event of memberId input field.
   * @private
   */
  _memberIdChanged: function (event) {
    var element = event.target.closest('paper-input');
    var index = element.id.split('_')[ 1 ];
    var oldMember = this.artifact.members[ index ];
    var newMember = this._editingArtifact.members[ index ];
    if (this._editingArtifact.connections) {
      let connections = this._editingArtifact.connections.filter((connection) => connection.source.memberIdRef === oldMember.memberId);
      connections.forEach((connection) => {
        let key = new Polymer.Collection(this._editingArtifact.connections).getKey(connection);
        this.set('_editingArtifact.connections.' + key + '.source.memberIdRef', newMember.memberId);
      });
      connections = this._editingArtifact.connections.filter((connection) => connection.destination.memberIdRef === oldMember.memberId);
      connections.forEach((connection) => {
        let key = new Polymer.Collection(this._editingArtifact.connections).getKey(connection);
        this.set('_editingArtifact.connections.' + key + '.destination.memberIdRef', newMember.memberId);
      });
    }
    if (this._editingArtifact.inits) {
      let inits = this._editingArtifact.inits.filter((init) => init.memberIdRef === oldMember.memberId);
      inits.forEach((init) => {
        let key = new Polymer.Collection(this._editingArtifact.inits).getKey(init);
        this.set('_editingArtifact.inits.' + key + '.memberIdRef', newMember.memberId);
      });
    }
  },

  /**
   * Evaluates repeated values flag for check or not check the checkbox.
   *
   * @param  {[type]} connection [description]
   * @return {[Boolean]}  [repeatedValues flag]
   * @method _repeatedValues
   */
  _repeatedValues: function (connection) {
    if (connection && typeof connection.repeatedValues === 'undefined') {
      connection.repeatedValues = false;
    }
    return connection.repeatedValues;
  },
  /**
   * This handler method is called after changed a repeated values checkbox for a connection.
   * Save the changed value in the _editedArtifact property
   * @param {Event} evt change event
   * @private
   */
  _repeatedValuesChanged: function (evt) {
    var connectionId = evt.target.dataset.connectionId;
    var connection = this._editingArtifact.connections.find((con) => con.connectionId === connectionId);
    var path = Polymer.Collection.get(this._editingArtifact.connections).getKey(connection);
    if (evt.target.checked) {
      this.set('_editingArtifact.connections.' + path + '.repeatedValues', true);
    } else {
      this.set('_editingArtifact.connections.' + path + '.repeatedValues', false);
    }
  },

  /**
   * Set a direction attribute in the slot with slotId of the compound.
   * @param {string} slotId the slotId of the slot
   * @param {string} direction the direction
   * @param {boolean} checked the checked attribute of the form
   * @private
   */
  _setSlotDirection: function (slotId, direction, checked) {
    if (!this._editingArtifact.slots) {
      return;
    }
    var slot = this._editingArtifact.slots.find((slot) => slot.slotId === slotId);
    if (slot.direction && slot.direction.includes(direction) && !checked) {
      // remove direction  form slot.direction array
      var index = slot.direction.indexOf(direction);
      slot.direction.splice(index, 1);
    }
    if (!slot.direction && checked) {
      // create lot.direction property and add direction to slot.direction array
      slot.direction = [];
      slot.direction.push(direction);
    }

    if (slot.direction && !slot.direction.includes(direction) && checked) {
      // add direction to slot.direction array
      slot.direction.push(direction);
    }
  },

  /**
   * Generate an id attribute value for the dom element.
   * @param {Number} index of the slot object in slots
   * @returns {string} the generated slot id, wich is a combination of 'slot_' and the index.
   * @private
   */
  _slotDomId: function (index) {
    return 'slot_' + index;
  },

  /**
   * A handler method for handle slotId changes.
   * @param {Event} event the change event of slotId input field.
   * @private
   */
  _slotIdChanged: function (event) {
    var element = event.target.closest('paper-input');
    var index = element.id.split('_')[ 1 ];
    var oldSlot = this.artifact.slots[ index ];
    var newSlot = this._editingArtifact.slots[ index ];
    if (this._editingArtifact.connections) {
      let connections = this._editingArtifact.connections.filter((connection) => connection.source.slot === oldSlot.slotId && !connection.source.memberIdRef);
      connections.forEach((connection) => {
        let key = new Polymer.Collection(this._editingArtifact.connections).getKey(connection);
        this.set('_editingArtifact.connections.' + key + '.source.slot', newSlot.slotId);
      });
      connections = this._editingArtifact.connections.filter((connection) => connection.destination.slot === oldSlot.slotId && !connection.destination.memberIdRef);
      connections.forEach((connection) => {
        let key = new Polymer.Collection(this._editingArtifact.connections).getKey(connection);
        this.set('_editingArtifact.connections.' + key + '.destination.slot', newSlot.slotId);
      });
    }
    if (this._editingArtifact.inits) {
      let inits = this._editingArtifact.inits.filter((init) => init.slot === oldSlot.slotId && !init.memberIdRef);
      inits.forEach((init) => {
        let key = new Polymer.Collection(this._editingArtifact.inits).getKey(init);
        this.set('_editingArtifact.inits.' + key + '.slot', newSlot.slotId);
      });
    }
  },

  /**
   * Calls form validator.
   *
   * @method _validateForm
   */
  _validateForm: function () {
    this.debounce('validateForm', function () {
      this.$.artifactForm.validate();
    }, 2);
  },

  /**
   * Custom validator for validate artifactId.
   *
   * @param {string} value edited value
   * @returns {Boolean} result of the validation
   * @private
   */
  _validateArtifactId: function (value) {
    var artifactId = value;
    var matches = artifactId.match(/^[a-z0-9]+(-[a-z0-9]+)+$/);
    var unique = true;

    if (this.manifest && this.manifest.artifacts) {
      var artifactsIds = [];
      var artifacts = this.manifest.artifacts;

      Object.keys(artifacts).forEach(function (artifactType) {
        artifacts[ artifactType ].forEach(function (artifact) {
          artifactsIds.push(artifact.artifactId);
        });
      });

      var foundArtifactIds = artifactsIds.filter((id) => id === artifactId);

      var index = foundArtifactIds.indexOf(this.artifact.artifactId);
      if (index > -1) {
        foundArtifactIds.splice(index, 1);
      }
      if (foundArtifactIds.length > 0) {
        unique = false;
      }
    }
    return matches && unique;
  },

  /**
   * Custom JSON validator, checks if the pattern of a JSON file matches.
   *
   * @param  {*} value [description]
   * @return {Boolean} result of the validation
   * @method _validateInitValue
   */
  _validateInitValue: function (value, targetElement) {
    // validation code
    let parsedValue;
    value = targetElement.value;
    let validJSON = true;
    try {
      parsedValue = JSON.parse(value);
    } catch (err) {
      targetElement.errorMessage = 'The init value must be valid json. (e.g. "Hallo World!" or { "label": "value"})';
      validJSON = false;
    }
    return validJSON && this._validateInitValueType(parsedValue, targetElement);
  },

  _validateInitValueType: function (value, targetElement) {
    var getMemberSlot = function (artifact, memberIdRef, slotId) {
      var slot;
      if (artifact && memberIdRef && slotId) {
        var memberDef = artifact.members.find((mem) => mem.memberId === memberIdRef);

        if (this.resolutions && memberDef) {
          var member = this.resolutions[ memberDef.artifactId ];
          if (member) {
            slot = member.artifact.slots.find((s) => s.slotId === slotId);
          }
        }
      }
      return slot;
    }.bind(this);

    var slotId = targetElement.dataset.slot;
    var memberIdRef = targetElement.dataset.memberIdRef;
    var slot;
    if (memberIdRef) {
      slot = getMemberSlot(this._editingArtifact, memberIdRef, slotId);
    } else {
      if (this._editingArtifact.slots) {
        slot = this._editingArtifact.slots.find((s) => s.slotId === slotId);
      }
    }
    if (!slot) {
      return true;
    }
    // no type check if value is null or undefined
    if (value === null || value === undefined) {
      return true;
    }

    let parsedType = typeof value;
    if (parsedType === 'object' && Array.isArray(value)) {
      parsedType = 'array';
    }
    let type = slot.type;
    // no type check for  type = any
    if (type === 'any') {
      return true;
    }
    if (type !== parsedType) {
      targetElement.errorMessage = 'The content has the type "' + parsedType + '", but the required slot type is "' + type + '".';
      return false;
    }

    return true;
  },
  /**
   * Handler method of iron-select of slot types. Trigger the validation of the slot init value
   * @param {Event} evt iron-select event
   * @private
   */
  _validateInitForType: function (evt) {
    let slotId = evt.target.dataset.slotId;
    let slotInit = this._editingArtifact.inits.find((init) => init.slot === slotId && !init.memberIdRef);
    if (!slotInit) { // no initialisierung exists for this slot
      return;
    }
    let initValueElement = this.$$('[data-slot=' + slotId + ']:not([data-member-id-ref])');
    if (initValueElement) {
      initValueElement.validate();
    }
  },
  _validatorName: function (index) {
    return 'validInitValue' + index;
  },
  /**
   * Helper function, fits the dialog to window.
   *
   * @method _validFormChanged
   */
  _validFormChanged: function () {
    this.$.compoundDialog.fit();
  }
});
