Polymer({
  is: 'bde-member-editor',

  properties: {
    artifact: {
      type: Object,
      notify: true
    },
    member: {
      type: Object,
      notify: true
    }
  },

  handleSlotChange: function (event) {
    console.log(event);
  },

  onDescriptionChange: function (event) {
    this.set('member.description', event.target.textContent);
  },

  onInSlotChange: function (event) {

  },

  onOutSlotChange: function (event) {

  },

  onNameChange: function (event) {
    this.set('member.displayName', event.target.textContent);
  },

  _filterInslots: function (slot) {
    return (slot.direction.indexOf('input') !== -1);
  },

  _filterOutslots: function (slot) {
    return (slot.direction.indexOf('output') !== -1);
  },

  _getMemberName: function (member) {
    return member ? member.displayName || member.memberId : '';
  },

  _hasSlots: function (member) {
    return (member && member.metadata && member.metadata.slots && member.metadata.slots.length && member.metadata.slots.length > 0);
  },

  _slotIsBoolean: function (slot) {
    return slot.type === 'boolean';
  },

  _slotIsNumber: function (slot) {
    return slot.type === 'number';
  },

  _slotIsOther: function (slot) {
    return !this._slotIsBoolean(slot) && !this._slotIsNumber(slot) && !this._slotIsText(slot);
  },

  _slotIsText: function (slot) {
    return slot.type === 'string';
  }
});
