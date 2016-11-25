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
     * The metadata of the current component with properies artifactId and manifest object.
     * @type Object
     */
    currentComponentMetadata: {
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
    },

    /**
     * Indicate, that the form is valid.
     * @type Boolean
     * @property _validForm
     */
    _validForm: {
      type: Boolean,
      value: true
    }
  },

  observers: [
    '_validFormChanged(_validForm)'
  ],

  ready: function () {
    // Bind the validator functions
    this._bindValidators();
  },
  /**
   * Stop send the form
   * @param event
   */
  _onPreSubmit: function (event) {
    // Don't try to send the form
    event.preventDefault();
  },

  _bindValidators: function () {
    this.$.validArtifactId.validate = this._validateArtifactId.bind(this);
  },

  /**
   * Handler method after dialog opened.
   * @param event
   * @private
   */
  _handleDialogOpened: function (event) {
    this.set('_artifact.artifactId', this.artifact.artifactId);
    this.set('_artifact.description', this.artifact.description);
    this.set('_validForm', this.$.compoundEditForm.validate());
  },
  /**
   * Handle method fter dialog closed.
   * @param event
   * @private
   */
  _handleDialogClosed: function (event) {
    if (!event.detail.confirmed) {
      this._resetErrors();
    }
  },

  /**
   * Reset the invalid property on validated elements
   * @private
   */
  _resetErrors: function () {
    var inputElement = this.$$('[validator=artifactIdValidator]');
    inputElement.invalid = false;
    this.set('_validForm',true);
  },
  /**
   * Save the changed properties of _artifact to artifact
   * @private
   */
  _validateAndSave: function () {
    if (this.$.compoundEditForm.validate()) {
      this.set('_validForm', true);
      if (this._artifact.artifactId !== this.artifact.artifactId) {
        // special handling for artifactId changes nessecary. If the artifactId changed, will the artifact selected without reset the graph and autolayout
        this.fire('bde-current-artifact-id-edited');
        this.set('artifact.artifactId', this._artifact.artifactId);
      }
      if (this._artifact.description !== this.artifact.description) {
        this.set('artifact.description', this._artifact.description);
      }
    }
    else {
      this.set('_validForm', false);
    }
  },

  /**
   * Custom validator for validate artifactId.
   *
   * @param {string} value edited value
   * @returns {Boolean} result of the validation
   * @private
   */
  _validateArtifactId: function (value) {
    var artifactId = value;
    var matches = artifactId.match(/^[a-z0-9]+(-[a-z0-9]+)+$/);
    var unique = true;

    if (this.currentComponentMetadata && this.currentComponentMetadata.manifest && this.currentComponentMetadata.manifest.artifacts) {
      var artifactsIds = [];
      var artifacts = this.currentComponentMetadata.manifest.artifacts;

      Object.keys(artifacts).forEach(function (artifactType) {
        artifacts[ artifactType ].forEach(function (artifact) {
          artifactsIds.push(artifact.artifactId);
        });
      });

      var arrayByUniqueArtifactIds = artifactsIds.filter((id) => id === artifactId);
      var index = arrayByUniqueArtifactIds.indexOf(this.artifact.artifactId);
      if (index > -1) {
        arrayByUniqueArtifactIds.splice(index, 1);
      }
      if (arrayByUniqueArtifactIds.length > 0) {
        unique = false;
      }
    }
    return matches && unique;
  },
  /**
   * Fit the dialog, if show or dissapear the Error message.
   * @private
   */
  _validFormChanged: function () {
    this.$.compoundDialog.fit();
  }
});
