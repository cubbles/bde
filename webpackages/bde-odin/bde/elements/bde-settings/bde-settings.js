// @importedBy bde-settings.html
/* globals testStoreConnection */
'use strict';

Polymer({
  is: 'bde-settings',

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

    settings: {
      type: Object,
      notify: true
    },
    /**
     * Boolean set for valid settings after validating URL and name of the store.
     *
     * @type {Boolean}
     * @property validStoreSettings
     */
    validStoreSettings: {
      type: Boolean,
      value: true
    },
    /**
     * Boolean set for valid settings after validating URL of asgard .
     *
     * @type {Boolean}
     * @property validUtgardSettings
     */
    validUtgardSettings: {
      type: Boolean,
      value: true
    },

    _tabSelected: {
      type: Number,
      notify: true,
      value: 0
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
   * @method _changeStoreUrlInLocation
   */
  _changeStoreUrlInLocation: function () {
    var url = this.$.baseUrl.value + '/' + this.$.storeName.value;
    testStoreConnection(url, function (success) {
      if (success) {
        this._use();
        this.$.formDialog.close();
        this._showNotification('Store changed');
      } else {
        this._showStoreSettingsErrorMessage('Store url is not valid. The connection test was unsuccessful');
      }
    }.bind(this));
  },

  /* *****************************************************************************************/
  /* ********************************* private methods ***************************************/
  /* *****************************************************************************************/

  _changeUseUtgard: function (evt) {
    console.log('_changeUseUtgard', evt);
    // TODO URL eingabe disable?
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
    this.set('validStoreSettings', true);
    this.set('validUtgardSettings', true);
  },

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
  },

  /**
   * Pressing enter on the storeName field calls the _validateStoreSettings method.
   *
   * @param  {[Event]} e [keydown event]
   * @method _saveStoreSettingsChanges
   */
  _saveStoreSettingsChanges: function (e) {
    if (e.keyCode === 13) {
      this._validateStoreSettings();
    }
  },

  /**
   * Sets the errormessage on a div in the dialog.
   *
   * @param  {[String]} message [message set on error]
   * @method _showStoreSettingsErrorMessage
   */
  _showStoreSettingsErrorMessage: function (message) {
    this.$.storeSettingsErrorMessageDiv.innerHTML = message;
    this.set('validStoreSettings', false);
  },

  /**
   * Sets the errormessage on a div in the dialog.
   *
   * @param  {[String]} message [message set on error]
   * @method _showStoreSettingsErrorMessage
   */
  _showUtgardSettingsErrorMessage: function (message) {
    this.$.errorUtgardSettingsMessageDiv.innerHTML = message;
    this.set('validUtgardSettings', false);
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

  /**
   * Use settings.
   * @private
   * @method _use
   */
  _use: function () {
    this.set('settings.baseUrl', this.$.baseUrl.value);
    this.set('settings.store', this.$.storeName.value);
  },

  _validatAndSaveUtgardSettings: function () {
    if (this.$.utgardSettingsForm.validate()) {
      console.log('_saveUtgardSettings');

      this.set('defaultSettings.asgard.asgardUrl', this.$.asgardUrl.value);
      this.set('defaultSettings.asgard.asgardPort', this.$.asgardPort.value);
      this.set('defaultSettings.asgard.knowledgeBaseUrl', this.$.knowledgeBaseUrl.value);
      this.set('defaultSettings.asgard.knowledgeBasePort', this.$.knowledgeBasePort.value);

      this.set('defaultSettings.asgard.active', this.$.utgardActive.checked);
      this.$.formDialog.close();
    }
  },

  /**
   * Validates the settings from the dialog field by calling an XMLHttpRequest for the given URL.
   * @private
   * @method _validateStoreSettings
   */
  _validateStoreSettings: function () {
    var use = false;
    if (arguments.length > 2) {
      use = arguments[2];
    }
    if (this.$.storeSettingsForm.validate()) {
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
              this._use();
            }
            this.$.formDialog.close();
            this._showNotification('Store changed');
          } else {
            this._showStoreSettingsErrorMessage('Store url is not valid. The connection test was unsuccessful');
          }
        }.bind(this));
      } else {
        this.$.formDialog.close();
      }
    }
  },

  /**
   * Validate save and use store settings.
   * @param params
   * @private
   * @method _validateStoreSettingsAndUse
   */
  _validateStoreSettingsAndUse: function (...params) {
    this._validateStoreSettings(...params, true);
  }
});
