(function() {
  "use strict";

  Polymer({
    is: 'bde-app',

    properties: {

      webpackage: {
        type: Object
      },

      screenHeight: {
        type: Number,
        value: function() {
          return window.outerHeight;
        }
      },

      screenWidth: {
        type: Number,
        value: function() {
          return window.outerWidth;
        }
      },

      selectedPage: {
        type: String,
        value: "dataflowView"
      },

      settings: {
        type: Object,
        value: function() {
          return {
            baseUrl: 'https://cubbles.world',
            baseName: 'sandbox',
            author: { name: '', email: '', url: '' }
          };
        }
      },

      showExplorer: {
        type: Boolean,
        value: true
      }
    },

    listeners: {
      'graph-needs-update': 'handleGraphUpdate'
    },

    attached: function() {
      // Bind webpackage node to local scope
      this.set('webpackage', this.$.webpackage);

      // Show the Explorer
      this.$.drawerPanel.openDrawer();

      // Attach resize listener
      // (cannot use listeners for window events)
      window.addEventListener('resize', this.handleResize.bind(this));
    },

    computeBaseUrl: function(baseUrl, baseName, partial) {
      if (!partial || typeof partial !== 'string') {
        throw new TypeError("`partial` must be a string");
      }

      // Make sure partial starts with a slash
      partial = partial.replace(/^\/?/, '/');

      try {
        return baseUrl + '/' + baseName + partial;
      } catch (e) {
        return '';
      }
    },

    handleGraphUpdate: function() {
      this.$.dataflowView.rerender();
    },

    handleResize: function(event) {
      this.set('screenWidth', window.outerWidth);
      this.set('screenHeight', window.outerHeight);
    },

    loadWebpackage: function(webpackage) {
      this.$.webpackage.loadWebpackage(webpackage);
    },

    getCompoundFromBase: function() {
      this.$.browser.compoundOnly = true;
      // this.$.parser.showCompoundMembers = true;
      this.$.browser.toggleDialog();
    },

    _computeAddComponent: function(sidebar) {
      return (sidebar) ? 'push-right' : '';
    },

    _concatArray: function() {
      return [].concat.apply(this, arguments);
    }

  });
})();
