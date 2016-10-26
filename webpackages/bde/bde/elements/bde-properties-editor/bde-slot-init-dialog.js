// @importedBy bde-slot.html

Polymer({
  is: 'bde-slot-init-dialog',

  properties: {

    /**
     * The artifact object, which is shown in dataflowview
     * @type Object
     */
    artifact: {
      type: Object,
      notify: true
    },

    /**
     * Indicate, if this dialog opened or not.
     * @type Boolean
     */
    dialogOpened: {
      type: Boolean,
      notify: true,
      value: false
    },

    /**
     * The memberId of the member, which slot to be initialize
     * @type String
     */
    memberId: {
      type: String
    },

    /**
     * indicate the slot is a own slot of the shown component, and initialiser shoudn't have the property memberIdRef
     * @type Boolean
     * // TODO is this nessecary?
     */
    ownSlot: {
      type: Boolean,
      value: false
    },

    /**
     * The slot object.
     * @type Object
     */
    slot: {
      type: Object,
      notify: true
    },

    /**
     * This internal init object. The form save the data in this internal object. The values will tranfer to manifest just by save action.
     * @type Object
     */
    _initialiser: {
      type: Object
    },

    _slot: {
      type: Object
    },
    /**
     * Indicate, that the form is valid.
     * @type Boolean
     */
    _validForm: {
      type: Boolean,
      value: true
    }

  },
  listeners: {
    'slotInitDialog.iron-overlay-opened': '_handleDialogOpened',
    'objectInitValue.change': '_handleObjectInitValueChanged'
  },

  ready: function () {
    this._bindValidators();
  },

  onKeydown: function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // this.set('initialiser.description', event.target.textContent);
      event.target.blur();
    }
  },

  onPreSubmit: function (event) {
    // Don't try to send the form
    event.preventDefault();
  },

  /**
   * Bind the validator function to the validator element.
   * @private
   */
  _bindValidators: function () {
    this.$.validJson.validate = this._validateJson.bind(this);
  },

  /**
   * Find the init object in artifact.
   * @param {object} slot
   * @returns {object|undefined} the found init object or undefined, if no init object exists for this slot in the artifact.
   * @private
   */
  _findInitializer: function (slot) {
    // TODO für ownSlots anpassen
    var init;
    if (this.artifact.inits) {
      init = this.artifact.inits.find(function (init) {
        return init.memberIdRef === this.memberId &&
          init.slot === slot.slotId;
      }, this);
    }
    return init;
  },

  /**
   * Initialise the dialog after this was opened.
   * @param (Event}event dialog open event
   * @private
   */
  _handleDialogOpened: function (event) {
    console.log('_handleDialogOpened');
    // Create a temporare initialiser object for the dialog
    var newInitialiser = {

      slot: this.slot.slotId,
      description: '',
      value: null
    };

    var init = this._findInitializer(this.slot);
    if (!this.ownSlot) {
      newInitialiser.memberIdRef = this.memberId;
    }
    if (init && init.description) {
      newInitialiser.description = init.description;
    }
    if (init && init.value) {
      newInitialiser.value = init.value;
    }
    this.set('_initialiser', newInitialiser);
    if (this.ownSlot) {
      this.set('_slot', JSON.parse(JSON.stringify(this.slot)));
    }
  },
  /**
   * Handle change the value, if the slot type array or object.
   * @param {Event} event
   * @private
   */
  _handleObjectInitValueChanged: function (event) {
    console.log('_handleObjectInitValueChanged value', this.$.objectInitValue.value);
    try {
      this._initialiser.value = JSON.parse(this.$.objectInitValue.value);
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * Check, if the slot is an input slot.
   * @param {object} slot the slot object
   * @returns {boolean}
   * @private
   */
  _isInputSlot: function (slot) {
    return !slot.direction || slot.direction.includes('input');
  },

  /**
   * Save the formular data. Add this.Initialiser property values to the corresponding artifact.inits object, or add anew init object.
   * @private
   */
  _saveEditedInit: function () {
    var init = this._findInitializer(this.slot);
    if (!init) {
      if (this._initialiser.description.length === 0) {
        delete this._initialiser.description;
      }
      if (!this.artifact.inits) {
        this.set('artifact.inits', []);
      }
      this.push('artifact.inits', this._initialiser);
    } else {
      var path = Polymer.Collection.get(this.artifact.inits).getKey(init);
      if (this._initialiser.description && this._initialiser.description.length > 0) {
        this.set('artifact.inits.' + path + '.description', this._initialiser.description);
      }
      this.set('artifact.inits.' + path + '.value', this._initialiser.value);
    }
  },

  _saveEditedSlot: function () {
    var slotIdChanged = false;
    var slotDescriptionChanged = false;
    if (this.slot.slotId !== this._slot.slotId) {
      slotIdChanged = true;
    }
    if (this._slot.description !== this.slot.description) {
      slotDescriptionChanged = true;
    }
    if (slotIdChanged || slotDescriptionChanged) {
      var slot = this.artifact.slots.find((sl) => sl.slotId === this.slot.slotId);
      var slotPath = new Polymer.Collection(this.artifact.slots).getKey(slot);
    }
    if (slotIdChanged) {
      this.slot.slotId = this._slot.slotId;
      this.notifyPath('artifact.slots.' + slotPath + '.slotId', this._slot.slotId);
    }

    if (slotDescriptionChanged) {
      this.slot.description = this._slot.description;
      this.notifyPath('artifact.slots.' + slotPath + '.description', this._slot.description);
    }
  },

  /**
   * Serialise the boolean value. (true -> checked, false -> ''
   * @param {boolean} value the value
   * @returns {string} serialised value
   * @private
   */
  _serializeBoolean: function (value) {
    return value ? 'checked' : '';
  },

  /**
   * Serialise an object or an array.
   * @param {object|array}value
   * @private
   */
  _serializeObject: function (value) {
    return JSON.stringify(value, null, 2);
  },

  /**
   * Check if the slot type is boolean.
   * @param {object}slot the slot object
   * @returns {boolean}
   * @private
   */
  _slotIsBoolean: function (slot) {
    return slot.type && slot.type.toLowerCase() === 'boolean';
  },

  /**
   * Check if the slot type is number.
   * @param slot
   * @returns {boolean}
   * @private
   */
  _slotIsNumber: function (slot) {
    return slot.type && slot.type.toLowerCase() === 'number';
  },

  /**
   * Check if the slot type is string.
   * @param {object}slot the slot object
   * @returns {boolean}
   * @private
   */
  _slotIsString: function (slot) {
    return slot.type && slot.type.toLowerCase() === 'string';
  },
  /**
   * Check if the slot type is not string, number or boolean.
   * @param {object}slot the slot object
   * @returns {boolean}
   * @private
   */
  _slotIsObject: function (slot) {
    return !this._slotIsBoolean(slot) && !this._slotIsNumber(slot) && !this._slotIsString(slot);
  },
  /**
   * Validate the formular inputs, and by valid values save this to the artifact.
   * @private
   */
  _validateAndSave: function () {
    if (this.$.editMemberSlotInitForm.validate()) {
      if (this.ownSlot) {
        this._saveEditedSlot();
      }
      this._saveEditedInit();
      this.$.slotInitDialog.close();
    } else {
      this.set('_validForm', false);
    }
  },
  /**
   * Validate the input as a valid json.
   * @param {*} value
   * @returns {boolean}
   * @private
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
  }
});
