// @importedBy bde-explorer-details.html
/* global _*/
Polymer({
  is: 'bde-explorer-details',
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
    'change': '_handleChangedInitValue'
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
    this.set('_editingArtifact', JSON.parse(JSON.stringify(this.artifact)));
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
    this.splice(path, itemIndex, 1);
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
        this.set('artifact', this._editingArtifact);
        this.set('manifest.artifacts.' + this.artifactType + 's.' + this.artifactIndex, this._editingArtifact);
        this.fire('bde-dataflow-view-reload-required');
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
   * Binds a custom validator to the _validateJson function.+
   *
   * @param  {[type]} event [description]
   * @method _bindValidators
   */
  _bindValidators: function (event) {
    var validatorElement = this.querySelector('.validJson');
    validatorElement.validate = this._validateJson.bind(this);
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
      case 'endpointResource':
        return { prod: '', dev: '' };
      case 'endpointDependency':
        newIndex = this.get(path).length;
        return '[groupId]/name@version/artifactId/endpoint' + newIndex;
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
          source: { memberIdRef: '', slot: '' },
          destination: { memberIdRef: '', slot: '' },
          copyValue: false,
          repeatedValues: false,
          hookFunction: '',
          description: ''
        };
      case 'init':
        return { memberIdRef: '', slot: '', value: '', description: '' };
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
   * Returns id for the element.
   *
   * @param  {[type]} index [description]
   * @return {[String]}       [id]
   * @method _initTextareaValidatorId
   */
  _initTextareaValidatorId: function (index) {
    return 'validJson' + index;
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

  // _serialize: function (value) {
  //   if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
  //     return JSON.stringify(value, null, 2);
  //   }
  //   return value;
  // },

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
   * Custom JSON validator, checks if the pattern of a JSON file matches.
   *
   * @param  {[type]} value [description]
   * @return {[Boolean]}       [result of the validation]
   * @method _validateJson
   */
  _validateJson: function (value) {
    // validation code

    if (value && typeof value === 'string' && (value.trim().startsWith('{') || value.trim().startsWith('['))) {
      try {
        JSON.parse(value);
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
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
