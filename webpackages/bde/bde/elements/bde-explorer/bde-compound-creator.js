// @importedBy bde-compound-creator.html

Polymer({
  is: 'bde-compound-creator',

  properties: {

    opened: {
      type: Boolean,
      notify: true
    },

    lastArtifact: {
      type: Object,
      notify: true
    },

    _valid: {
      type: Boolean,
      value: false
    }
  },

  listeners: {
    'iron-form-presubmit': 'handleFormPresubmit',
    'input': 'handleInput',
    'dialog.iron-overlay-closed': 'handleDialogClosed'
  },

  close: function () {
    this.opened = false;
  },

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

  handleFormPresubmit: function (event) {
    event.preventDefault();
    this.set('lastArtifact', this._compoundFrom(this.$.form.serialize()));
    this.close();
  },

  handleInput: function (e) {
    this._valid = this.$.form.validate();
  },

  open: function () {
    this.opened = true;
  },

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
