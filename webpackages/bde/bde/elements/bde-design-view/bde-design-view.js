/*global XMLHttpRequest*/
Polymer({
  is: 'bde-design-view',
  properties: {
    currentComponentMetadata: {
      type: Object,
      notify: true
    },
    lastGeneratedTemplateBlobDocTime: {
      type: Object
    },

    selectedPage: {
      notify: true,
      type: String
    },

    lastChangeTime: {
      type: Object
    },
    selectedCompound: {
      type: Object,
      value: null
    },
    compatibleTemplate: {
      type: Boolean,
      value: false
    },
    isVisible: {
      type: Boolean,
      value: false
    },
    designViewDisabled: {
      type: Boolean,
      value: false
    },
    lastEndpointId: {
      type: String
    }
  },
  listeners: {
    'confirmEnablingDialog.iron-overlay-closed': 'confirmEnablingDialogCloseHandler',
    'no-compatible-template': 'noCompatibleTemplateHandler',
    'compatible-template': 'compatibleTemplateHandler'
  },
  observers: [
    'currentComponentMetadataChanged(currentComponentMetadata.*)'
  ],

  ready: function () {
    this.parentNode.addEventListener('iron-deselect', this.leaveHandler);
    this.parentNode.addEventListener('iron-select', this.openHandler.bind(this));
  },

  handleTap: function () {
    this.selectedPage = "dataflowView";
  },

  compatibleTemplateHandler: function () {
    this.set('compatibleTemplate', true);
    this.set('designViewDisabled', false);
  },

  noCompatibleTemplateHandler: function () {
    this.set('compatibleTemplate', false);
    this.set('designViewDisabled', true);
    if (this.isVisible) {
      this.$.confirmEnablingDialog.open();
    }
  },

  currentComponentMetadataChanged: function () {
    if (!this.currentComponentMetadata || !this.currentComponentMetadata.manifest || !this.currentComponentMetadata.artifactId || !this.currentComponentMetadata.endpointId) {
      return;
    }
    this.debounce('loadNewCompound', function () {
      this.loadNewCompound();
    }, 2);
  },

  loadNewCompound: function () {
    this.set('designViewDisabled', false);
    var compoundComponents = this.currentComponentMetadata.manifest.artifacts.compoundComponents;
    compoundComponents.forEach(function (item) {
      if (item.artifactId === this.currentComponentMetadata.artifactId) {
        this.lastGeneratedTemplateBlobDocTime = new Date(0);
        this.set('selectedCompound', item);
        this.lastEndpointId = this.currentComponentMetadata.endpointId;
        this.loadHtmlResources();
      }
    }.bind(this));
  },

  openHandler: function (e) {
    var designView = e.detail.item;
    if (designView.id !== 'designView') {
      return;
    }
    designView.set('isVisible', true);
    if (!designView.compatibleTemplate && designView.designViewDisabled) {
      designView.$.confirmEnablingDialog.open();
    }
  },

  confirmEnablingDialogCloseHandler: function (e) {
    if (e.detail.confirmed) {
      this.set('designViewDisabled', false);
      this.$.bdeFlexboxLayouter.templateChanged('override extern template');
    } else {
      this.set('designViewDisabled', true);
    }
  },

  leaveHandler: function (e) {
    // TODO mapping für blob URL zu webpackage Generierung erstellen und global verwalten
    var designView = e.detail.item;
    if (designView.id !== 'designView' || designView.designViewDisabled) {
      return;
    }
    designView.set('isVisible', false);
  },

  getEndpointFromSelectedCompound: function (endpointId) {
    for (var i = 0; i < this.selectedCompound.endpoints.length; i++) {
      if (this.selectedCompound.endpoints[i].endpointId === endpointId) {
        return this.selectedCompound.endpoints[i];
      }
    }
    return;
  },

  loadHtmlResources: function () {
    if (!this.currentComponentMetadata || !this.currentComponentMetadata.endpointId) {
      return;
    }
    var endpoint = this.getEndpointFromSelectedCompound(this.currentComponentMetadata.endpointId);
    if (endpoint) {
      var absoluteUrl;
      var index;
      for (var i = 0; i < endpoint.resources.length; i++) {
        if (endpoint.resources[i].indexOf('.html') > -1) {
          absoluteUrl = this.buildSelectedCompoundResourceUrl(endpoint.resources[i]);
        } else {
          index = endpoint.resources[i].indexOf('?type=html');
          if (index > -1) {
            absoluteUrl = endpoint.resources[i].substring(0, index);
          }
        }
        if (absoluteUrl) {
          this.loadFile(absoluteUrl, function (response) {
            this.$$('bde-flexbox-layouter').loadTemplate(response);
          }.bind(this));
        }
      }
      if (!absoluteUrl) {
        this.$$('bde-flexbox-layouter').loadSelectedCompound();
      }
    }
  },

  loadFile: function (url, successCallback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          successCallback.call(this, xhr.responseText);
        } else {
          console.error('Error loading "' + url + '". Request returned a status of ' + xhr.status);
        }
      }
    }.bind(this);
    xhr.open('GET', url, true);
    xhr.send();
  },

  buildSelectedCompoundResourceUrl: function (resourceUrl) {
    var webpackageQName = '';
    webpackageQName = this.currentComponentMetadata.manifest.name + '@' + this.currentComponentMetadata.manifest.version;
    if (this.currentComponentMetadata.manifest.groupId && this.currentComponentMetadata.manifest.groupId.length > 0) {
      webpackageQName = this.currentComponentMetadata.manifest.groupId + '.' + webpackageQName;
    }
    var baseUrl = this.settings.baseUrl + '/' + this.settings.store + '/' + webpackageQName + '/' + this.selectedCompound.artifactId + '/';

    return this.relativeToAbsolute(baseUrl, resourceUrl);
  },

  relativeToAbsolute: function (baseUrl, relativeUrl) {
    var stack = baseUrl.split('/');
    var parts = relativeUrl.split('/');
    stack.pop(); // remove current file name (or empty string)
                 // (omit if 'base' is the current folder without trailing slash)
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === '.') {
        continue;
      }
      if (parts[i] === '..') {
        stack.pop();
      } else {
        stack.push(parts[i]);
      }
    }
    return stack.join('/');
  }
});
