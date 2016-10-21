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
    'iron-form-presubmit': 'handleFormPresubmit',
    'input': 'handleInput',
    'newCompoundDialog.iron-overlay-closed': 'handleDialogClosed'
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
   * Submits the forms data.
   *
   * @param  {[Event]} event [Closing event of the iron-overlay]
   * @method handleDialogClosed
   */
  handleDialogClosed: function (event) {
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
   * @method handleFormPresubmit
   */
  handleFormPresubmit: function (event) {
    event.preventDefault();
    this.set('lastArtifact', this._compoundFrom(this.$.form.serialize()));
    this.close();
  },

  /**
   * Validates the input of the form, if the _valid helper is not set to true, validates against pattern attribute.
   *
   * @param  {[Event]} e [Input event]
   * @method handleInput
   */
  handleInput: function (e) {
    this._valid = this.$.form.validate();
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
      endpoints: [{
        endpointId: 'main',
        resources: [],
        dependencies: []
      }],
      slots: [],
      members: [],
      connections: [],
      inits: []
    };

    Object.keys(obj).forEach((k) => { compound[k] = obj[k]; });

    return compound;
  }

});
