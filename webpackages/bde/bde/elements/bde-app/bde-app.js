/*global XMLHttpRequest*/
(function () {
  'use strict';

  Polymer({
    is: 'bde-app',

    properties: {
      currentComponentMetadata: {
        type: Object,
        value: function () {
          return {
            manifest: null,
            endpointId: null,
            artifactId: null
          };
        },
        notify: true
      },

      manifest: {
        type: Object
      },

      screenHeight: {
        type: Number,
        value: function () {
          return window.outerHeight;
        }
      },

      screenWidth: {
        type: Number,
        value: function () {
          return window.outerWidth;
        }
      },

      selectedPage: {
        type: String,
        value: 'dataflowView'
      },

      settings: {
        type: Object
      },

      showExplorer: {
        type: Boolean,
        value: true
      },

      blobRegistry: {
        type: Object,
        value: function () {
          return {};
        }
      },

      selectedArtifact: {
        type: Object
      },

      loading: {
        type: Boolean,
        value: false
      },

      bdeVersion: {
        type: String,
        value: 'unknown'
      }
    },

    listeners: {
      'graph-needs-update': 'handleGraphUpdate',
      'bde-manifest-loaded': 'handleLoaded',
      'bde-manifest-loading': 'handleLoading',
      'bde-member-loaded': 'handleLoaded',
      'bde-member-loading': 'handleLoading'
    },

    attached: function () {
      // Bind webpackage node to local scope
      this.set('manifest', this.$.manifest);

      // Show the Explorer
      this.$.drawerPanel.openDrawer();

      // Attach resize listener
      // (cannot use listeners for window events)
      window.addEventListener('resize', this.handleResize.bind(this));
    },

    ready: function () {
      this.loadBdeVersion();
    },
    computeBaseUrl: function (baseUrl, store, partial) {
      if (!partial || typeof partial !== 'string') {
        throw new TypeError('`partial` must be a string');
      }

      // Make sure partial starts with a slash
      partial = partial.replace(/^\/?/, '/');

      try {
        return baseUrl + '/' + store + partial;
      } catch (e) {
        return '';
      }
    },

    handleLoading: function () {
      this.loading = true;
    },

    handleLoaded: function () {
      this.loading = false;
    },

    handleGraphUpdate: function () {
      this.$.dataflowView.rerender();
    },

    handleResize: function (event) {
      this.set('screenWidth', window.outerWidth);
      this.set('screenHeight', window.outerHeight);
    },

    loadManifest: function (manifest) {
      this.$.manifest.loadManifest(manifest);
    },

    getCompoundFromBase: function () {
      this.$.browser.compoundOnly = true;
      // this.$.parser.showCompoundMembers = true;
      this.$.browser.toggleDialog();
    },

    _computeAddComponent: function (sidebar) {
      return (sidebar) ? 'push-right' : '';
    },

    _concatArray: function () {
      return [].concat.apply(this, arguments);
    },
    storeSettingsBtnHandler: function () {
      this.$.storeSettings.opened = !this.$.storeSettings.opened;
    },
    aboutBtnHandler: function () {
      this.$.about.opened = !this.$.about.opened;
    },

    helpBtnHandler: function () {
      this.$.help.opened = !this.$.help.opened;
    },

    newWebpackageBtnHandler: function () {
      this.resetBDE();
    },

    resetBDE: function () {
      document.querySelector('#manifest').reset();
    },

    initializeDefaultSettings: function () {
      this.set('settings', {
        baseUrl: 'https://cubbles.world',
        store: 'sandbox'
      });
    },

    loadBdeVersion: function () {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            this.set('bdeVersion', JSON.parse(xhr.responseText).version);
          } else {
            console.log('BDE version could no be determined. Error loading bde  manifest. Request returned a status of ' + xhr.status);
          }
        }
      }.bind(this);
      xhr.open('GET', '../manifest.webpackage', true);
      xhr.send();
    }
  });
})();
