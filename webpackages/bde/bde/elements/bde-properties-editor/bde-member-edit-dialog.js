// @importedBy bde-member-edit-dialog.html

Polymer({
  is: 'bde-member-edit-dialog',
  properties: {
    member: {
      type: Object,
      notify: true
    },
    _member: {
      type: Object
    },
    dialogOpened: {
      type: Boolean,
      notify: true
    }
  },

  _handleDialogOpened: function (event) {
    // Create a temporare initialiser object for the dialog
    var _member = {
      memberId: this.member.memberId,
      componentId: this.member.componentId
    };
    if (this.member.displayName) {
      _member.displayName = this.member.displayName;
    }
    if (this.member.description) {
      _member.description = this.member.description;
    }
    this.set('_member', _member);
  },

  _handleDialogClosed: function (event) {
    if (event.detail.confirmed) {
      this._saveEditedMember();
    }
  },
  _saveEditedMember: function () {
    this.set('member.displayName', this._member.displayName);
    this.set('member.description', this._member.description);
    this.notifyPath('member');

    // TODO update display name in graph
  }
});
