// @importedBy bde-base-item.html
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

    /**
     * Object representing the app settings.
     *
     * @type {Object}
     * @property settings
     */
    settings: {
      type: Object
    },

    /**
     * Object referencing the manifest of the Cubble component.
     *
     * @type {Object}
     * @property manifest
     */
    manifest: {
      type: Object
    },

    /**
     * The current Cubble component.
     *
     * @type {Object}
     * @property currentComponent
     */
    currentComponent: {
      type: Object
    }
  },

  /**
   * Add the Cubble component, set corresponding metadata.
   *
   * @method addComponent
   */
  addComponent: function () {
    this.fire('bde-member-data-loading');
    if (this.$.ajax.url && this.$.ajax.url.length > 0) {
      this.$.ajax.generateRequest();
    } else {
      var webpackage = this.manifest;
      this._addComponent(webpackage, this.item.webpackageId);
    }
  },

  /**
   * Handles the response of the iron-ajax, called on-tap, retrieves the metadata of the respective component.
   *
   * @method handleResponse
   */
  handleResponse: function () {
    var webpackage = this.$.ajax.lastResponse;
    this._addComponent(webpackage);
  },

  /* *********************************************************************************/
  /* ***************************** private methods ***********************************/
  /* *********************************************************************************/

  /**
   * Utility function for adding the component, sets the corresponding metadata and fires loaded events.
   *
   * @param {[Object]} webpackage   [the current webpackage Object]
   * @param {[String]} webpackageId [the current webpackageId]
   * @method _addComponent
   */
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

  /**
   * not called ???
   *
   * @param  {[type]} artifact [description]
   * @return {[type]}          [description]
   * @method _componentDisabled
   */
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

  /**
   * Sets the itemUrlbased on baseUrl, current store and the webpackageId and appends 'manifest.webpackage'.
   *
   * @param  {[type]} item [description]
   * @return {[String]}    [items url in the base]
   * @method _getItemUrl
   */
  _getItemUrl: function (item) {
    if (item.webpackageId === 'this'){
      return '';
    } else {
      return this.settings.baseUrl.replace(/[/]?$/, '/') +
        this.settings.store + '/' + item.webpackageId + '/manifest.webpackage';
    }
  },

  /**
   * not called ???
   *
   * @param  {[type]}  item [description]
   * @return {String}      [description]
   * @method _isThisWebpackage
   */
  _isThisWebpackage: function (item) {
    return item.webpackageId === 'this';
  },

  /**
   * Gets the items id and transforms it into a valid webpackageId.
   *
   * @param  {[Object]} item [description]
   * @return {[String]}      [modified webpackageId]
   * @method _getWebpackageId
   */
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
