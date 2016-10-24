// @importedBy bde-member-info.html

Polymer({
  is: 'bde-member-info',

  properties: {
    artifact: {
      type: Object,
      notify: true
    },
    member: {
      type: Object,
      notify: true
    },
    memberDialogOpened: {
      type: Boolean
    },
    _dummy: {
      type: String
    },
    _memberName: {
      type: String,
      // dummy attribute for notify changes in deep properties
      computed: '_getMemberName(member, _dummy)'
    }
  },

  observers: [
    'memberPropsChanged(member.*)'
  ],

  handleSlotChange: function (event) {

  },

  memberPropsChanged: function (changeRecord) {
    // set dumme attribute for signalise a change in dep properties for the computed property _memberName
    this.set('_dummy', new Date().getTime());
    if (this.member && changeRecord.path === 'member.displayName') {
      var key = Polymer.Collection.get(this.artifact.members).getKey(this.member);
      this.set('artifact.members.' + key + '.displayName', this.member.displayName);
    }
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
    return !this._slotIsBoolean(slot) && !this._slotIsNumber(slot) && !this._slotIsTxt(slot);
  },

  _slotIsText: function (slot) {
    return slot.type === 'string';
  }
});
