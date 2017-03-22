// @importedBy bde-store-settings.html

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
    'iron-overlay-opened': 'handleOpened'
  },

  /**
   * Confirmation of the base URL field via enter button focuses the storeName field.
   *
   * @param  {[Event]} e [keydown event]
   * @method confirmBaseURL
   */
  confirmBaseURL: function (e) {
    if (e.keyCode === 13) {
      this.$.storeName.focus();
    }
  },

  /**
   * Pressing enter on the storeName field calls the validateStoreSettings method.
   *
   * @param  {[Event]} e [keydown event]
   * @method saveChanges
   */
  saveChanges: function (e) {
    if (e.keyCode === 13) {
      this.validateStoreSettings();
    }
  },

  /**
   * Listener function for opening the dialog.
   *
   * @method handleOpened
   */
  handleOpened: function () {
    this.set('_intermediate', JSON.parse(JSON.stringify(this.defaultSettings)));
    this.set('validSettings', true);
  },

  /**
   * Validates the settings from the dialog field by calling an XMLHttpRequest for the given URL.
   *
   * @method validateStoreSettings
   */
  validateStoreSettings: function () {
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
        this.testStoreConnection(function () {
          if (this.requestSuccess) {
            this.changeStore(changeBaseUrl, changeStoreName);
            this.$.formDialog.close();
            this.showNotification('Store changed');
          } else {
            this.showErrorMessage('Store url is not valid. The connection test was unsuccessful');
          }
        }.bind(this));
      } else {
        this.showErrorMessage('The provided Store url is the same as the current one');
      }
    }
  },

  /**
   * Change the store URL by setting the data from the dialog input fields to the settings.
   *
   * @param  {[Boolean]} changeBaseUrl   [changed flag for the BaseUrl]
   * @param  {[Boolean]} changeStoreName [changed flag for the storeName]
   * @method changeStore
   */
  changeStore: function (changeBaseUrl, changeStoreName) {
    if (changeStoreName) {
      this.set('defaultSettings.' + this.$.storeName.name, this.$.storeName.value);
    }
    if (changeBaseUrl) {
      this.set('defaultSettings.' + this.$.baseUrl.name, this.$.baseUrl.value);
    }
    if (changeStoreName || changeBaseUrl) {
      this.set('location.params.url', this.$.baseUrl.value + '/' + this.$.storeName.value);
    }
    document.querySelector('bde-app').resetBDE();
  },

  /**
   * Sets the errormessage on a div in the dialog.
   *
   * @param  {[String]} message [message set on error]
   * @method showErrorMessage
   */
  showErrorMessage: function (message) {
    this.$.errorMessageDiv.innerHTML = message;
    this.set('validSettings', false);
  },

  /**
   * Sets a paper-toast with a message and opens the toast.
   *
   * @param  {[String]} message [message set on success]
   * @method showNotification
   */
  showNotification: function (message) {
    this.$.toast.text = message;
    this.$.toast.open();
  },

  /**
   * Opens a XMLHttpRequest for testing the values of the input field for the store URL.
   * If the connection can be established, requestSuccess is set to ture otherwise false.
   *
   * @param  {Function} callback [callback function of the request]
   * @method testStoreConnection
   */
  testStoreConnection: function (callback) {
    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          self.requestSuccess = true;
        } else {
          self.requestSuccess = false;
        }
        callback.apply(xhr);
      }
    };
    xhr.open('GET', this.$.baseUrl.value + '/' + this.$.storeName.value, true);
    xhr.send();
  }
});
