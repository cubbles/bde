// @importedBy bde-member-edit-dialog.html

Polymer({
  is: 'bde-member-edit-dialog',
  properties: {
    /**
     * The current selected artifact
     * @type Object
     */
    artifact: {
      type: Object
    },

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

  observers: [
    '_memberPropsChanged(member.*)'
  ],

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

  _memberPropsChanged: function (changeRecord) {
    if (this.member && changeRecord.path.indexOf('member.') > -1) {
      var key = Polymer.Collection.get(this.artifact.members).getKey(this.member);
      let path = changeRecord.path.match(/member\.(\S*)$/);
      let prop = path[ 1 ];
      this.set('artifact.members.' + key + '.' + prop, this.member[prop]);
    }
  },
  /**
   * Save the edited values of _member to member
   * @private
   */
  _saveEditedMember: function () {
    if (this.member.displayName !== this._member.displayName) {
      this.set('member.displayName', this._member.displayName);
    }
    if (this.member.description !== this._member.description) {
      this.set('member.description', this._member.description);
    }
    // Set the memberId and update references in connections and inits
    if (this.member.memberId !== this._member.memberId) {
      // create annd add new memberObject
      var newMember = JSON.parse(JSON.stringify(this._member));
      newMember.artifactId = newMember.componentId.split('/')[1];
      this.push('artifact.members', newMember);
      // Update connections
      if (this.artifact.connections) {
        // Update connection: add a new connection and remove the old connection -> eventlistener for the graph works
        let connections = this.artifact.connections.filter((c) => c.source.memberIdRef === this.member.memberId);
        connections.forEach((connection) => {
          let newConnection = JSON.parse(JSON.stringify(connection));
          newConnection.source.memberIdRef = this._member.memberId;
          var index = this.artifact.connections.indexOf(connection);
          this.push('artifact.connections', newConnection);
          this.splice('artifact.connections', index, 1);
        });
        connections = this.artifact.connections.filter((c) => c.destination.memberIdRef === this.member.memberId);
        connections.forEach((connection) => {
          let newConnection = JSON.parse(JSON.stringify(connection));
          newConnection.destination.memberIdRef = this._member.memberId;
          let index = this.artifact.connections.indexOf(connection);
          this.push('artifact.connections', newConnection);
          this.splice('artifact.connections', index, 1);
        });
      }
      if (this.artifact.inits) {
        let inits = this.artifact.inits.filter((i) => i.memberIdRef === this.member.memberId);
        inits.forEach((init) => {
          let newInit = JSON.parse(JSON.stringify(init));
          newInit.memberIdRef = this._member.memberId;
          let index = this.artifact.inits.indexOf(init);
          this.push('artifact.inits', newInit);
          this.splice('artifact.inits', index, 1);
        });
      }
      let index = this.artifact.members.findIndex((member) => member === this.member);
      this.splice('artifact.members', index, 1);
      // Set the memberId
      this.set('member', newMember);
      // Trigger autolayout
      this.fire('bde-want-autolayout');
    }
  }
});
