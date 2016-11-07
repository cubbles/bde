// @importedBy bde-compound-edit-dialog.html

Polymer({
  is: 'bde-compound-edit-dialog',
  properties: {
    /**
     * The current artifact object.
     * @type Object
     * @property artifact
     */
    artifact: {
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
     * Temporary artifact for the edit dialog. If the dialog is saved, it should add the changes to the artifact property.
     * @type Object
     * @property _artifact
     * @private
     */
    _artifact: {
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
   * Handler method after dialog opened.
   * @param event
   * @private
   */
  _handleDialogOpened: function (event) {
    this.set('_artifact.artifactId', this.artifact.artifactId);
    this.set('_artifact.description', this.artifact.description);
  },
  /**
   * Handle method fter dialog closed.
   * @param event
   * @private
   */
  _handleDialogClosed: function (event) {
    if (event.detail.confirmed) {
      this._save();
    }
  },
  /**
   * Save the changed properties of _artifact to artifact
   * @private
   */
  _save: function () {

    if (this._artifact.artifactId !== this.artifact.artifactId) {
      // special handling for artifactId changes nessecary. If the artifactId changed, will the artifact selected without reset the graph and autolayout
      this.fire('bde-current-artifact-id-edited');
      this.set('artifact.artifactId', this._artifact.artifactId);
    }
    if (this._artifact.description !== this.artifact.description) {
      this.set('artifact.description', this._artifact.description);
    }
  }
});
