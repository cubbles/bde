/*global XMLHttpRequest*/
Polymer({
  is: 'bde-store-settings',

  properties: {

    opened: {
      type: Boolean,
      value: false
    },

    settings: {
      type: Object,
      notify: true
    },

    requestSuccess: {
      type: Boolean
    }

  },

  listeners: {
    'iron-overlay-opened': 'handleOpened'
  },

  handleOpened: function () {
    this.set('_intermediate', JSON.parse(JSON.stringify(this.settings)));
  },

  validateStoreSettings: function (e) {
    if (this.$.storeForm.validate()) {
      var changeBaseUrl;
      var changeStoreName;
      if (this.settings.store !== this.$.storeName.value) {
        changeStoreName = true;
      }
      if (this.settings.baseUrl !== this.$.baseUrl.value) {
        changeBaseUrl = true;
      }
      if (changeBaseUrl || changeStoreName) {
        this.testStoreConnection(function () {
          if (this.requestSuccess) {
            this.changeStore(changeBaseUrl, changeStoreName);
            this.$.formDialog.close();
            this.showMessage('Store changed');
          } else {
            this.showMessage('Store url is not valid. The connection test was unsuccessful');
          }
        }.bind(this));
      } else {
        this.showMessage('The provided Store url is the same as the current one');
      }
    }
  },

  changeStore: function (changeBaseUrl, changeStoreName) {
    if (changeStoreName) {
      this.set('settings.' + this.$.storeName.name, this.$.storeName.value);
    }
    if (changeBaseUrl) {
      this.set('settings.' + this.$.baseUrl.name, this.$.baseUrl.value);
    }
    document.querySelector('bde-app').resetBDE();
  },

  showMessage: function (message) {
    this.$.toast.text = message;
    this.$.toast.open();
  },

  testStoreConnection: function (callback) {
    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        self.requestSuccess = true;
      } else {
        self.requestSuccess = false;
      }
      callback.apply(xhr);
    };
    xhr.open('GET', this.$.baseUrl.value + '/' + this.$.storeName.value, true);
    xhr.send();
  }
});
