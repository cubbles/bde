// @importedBy bde-connection-edit-dialog.html

Polymer({
  is: 'bde-connection-edit-dialog',
  properties: {

    /**
     * The current connection object.
     * @type Object
     * @property artifact
     */
    connection: {
      type: Object,
      notify: true
    },

    /**
     * property for dialog open.
     * @type Boolean
     * @default false
     * @property dialogOpened
     */
    dialogOpened: {
      type: Boolean,
      value: false
    },
    /**
     * Temporary connection for the edit dialog. If the dialog is saved, it should add the changes to the connection property.
     * @type Object
     * @property _connectin
     * @private
     */
    _connection: {
      type: Object,
      value: function () {
        return {};
      }
    }
  },
  /**
   * Stop send the form
   * @param event
   */
  onPreSubmit: function (event) {
    // Don't try to send the form
    event.preventDefault();
  },

  /**
   * Evaluates the checked 'copy' field to set a copyValue flag.
   *
   * @param  {[type]} connection [description]
   * @return {[Boolean]}            [copyValue flag]
   * @method _copyValue
   */
  _copyValue: function (connection) {
    if (connection && typeof connection.copyValue === 'undefined') {
      connection.copyValue = true;
    }
    return connection.copyValue;
  },
  /**
   * This handler method is called after the copy value checkbox is changed.
   * @param {Event} evt change event
   * @private
   */
  _copyValueChanged: function (evt) {
    if (evt.target.checked) {
      this.set('_connection.copyValue', true);
    } else {
      this.set('_connection.copyValue', false);
    }
  },
  /**
   * Evaluates the checked 'copy' field to set a copyValue flag.
   *
   * @param  {[type]} connection [description]
   * @return {[Boolean]}            [copyValue flag]
   * @method _copyValue
   */
  _repeatedValues: function (connection) {
    if (connection && typeof connection.repeatedValues === 'undefined') {
      connection.repeatedValues = false;
    }
    return connection.repeatedValues;
  },
  /**
   * This handler method is called after the repeated values checkbox is changed.
   * @param {Event} evt change event
   * @private
   */
  _repeatedValuesChanged: function (evt) {
    if (evt.target.checked) {
      this.set('_connection.repeatedValues', true);
    } else {
      this.set('_connection.repeatedValues', false);
    }
  },
  /**
   * Handler method after dialog opened
   * @param event
   * @private
   */
  _handleDialogOpened: function (event) {
    // this.set('_connection.connectionId', this.connection.connectionId);
    // this.set('_connection.description', this.connection.description);
    // if (typeof this.connection.hookFunction !== 'undefined') {
    //   this.set('_connection.hookFunction', this.connection.hookFunction);
    // }
    // if (typeof this.connection.copyValue !== 'undefined') {
    //   this.set('_connection.copyValue', this.connection.copyValue);
    // }
    // if (typeof this.connection.repeatedValues !== 'undefined') {
    //   this.set('_connection.repeatedValues', this.connection.repeatedValues);
    // }
    this.set('_connection', JSON.parse(JSON.stringify(this.connection)));
  },
  /**
   * Handler method after dialog closed.
   * @param event
   * @private
   */
  _handleDialogClosed: function (event) {
    if (event.detail.confirmed) {
      this._save();
    }
  },
  /**
   * Save the chaged properties to connection object.
   * @private
   */
  _save: function () {
    if (this._connection.connectionId !== this.connection.connectionId) {
      this.set('connection.connectionId', this._connection.connectionId);
    }
    if (this._connection.description !== this.connection.description) {
      this.set('connection.description', this._connection.description);
    }
    if (this._connection.hookFunction !== this.connection.hookFunction) {
      this.set('connection.hookFunction', this._connection.hookFunction);
    }
    if (this._connection.copyValue !== this.connection.copyValue) {
      this.set('connection.copyValue', this._connection.copyValue);
    }
    if (this._connection.repeatedValues !== this.connection.repeatedValues) {
      this.set('connection.repeatedValues', this._connection.repeatedValues);
    }
  }
});
