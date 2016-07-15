/*global XMLHttpRequest, Blob*/
Polymer({
  is: 'bde-design-view',
  properties: {
    blobRegistry: {
      type: Object,
      notify: true
    },
    currentComponentMetadata: {
      type: Object,
      notify: true
    },
    lastGeneratedTemplateBlobDocTime: {
      type: Object
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
    disabled: {
      type: Boolean,
      value: false
    },
    lastEndpointId: {
      type: String
    }
  },
  listeners: {
    'iron-overlay-closed': 'confirmDialogCloseHandler',
    'no-compatible-template': 'noCompatibleTemplateHandler',
    'compatible-template': 'compatibleTemplateHandler',
    'new-compound-can-load': 'newCompoundCanLoadHandler'
  },
  observers: [
    'currentComponentMetadataChanged(currentComponentMetadata.*)'
  ],

  ready: function () {
    this.parentNode.addEventListener('iron-deselect', this.leaveHandler);
    this.parentNode.addEventListener('iron-select', this.openHandler);
  },

  compatibleTemplateHandler: function () {
    this.set('compatibleTemplate', true);
    this.set('disabled', false);
  },

  noCompatibleTemplateHandler: function () {
    this.set('compatibleTemplate', false);
    this.set('disabled', true);
    if (this.isVisible) {
      this.$.confirmEnablingDialog.open();
    }
  },

  currentComponentMetadataChanged: function () {
    if (!this.currentComponentMetadata || !this.currentComponentMetadata.manifest || !this.currentComponentMetadata.artifactId || !this.currentComponentMetadata.endpointId) {
      return;
    }
    if (this.isVisible && !this.disabled &&
      (!this.lastGeneratedTemplateBlobDocTime || this.lastGeneratedTemplateBlobDocTime < this.lastChangeTime)) {
      this.$.confirmKeepingDialog.open();
    } else {
      this.fire('new-compound-can-load');
    }
  },

  newCompoundCanLoadHandler: function () {
    this.disabled = false;
    var compoundComponents = this.currentComponentMetadata.manifest.artifacts.compoundComponents;
    compoundComponents.forEach(function (item) {
      if (item.artifactId === this.currentComponentMetadata.artifactId) {
        this.lastGeneratedTemplateBlobDocTime = new Date(0);
        this.selectedCompound = item;
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
    if (!designView.compatibleTemplate && designView.disabled) {
      designView.$.confirmEnablingDialog.open();
    }
  },

  confirmDialogCloseHandler: function (e) {
    if (!e.target.id) {
      return;
    }
    switch (e.target.id) {
      case 'confirmEnablingDialog':
        if (e.detail.confirmed) {
          this.set('disabled', false);
        } else {
          this.set('disabled', true);
        }
        break;
      case 'confirmKeepingDialog':
        if (e.detail.confirmed) {
          this.generateTemplateBlobDoc(this.selectedCompound.artifactId, this.lastEndpointId);
        }
        this.fire('new-compound-can-load');
        break;
    }
  },

  leaveHandler: function (e) {
    // TODO mapping für blob URL zu webpackage Generierung erstellen und global verwalten
    var designView = e.detail.item;
    if (designView.id !== 'designView' || designView.disabled) {
      return;
    }
    designView.set('isVisible', false);
    designView.generateTemplateBlobDoc(designView.currentComponentMetadata.artifactId, designView.currentComponentMetadata.endpointId);
  },

  generateTemplateBlobDoc: function (artifactId, endpointId) {
    var template = this.querySelector('bde-flexbox-layouter').getTemplate();
    if (this.isEmptyTemplate(template.content)) {
      return;
    }
    template.setAttribute('id', artifactId);
    window.URL = window.URL || window.webkitURL;
    var blob = new Blob([template.outerHTML], {type: 'text/html'});
    var templateBlobUrl = window.URL.createObjectURL(blob) + '?type=html';
    this.blobRegistry[templateBlobUrl] = template.outerHTML;
    var compound;
    this.currentComponentMetadata.manifest.artifacts.compoundComponents.forEach(function (item) {
      if (item.artifactId === artifactId) {
        compound = item;
      }
    });
    var endpoint;
    compound.endpoints.forEach(function (item) {
      if (item.endpointId === endpointId) {
        endpoint = item;
      }
    });
    var listToDelete = [];
    endpoint.resources.forEach(function (item) {
      if (item.indexOf('.html') > -1 || item.indexOf('?type=html') > -1) {
        listToDelete.push(item);
      }
    });
    listToDelete.forEach(function (item) {
      endpoint.resources.splice(endpoint.resources.indexOf(item), 1);
    });

    endpoint.resources.push(templateBlobUrl);
    this.set('lastGeneratedTemplateBlobDocTime', new Date());
  },

  isEmptyTemplate: function (template) {
    if (template.children.length === 0) {
      return true;
    }
    if (template.children.length === 1 && template.children[0].tagName === 'DIV' && template.children[0].children.length === 0) {
      return true;
    }
    return false;
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
          console.log('Error loading "' + url + '". Request returned a status of ' + xhr.status);
        }
      }
    }.bind(this);
    xhr.open('GET', url, true);
    xhr.send();
  },

  buildSelectedCompoundResourceUrl: function (resourceUrl) {
    var webpackageQName = '';
    if (this.currentComponentMetadata.manifest.groupId) {
      webpackageQName += this.currentComponentMetadata.manifest.groupId + '.';
    }
    webpackageQName += this.currentComponentMetadata.manifest.name + '@' + this.currentComponentMetadata.manifest.version;
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

