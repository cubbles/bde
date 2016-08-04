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

    dialogOpened: {
      type: Boolean,
      value: false
    },

    artifact: {
      type: Object,
      notify: true
    }
  },

  observers: [
    'artifactChanged(artifact.*)'
  ],

  artifactChanged: function (changeRecord) {
    console.log('bde-slot-info artifactChanged', changeRecord);
  },

  _getSlotIcon: function (slot) {
    return (this.direction === 'input') ? 'bde:inslot' : 'bde:outslot';
  },

  _isInputSlot: function () {
    return this.direction === 'input';
  }

});
