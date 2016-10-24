// @importedBy bde-slot-info.html

Polymer({
  is: 'bde-slot-info',

  properties: {
    direction: {
      type: String
    },

    slot: {
      type: Object
    },

    memberId: {
      type: Object
    },

    active: {
      type: Boolean,
      value: false
    },

    artifact: {
      type: Object,
      notify: true
    }

  },

  _inputSlotDialogButton: function () {
    this.fire('bde-edit-slot-init-dialog-open', {
      slot: this.slot,
      memberId: this.memberId
    });
  },
  _getSlotIcon: function (slot) {
    return (this.direction === 'input') ? 'bde:inslot' : 'bde:outslot';
  },

  _isInputSlot: function () {
    return this.direction === 'input';
  }

});
