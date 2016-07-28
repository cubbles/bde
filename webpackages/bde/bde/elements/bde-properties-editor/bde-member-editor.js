Polymer({
  is: 'bde-member-editor',

  properties: {
    artifact: {
      type: Object,
      notify: true
    },

    componentId: {
      type: String
    },

    resolutions: {
      type: Object
    },

    memberId: {
      type: String
    },

    member: {
      type: Object,
      notify: true
    }
  },

  observers: [
    'artifactChanged(artifact, componentId, memberId)'
  ],

  artifactChanged: function (artifact, componentId, memberId) {
    var artifactId = componentId.split('/')[ 1 ];
    var member = artifact.members.find(function (member) {
      return member.memberId === memberId;
    });

    var metadata = this.resolutions[ artifactId ] || {};

    Object.keys(metadata).forEach(function (key) {
      member[ key ] = metadata[ key ];
    });

    this.set('member', member);
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
    return member.displayName || member.memberId;
  },

  _hasEntries: function (inArr) {
    return (inArr && inArr.length && inArr.length > 0);
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
