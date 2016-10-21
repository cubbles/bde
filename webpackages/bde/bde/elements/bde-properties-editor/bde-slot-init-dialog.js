// @importedBy bde-slot.html

Polymer({
  is: 'bde-slot-init-dialog',

  properties: {
    slot: {
      type: Object,
      notify: true
    },
    memberId: {
      type: Object
    },
    dialogOpened: {
      type: Boolean,
      notify: true
    },
    _initialiser: {
      type: Object
    },
    /**
     * indicate the slot is a own slot of the shown component, and initialiser shoudn't have the property memberIdRef
     */
    ownSlot: {
      type: Boolean,
      value: false
    },

    artifact: {
      type: Object,
      notify: true
    },
    _validForm: {
      type: Boolean,
      value: true
    }

  },
  listeners: {
    'initDialog.iron-overlay-opened': '_handleDialogOpened',
    'otherInitValue.change': '_handleOtherInitValueChanged'
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

  _bindValidators: function (event) {
    this.$.validJson.validate = this._validateJson.bind(this);
  },
  _findInitializer: function (slot) {
    // TODO für ownSlots anpassen
    var init;
    if (this.artifact.inits) {
      init = this.artifact.inits.find(function (init) {
        return init.memberIdRef === this.memberId &&
          init.slot === slot.slotId;
      }, this);
    }
    // var info = {};
    // var path = new Polymer.Collection(this.artifact.inits).getKey(init);
    // var arrayPath = this._get('this.artifact.inits' + path, this, info);
    // this.linkPaths(initializer, info.path);
    return init;
  },

  _handleDialogOpened: function (event) {
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
  },

  _handleOtherInitValueChanged: function (event) {
    console.log('_handleOtherInitValueChanged value', this.$.otherInitValue.value);
    try {
      this._initialiser.value = JSON.parse(this.$.otherInitValue.value);
    } catch (err) {
      console.log(err);
    }
  },
  _saveEditedInit: function () {
    var init = this._findInitializer(this.slot);
    if (!init) {
      if (this._initialiser.description.length === 0) {
        delete this._initialiser.description;
      }
      if (!this.artifact.inits) {
        this.artifact.inits = [];
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

  _serializeBoolean: function (value) {
    return value ? 'checked' : '';
  },

  _serializeOther: function (value) {
    return JSON.stringify(value, null, 2);
  },

  _slotIsBoolean: function (slot) {
    return slot.type.toLowerCase() === 'boolean';
  },

  _slotIsNumber: function (slot) {
    return slot.type.toLowerCase() === 'number';
  },

  _slotIsText: function (slot) {
    return slot.type.toLowerCase() === 'string';
  },

  _slotIsOther: function (slot) {
    return !this._slotIsBoolean(slot) && !this._slotIsNumber(slot) && !this._slotIsText(slot);
  },
  _validateAndSave: function () {
    if (this.$.editMemberSlotInitForm.validate()) {
      this._saveEditedInit();
      this.$.initDialog.close();
    } else {
      this.set('_validForm', false);
    }
  },
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
