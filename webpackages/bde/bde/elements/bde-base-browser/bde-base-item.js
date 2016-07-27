/*globals inflection*/
Polymer({
  is: 'bde-base-item',

  properties: {

    /**
     * Object containing the couchDB data retrieved by the initial
     * request to the Base via bde-repository-browser.
     *
     * @type Object
     * @property item
     */
    item: {
      type: Object
    },

    settings: {
      type: Object
    },

    manifest: {
      type: Object
    },

    currentComponent: {
      type: Object
    }
  },

  addComponent: function () {
    this.fire('bde-member-data-loading');
    if (this.$.ajax.url && this.$.ajax.url.length > 0) {
      this.$.ajax.generateRequest();
    } else {
      var webpackage = this.manifest;
      this._addComponent(webpackage, this.item.webpackageId);
    }
  },

  handleResponse: function () {
    var webpackage = this.$.ajax.lastResponse;
    this._addComponent(webpackage);
  },
  /* *********************************************************************************/
  /* ***************************** private methods ***********************************/
  /* *********************************************************************************/
  _addComponent: function (webpackage, webpackageId) {
    var artifact = webpackage
      .artifacts[ inflection.pluralize(this.item.artifactType) ]
      .find((artifact) => artifact.artifactId === this.item.artifactId);

    if (!artifact) {
      throw new Error('Something went wrong finding our artifact in the webpackage');
    }

    artifact.artifactType = this.item.artifactType;
    artifact.url = this._getItemUrl(this.item);
    if (!webpackageId || webpackageId !== 'this') {
      artifact.webpackageId = this._getWebpackageId({
        groupId: webpackage.groupId,
        name: webpackage.name,
        version: webpackage.version
      });
    } else {
      artifact.webpackageId = webpackageId;
    }

    // this.fire('iron-select', artifact);
    this.fire('bde-member-data-loaded');
    this.fire('bde-select-compound', artifact);
  },

  _componentDisabled: function (artifact) {
    var enabled = true;
    this.currentComponent.members.forEach(function (member) {
      var webpackageId = member.componentId.substring(0, member.componentId.lastIndexOf('/'));
      var artifactId = member.componentId.substring(member.componentId.lastIndexOf('/') + 1);
      if (artifactId === artifact.artifactId && webpackageId !== artifact.webpackageId) {
        enabled = false;
      }
    });
    var webpackageId = this.manifest.name + '@' + this.manifest.version;
    if (this.manifest.groupId && this.manifest.groupId.length > 0) {
      webpackageId = this.manifest.groupId + '.' + webpackageId;
    }
    if (enabled && this.currentComponent.artifactId === artifact.artifactId && (webpackageId === artifact.webpackageId || 'this' === artifact.webpackageId)) {
      enabled = false;
    }
    return !enabled;
  },

  _getItemUrl: function (item) {
    if (item.webpackageId === 'this'){
      return '';
    } else {
      return this.settings.baseUrl.replace(/[/]?$/, '/') +
        this.settings.store + '/' + item.webpackageId + '/manifest.webpackage';
    }
  },
  _isThisWebpackage: function (item) {
    return item.webpackageId === 'this';
  },
  _getWebpackageId: function (item) {
    if (item.webpackageId === 'this') {
      return item.webpackageId;
    }
    var webpackageId = item.name + '@' + item.version;
    if (item.groupId && item.groupId.length > 0) {
      webpackageId = item.groupId + '.' + webpackageId;
    }
    return webpackageId;
  }

});
