// @importedBy bde-member-edit-dialog.html

Polymer({
  is: 'bde-member-edit-dialog',
  properties: {
    /**
     *  The member object, referenced in the current artifact
     *  @type Object
     *  @property memr
     */
    member: {
      type: Object,
      notify: true
    },
    /**
     * Internal member object for editing. The save action updated th origin member object with values from this object.
     * @type Object
     * @property _member
     */
    _member: {
      type: Object
    },

    /**
     * Indicator, if the dialog is opened
     * @type Boolean
     * @default false,
     * @property dialogOpened
     */
    dialogOpened: {
      type: Boolean,
      notify: true,
      value: false
    }
  },

  /**
   * Handler method calld after the dialog is opened.
   * Initialze the _member object with values of member
   * @param {Event} event Event
   * @private
   */
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

  /**
   * Handle method after the dialog closed
   * @param {Event} event Event
   * @private
   */
  _handleDialogClosed: function (event) {
    if (event.detail.confirmed) {
      this._saveEditedMember();
    }
  },
  /**
   * Save the edited values of _member to member
   * @private
   */
  _saveEditedMember: function () {
    this.set('member.displayName', this._member.displayName);
    this.set('member.description', this._member.description);
    this.notifyPath('member');
  }
});
