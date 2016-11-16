// @importedBy bde-base-item.html
/*globals inflection*/

Polymer({
  is: 'bde-base-item',

  properties: {

    /**
     * The current selected Cubble component.
     *
     * @type {Object}
     * @property currentComponent
     */
    currentComponent: {
      type: Object
    },

    /**
     * Object containing the couchDB data for one component retrieved by the initial
     * request to the Base via bde-base-browser.
     *
     * @type Object
     * @property item
     */
    item: {
      type: Object
    },

    /**
     * Object referencing the manifest of the current selected Cubble component.
     *
     * @type {Object}
     * @property manifest
     */
    manifest: {
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
    }
  },

  /* *********************************************************************************/
  /* ***************************** private methods ***********************************/
  /* *********************************************************************************/

  /**
   * Select a Cubble component, set corresponding metadata.
   *
   * @method _selectComponent
   */
  _selectComponent: function () {
    this.fire('bde-member-data-loading');
    if (this.$.ajax.url && this.$.ajax.url.length > 0) {
      this.$.ajax.generateRequest();
    } else {
      var webpackage = this.manifest;
      this._addSelectedComponent(webpackage, this.item.webpackageId);
    }
  },

  /**
   * Utility function for adding the component, sets the corresponding metadata and fires loaded events.
   *
   * @param {[Object]} webpackage   [the current webpackage Object]
   * @param {[String]} webpackageId [the current webpackageId]
   * @method _addSelectedComponent
   */
  _addSelectedComponent: function (webpackage, webpackageId) {
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
   * Get , if the component should be disabled. (Not selectabel in the list)
   * Used in disabled attribute
   * If an artifact with the same artifactId but from other webpacakge already is a member, the ertifact should be disabled.
   * @param  {[type]} artifact [description]
   * @return {[type]}          [description]
   * @method _componentDisabled
   */
  _componentDisabled: function (artifact) {
    var enabled = true;
    this.currentComponent.members.forEach((member) => {
      var dependency = this._getDependency(this.currentComponent, member.artifactId);
      if (!dependency) {
        console.error('No dependency found for the member ' + JSON.stringify(member) + ' in artifact ' + this.currentComponent.artifactId + '.');
        return;
      }
      var webpackageId;
      if (dependency.webpackageId) {
        webpackageId = dependency.webpackageId;
      } else {
        webpackageId = 'this';
      }
      var artifactId = member.artifactId;
      if (artifactId === artifact.artifactId && webpackageId !== artifact.webpackageId) {
        enabled = false;
      }
    });
    var webpackageId = this.manifest.name + '@' + this.manifest.version;
    if (this.manifest.groupId && this.manifest.groupId.length > 0) {
      webpackageId = this.manifest.groupId + '.' + webpackageId;
    }
    if (enabled && this.currentComponent.artifactId === artifact.artifactId && (webpackageId === artifact.webpackageId || artifact.webpackageId === 'this')) {
      enabled = false;
    }
    return !enabled;
  },

  /**
   * Get a dependency with the artifactId from artifact.
   * @param parentArtifact
   * @param artifactId
   * @returns {*}
   * @private
   */
  _getDependency: function (parentArtifact, artifactId) {
    if (!parentArtifact.dependencies) {
      return null;
    }
    return parentArtifact.dependencies.find((dep) => dep.artifactId === artifactId);
  },

  /**
   * Sets the itemUrlbased on baseUrl, current store and the webpackageId and appends 'manifest.webpackage'.
   *
   * @param  {[type]} item [description]
   * @return {[String]}    [items url in the base]
   * @method _getItemUrl
   */
  _getItemUrl: function (item) {
    if (item.webpackageId === 'this') {
      return '';
    } else {
      return this.settings.baseUrl.replace(/[/]?$/, '/') +
        this.settings.store + '/' + item.webpackageId + '/manifest.webpackage';
    }
  },

  /**
   * Handles the response of the iron-ajax, called on-tap, retrieves the manifest of the respective component.
   *
   * @method handleResponse
   */
  _handleAjaxResponse: function () {
    var webpackage = this.$.ajax.lastResponse;
    this._addSelectedComponent(webpackage);
  },

  /**
   * Generate and gets the webpackageId.
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
