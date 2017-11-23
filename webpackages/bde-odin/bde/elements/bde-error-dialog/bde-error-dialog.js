// @importedBy bde-settings.html
'use strict';

Polymer({
  is: 'bde-error-dialog',

  properties: {
    /**
     * Opened property for the encompassing paper-dialog element.
     *
     * @type {Boolean}
     * @property opened
     */
    opened: {
      type: Boolean,
      value: false
    },

    message: {
      type: String
    }

  }
});
