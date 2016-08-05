'use strict';

Polymer({
  is: 'bde-properties-editor',

  properties: {

    artifact: {
      type: Object,
      notify: true
    },

    manifest: {
      type: Object,
      notify: true
    },

    lastSelectedConnection: {
      type: Object,
      notify: true
    },

    lastSelectedMember: {
      type: Object,
      notify: true
    },

    resolutions: {
      type: Object,
      notify: true
    },

    selectedConnections: {
      type: Array
    },

    selectedMembers: {
      type: Array,
      notify: true
    },

    singleSelected: {
      type: Boolean,
      computed: 'singleSelection(selectedMembers.*)'
    }

  },

  observers: [
    '_selectedConnectionsChanged(selectedConnections.splices)',
    '_selectedMembersChanged(selectedMembers.splices)'
  ],

  singleSelection: function (members) {
    return (this.selectedMembers.length === 1);
  },

  _countInputSlots: function (member) {
    var count = 0;
    if (member && member.metadata) {
      count = member.metadata.slots.filter((slot) => !slot.direction || slot.direction.indexOf('input') > -1).length;
    }
    return count + ' input ' + ((count === 1) ? 'slot' : 'slots');
  },
  _countOutputSlots: function (member) {
    var count = 0;
    if (member && member.metadata) {
      count = member.metadata.slots.filter((slot) => !slot.direction || slot.direction.indexOf('output') > -1).length;
    }
    return count + ' output ' + ((count === 1) ? 'slot' : 'slots');
  },

  _getIcon: function (member) {
    return (member.metadata && member.metadata.icon) || 'cog';
  },

  _getMemberName: function (member) {
    return member.displayName || member.memberId;
  },

  _selectedConnectionsChanged: function (changeRecord) {

  },

  _selectedMembersChanged: function (changeRecord) {

  }

});
