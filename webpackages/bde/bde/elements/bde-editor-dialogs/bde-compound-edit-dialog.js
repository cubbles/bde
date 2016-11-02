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
     * Temporary artifact for the edit dilaog. If the dialog is saved, it should add the changes to the artifact property.
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

  _handleDialogOpened: function (event) {
    this.set('_artifact.artifactId', this.artifact.artifactId);
    this.set('_artifact.description', this.artifact.description);
  },
  _handleDialogClosed: function (event) {
    if (event.detail.confirmed) {
      this._save();
    }
  },
  _save: function () {
    if (this._artifact.artifactId !== this.artifact.artifactId) {
      this.set('artifact.artifactId', this._artifact.artifactId);
    }
    if (this._artifact.description !== this.artifact.description) {
      this.set('artifact.description', this._artifact.description);
    }
  }
});
