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
    }
  },

  addComponent: function () {
    this.$.ajax.generateRequest();
  },

  handleResponse: function () {
    var webpackage = this.$.ajax.lastResponse;
    var artifact = webpackage
      .artifacts[ inflection.pluralize(this.item.artifactType) ]
      .find((artifact) => artifact.artifactId === this.item.artifactId);

    if (!artifact) {
      throw new Error('Something went wrong finding our artifact in the webpackage');
    }

    artifact.artifactType = this.item.artifactType;
    artifact.url = this._getItemUrl(this.item);
    artifact.webpackageId = this._getWebpackageId({groupId: webpackage.groupId, name: webpackage.name, version: webpackage.version});

    // this.fire('iron-select', artifact);
    this.fire('bde-select-compound', artifact);
  },

  _getItemUrl: function (item) {
    return this.settings.baseUrl.replace(/[/]?$/, '/') +
      this.settings.store + '/' + item.webpackageId + '/manifest.webpackage';
  },

  _getWebpackageId: function (item) {
    var webpackageId = item.name + '@' + item.version;
    if (item.groupId && item.groupId.length > 0) {
      webpackageId = item.groupId + '.' + webpackageId;
    }
    return webpackageId;
  }

});
