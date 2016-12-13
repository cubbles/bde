// @importedBy bde-slot.html
/* globals _ */
Polymer({
  is: 'bde-slot-edit-dialog',

  properties: {

    /**
     * The artifact object, which is shown in dataflowview
     * @type Object
     * @property artifact
     */
    artifact: {
      type: Object,
      notify: true
    },

    /**
     * Indicate, if this dialog opened or not.
     * @type Boolean
     * @property dialogOpened
     */
    dialogOpened: {
      type: Boolean,
      notify: true,
      value: false
    },

    /**
     * The memberId of the member, which slot to be initialize
     * @type String
     * @property memberId
     */
    memberId: {
      type: String
    },

    /**
     * indicate the slot is a own slot of the shown component, and initialiser shoudn't have the property memberIdRef
     * @type Boolean
     * @property ownSlot
     */
    ownSlot: {
      type: Boolean,
      value: false
    },

    /**
     * The slot object.
     * @type Object
     * @property slot
     */
    slot: {
      type: Object,
      notify: true
    },

    /**
     * This a internal init description
     */
    _initDescription: {
      type: String,
      value: ''
    },
    /**
     * This a internal init membrIdRef
     */
    _initMemberIdRef: {
      type: String
    },
    /**
     * This a internal init value
     */
    _initValue: {
      type: String,
      value: null
    },
    /**
     * An internal _slot object
     * @type Object
     * @property _slot
     */
    _slot: {
      type: Object
    },

    /**
     * Indicate, that the form is valid.
     * @type Boolean
     * @property _validForm
     */
    _validForm: {
      type: Boolean,
      value: true
    }

  },

  listeners: {
    'editDialog.iron-overlay-opened': '_handleDialogOpened'
  },

  observers: [
    '_validFormChanged(_validForm)'
  ],

  ready: function () {
    // Bind the validator functions
    this._bindValidators();
  },

  onKeydown: function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      // this.set('initialiser.description', event.target.textContent);
      event.target.blur();
    }
  },

  /**
   * Stop send the form
   * @param event
   */
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
    this.$.validSlotId.validate = this._validateSlotId.bind(this);
  },

  /**
   * Save the formular data. Add this.Initialiser property values to the corresponding artifact.inits object, or add anew init object.
   * @private
   */
  _checkForSaveInit: function () {
    // this._initDataFormat();

    // Outputslot has no initialisation
    if (this._slot && this._slot.direction && this._slot.direction.length === 1 && this._slot.direction[ 0 ] === 'output') {
      return;
    }

    if (this._initValue === null) {
      this.$.editDialog.close();
      this.$.confirmStoreNullValue.open();
    } else {
      this._saveEditedInit();
    }
  },
  /**
   * Find the init object in artifact.
   * @param {object} slot
   * @returns {object|undefined} the found init object or undefined, if no init object exists for this slot in the artifact.
   * @private
   */
  _findInitializer: function (slot) {
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
    if (event.target !== event.currentTarget) {
      return;
    }

    var init = this._findInitializer(this.slot);
    if (!this.ownSlot) {
      this.set('_initMemberIdRef', this.memberId);
    } else {
      this.set('_initMemberIdRef', null);
    }

    if (init && init.description) {
      this.set('_initDescription', init.description);
    } else {
      this.set('_initDescription', '');
    }
    if (init && init.value) {
      this.set('_initValue', init.value);
    } else {
      this.set('_initValue', null);
    }
    if (this.ownSlot) {
      this.set('_slot', JSON.parse(JSON.stringify(this.slot)));
    }

    this.set('_validForm', this.$.editMemberSlotInitForm.validate());
  },
  _handleConfirmStoreNullValueDialogClosed: function (evt) {
    if (evt.detail.confirmed) {
      this._saveEditedInit();
    }
    if (this.ownSlot) {
      this._saveEditedSlot();
    }
    this.$.confirmStoreNullValue.close();
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


  _saveEditedInit: function () {
    var init = this._findInitializer(this.slot);
    if (!init) {
      // Create a temporare initialiser object for the dialog
      var newInitialiser = {
        slot: this.slot.slotId
      };
      if (this._initDescription.length !== 0) {
        newInitialiser.description = this._initDescription;
      }
      if (this._initMemberIdRef) {
        newInitialiser.memberIdRef = this._initMemberIdRef;
      }
      newInitialiser.value = this._initValue;
      if (!this.artifact.inits) {
        this.set('artifact.inits', []);
      }
      this.push('artifact.inits', newInitialiser);
    } else {
      var path = Polymer.Collection.get(this.artifact.inits).getKey(init);
      if (this._initDescription && this._initDescription.length > 0) {
        this.set('artifact.inits.' + path + '.description', this._initDescription);
      }
      this.set('artifact.inits.' + path + '.value', this._initValue);
    }
  },
  /**
   * Save the edited slot values
   * @private
   */
  _saveEditedSlot: function () {
    if (!_.isEqual(this.slot, this._slot)) {
      var slotIdChanged = false;
      var slotDescriptionChanged = false;
      var slotPath;
      if (this.slot.slotId !== this._slot.slotId) {
        slotIdChanged = true;
      }
      if (this._slot.description !== this.slot.description) {
        slotDescriptionChanged = true;
      }
      if (slotIdChanged || slotDescriptionChanged) {
        let slot = this.artifact.slots.find((sl) => sl.slotId === this.slot.slotId);
        slotPath = new Polymer.Collection(this.artifact.slots).getKey(slot);
      }
      if (slotIdChanged) {
        // Change the slotId in existing inits
        if (this.artifact.inits) {
          let inits = this.artifact.inits.filter((init) => !init.memberIdRef && init.slot === this.slot.slotId);
          inits.forEach((init) => { init.slot = this._slot.slotId; });
        }
        // check if an other slot exists with the same name, if exist, markd this slot for delete
        var otherSlot = this.artifact.slots.find((s) => s.slotId === this._slot.slotId);
        if (otherSlot) {
          this.slot.markedForDelete = true;
        }
        this.slot.slotId = this._slot.slotId;

        this.notifyPath('artifact.slots.' + slotPath + '.slotId', this._slot.slotId);
      }

      if (slotDescriptionChanged) {
        this.slot.description = this._slot.description;
        this.notifyPath('artifact.slots.' + slotPath + '.description', this._slot.description);
      }
    }
  },

  /**
   * Validate the formular inputs, and by valid values save this to the artifact.
   * @private
   */
  _validateAndSave: function () {
    if (this.$.editMemberSlotInitForm.validate()) {
      this.set('_validForm', true);
      this._checkForSaveInit();
      if (this.ownSlot) {
        this._saveEditedSlot();
      }
      this.$.editDialog.close();
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
  },

  _validateSlotId: function (value) {
    if (this.ownSlot) {
      var slotId = value;
      var matches = slotId.match(/^[a-z][a-zA-Z0-9]*$/);
      return value != null && value.trim().length > 0 && matches;
    } else {
      return true;
    }
  },
  /**
   * Fit the dialog, if show or dissapear the Error message.
   * @private
   */
  _validFormChanged: function () {
    this.$.editDialog.fit();
  }
});
