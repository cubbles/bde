// @importedBy bde-store-settings.html
/* globals testStoreConnection,buildParamUrl */
'use strict';

Polymer({
  is: 'bde-store-settings',

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

    /**
     * Represents the global app settings. Used to set the store URL.
     *
     * @type {Object}
     * @property defaultSettings
     */
    defaultSettings: {
      type: Object,
      notify: true
    },

    /**
     * Boolean value returned after validating the store URL and name.
     *
     * @type {Boolean}
     * @property requestSuccess
     */
    requestSuccess: {
      type: Boolean
    },

    /**
     * Boolean set for valid settings after validating URL and name of the store.
     *
     * @type {Boolean}
     * @property validSettings
     */
    validSettings: {
      type: Boolean,
      value: true
    },

    location: {
      type: Object,
      notify: true
    }

  },

  listeners: {
    'iron-overlay-opened': '_handleOpened'
  },

  /* *****************************************************************************************/
  /* ********************************* public methods ****************************************/
  /* *****************************************************************************************/

  /**
   * Change the location.params.url .
   */
  changeUrlInLocation: function () {
    var url = this.$.baseUrl.value + '/' + this.$.storeName.value;
    testStoreConnection(url, function (success) {
      if (success) {
        this._setUrlInLocation();
        this.$.formDialog.close();
        this._showNotification('Store changed');
      } else {
        this._showErrorMessage('Store url is not valid. The connection test was unsuccessful');
      }
    }.bind(this));
  },

  /**
   * Validates the settings from the dialog field by calling an XMLHttpRequest for the given URL.
   *
   * @method _validateStoreSettings
   */
  validateStoreSettings: function () {
    var use = false;
    if (arguments.length > 2) {
      use = arguments[2];
    }
    if (this.$.storeForm.validate()) {
      var changeBaseUrl;
      var changeStoreName;
      if (this.defaultSettings.store !== this.$.storeName.value) {
        changeStoreName = true;
      }
      if (this.defaultSettings.baseUrl !== this.$.baseUrl.value) {
        changeBaseUrl = true;
      }
      // if changes occur, test them, change if true otherwise show an error
      if (changeBaseUrl || changeStoreName) {
        var url = this.$.baseUrl.value + '/' + this.$.storeName.value;
        testStoreConnection(url, function (success) {
          if (success) {
            this._saveStore(changeBaseUrl, changeStoreName);
            if (use) {
              this._useStore();
            }
            this.$.formDialog.close();
            this._showNotification('Store changed');
          } else {
            this._showErrorMessage('Store url is not valid. The connection test was unsuccessful');
          }
        }.bind(this));
      } else if (use) {
        this._useStore();
        this.$.formDialog.close();
      }
    }
  },

  validateStoreSettingsAndUse: function (...params) {
    this.validateStoreSettings(...params, true);
  },
  /* *****************************************************************************************/
  /* ********************************* private methods ***************************************/
  /* *****************************************************************************************/
  /**
   * Change the store URL by setting the data from the dialog input fields to the settings.
   *
   * @param  {[Boolean]} changeBaseUrl   [changed flag for the BaseUrl]
   * @param  {[Boolean]} changeStoreName [changed flag for the storeName]
   * @method _saveStore
   */
  _saveStore: function (changeBaseUrl, changeStoreName) {
    if (changeStoreName) {
      this.set('defaultSettings.' + this.$.storeName.name, this.$.storeName.value);
    }
    if (changeBaseUrl) {
      this.set('defaultSettings.' + this.$.baseUrl.name, this.$.baseUrl.value);
    }
    document.querySelector('bde-app').resetBDE();
  },

  /**
   * Confirmation of the base URL field via enter button focuses the storeName field.
   *
   * @param  {[Event]} e [keydown event]
   * @method _confirmBaseURL
   */
  _confirmBaseURL: function (e) {
    if (e.keyCode === 13) {
      this.$.storeName.focus();
    }
  },

  /**
   * Listener function for opening the dialog.
   *
   * @method _handleOpened
   */
  _handleOpened: function () {
    this.set('_intermediate', JSON.parse(JSON.stringify(this.defaultSettings)));
    this.set('validSettings', true);
  },

  /**
   * Pressing enter on the storeName field calls the _validateStoreSettings method.
   *
   * @param  {[Event]} e [keydown event]
   * @method _saveChanges
   */
  _saveChanges: function (e) {
    if (e.keyCode === 13) {
      this._validateStoreSettings();
    }
  },

  /**
   * Set the store url in location.
   * @method  _setUrlInLocation
   */
  _setUrlInLocation: function () {
    var url = buildParamUrl(this.$.baseUrl.value, this.$.storeName.value);
    this.set('location.params.url', url);
  },

  /**
   * Sets the errormessage on a div in the dialog.
   *
   * @param  {[String]} message [message set on error]
   * @method _showErrorMessage
   */
  _showErrorMessage: function (message) {
    this.$.errorMessageDiv.innerHTML = message;
    this.set('validSettings', false);
  },

  /**
   * Sets a paper-toast with a message and opens the toast.
   *
   * @param  {[String]} message [message set on success]
   * @method _showNotification
   */
  _showNotification: function (message) {
    this.$.toast.text = message;
    this.$.toast.open();
  },

  _useStore: function () {
    this._setUrlInLocation();
  }

});
