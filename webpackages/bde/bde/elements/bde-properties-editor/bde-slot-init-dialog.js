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
      type: Object
    }

  },
  listeners: {
    'initDialog.iron-overlay-closed': '_handleDialogClosed',
    'initDialog.iron-overlay-opened': '_handleDialogOpened'
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

  _handleDialogClosed: function (event) {
    console.log('dialog closed!!!!!!!!', event);
    var init = this._findInitializer(this.slot);
    if (!init) {
      if (this._initialiser.description.length === 0) {
        delete this._initialiser.description;
      }
      if (!this.artifact.inits) {
        this.artifact.inits = [];
      }
      this.artifact.inits.push(this._initialiser);
    } else {
      if (this._initialiser.description && this._initialiser.description.length > 0) {
        var path = Polymer.Collection('this.artifact.inits').getKey(init);
        this.set('this.artifact.inits.' + path + '.description', this._initialiser.description);
      }
      this.set('this.artifact.inits.' + path + '.value', this._initialiser.value);
    }
  },

  _serialize: function (value) {
    return value ? 'checked' : '';
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
  }
});
