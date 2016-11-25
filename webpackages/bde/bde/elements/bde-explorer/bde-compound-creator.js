// @importedBy bde-compound-creator.html

Polymer({
  is: 'bde-compound-creator',

  properties: {

    /**
     * Opened attribute of the inherent paper-input.
     *
     * @type {Boolean}
     * @property
     */
    opened: {
      type: Boolean,
      notify: true
    },

    /**
     * Last artifact of the bde-explorer. so the new compound can be set as the last artifact.
     *
     * @type {Object}
     * @property
     */
    lastArtifact: {
      type: Object,
      notify: true
    },

    /**
     * The manifest metadata of the current project.
     *
     * @type {Object}
     * @property manifest
     */
    manifest: {
      type: Object,
      notify: true
    },
    /**
     * Helper flag to determine if the form is valid, if not it should be validated.
     *
     * @type {Boolean}
     * @property
     * @private
     */
    _valid: {
      type: Boolean,
      value: false
    }
  },

  listeners: {
    'iron-form-presubmit': '_handleFormPresubmit',
    'input': '_handleInput',
    'newCompoundDialog.iron-overlay-closed': '_handleDialogClosed'
  },

  /**
   * Polymer ready function. Calls _bindValidators function.
   *
   * @method ready
   */
  ready: function () {
    this._bindValidators();
  },

  /**
   * Sets opened to false, invokes closing of the dialog.
   *
   * @method close
   */
  close: function () {
    this.opened = false;
  },

  /**
   * Sets opened to true, invokes opening of the dialog.
   *
   * @method open
   */
  open: function () {
    this.opened = true;
  },
  /**
   * Binds a custom validator to the _validateJson function.+
   *
   * @param  {[type]} event [description]
   * @method _bindValidators
   */
  _bindValidators: function (event) {
    this.$.componentValidArtifactId.validate = this._validateArtifactId.bind(this);
  },
  /**
   * Sets the metadata of the newly added compound component.
   *
   * @param  {[Object]} obj [description]
   * @return {[Object]}     [Cubbles compound component]
   */
  _compoundFrom: function (obj) {
    var compound = {
      artifactId: null,
      artifactType: 'compoundComponent',
      description: null,
      runnables: [],
      resources: [],
      dependencies: [],
      slots: [],
      members: [],
      connections: [],
      inits: []
    };

    Object.keys(obj).forEach((k) => { compound[ k ] = obj[ k ]; });

    return compound;
  },

  /**
   * Submits the forms data.
   *
   * @param  {[Event]} event [Closing event of the iron-overlay]
   * @method _handleDialogClosed
   */
  _handleDialogClosed: function (event) {
    var reason = event.detail;

    // User clicked 'add'
    if (reason.confirmed) {
      if (this.$.form.validate()) {
        this.$.form.submit();
      } else {
        // This should never happen
        event.preventDefault();
        return;
      }
    }

    // Reset the form only if the user clicked 'cancel'
    if (!reason.canceled && !reason.confirmed) {
      this.$.form.reset();
    }
  },

  /**
   * Set the 'lastArtifact' with serialized data from the input and closes the dialog.
   *
   * @param  {[Event]} event [iron-form-presubmit event]
   * @method _handleFormPresubmit
   */
  _handleFormPresubmit: function (event) {
    event.preventDefault();
    this.set('lastArtifact', this._compoundFrom(this.$.form.serialize()));
    this.fire('bde-current-artifact-change');
    this.close();
  },

  /**
   * Validates the input of the form, if the _valid helper is not set to true, validates against pattern attribute.
   *
   * @param  {[Event]} e [Input event]
   * @method _handleInput
   */
  _handleInput: function (e) {
    this._valid = this.$.form.validate();
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

    if (this.manifest && this.manifest.artifacts) {
      var artifactsIds = [];
      var artifacts = this.manifest.artifacts;

      Object.keys(artifacts).forEach(function (artifactType) {
        artifacts[ artifactType ].forEach(function (artifact) {
          artifactsIds.push(artifact.artifactId);
        });
      });

      var foundArtifactIds = artifactsIds.filter((id) => id === artifactId);

      if (foundArtifactIds.length > 0) {
        unique = false;
      }
    }
    return matches && unique;
  }

});
