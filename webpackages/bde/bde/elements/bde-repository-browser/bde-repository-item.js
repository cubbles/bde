// @importedBy bde-repository-item.html

Polymer({
  'is': 'bde-repository-item',

  properties: {

    /**
     * Object containing the couchDB data retrieved by the initial request to the Base via bde-repository-browser.
     *
     * @type Object
     * @property item
     */
    item: {
      type: Object,
      value: function () {
        return {};
      }
    },

    // /**
    //  * Object containing couchDB data for the given component. Used for databinding the component data to the other bde-elements.
    //  *
    //  * @type Object
    //  * @property lastItemSelected
    //  */
    // lastItemSelected: {
    //   type: Object,
    //   notify: true
    // },

    // /**
    //  * Object to store the couchDB data for the given component. For later use in the bde-creator.
    //  *
    //  * @type Object
    //  * @property manifest
    //  */
    // manifest: {
    //   type: Object,
    //   notify: true
    // },

    /**
     * Holding the BDE Application settings. (see <bde-app> component)
     * @type Object
     * @property settings
     */
    settings: {
      type: Object,
      notify: true
    },

    selection: {
      type: Boolean,
      notify: true
    }

  },

  /**
   * Method invoked on click for the given component. Generates new AJAX request to retrieve the data for component from the couchDB.
   *
   * @method addComponent
   */
  addComponent: function () {
    // this.$.itemRequest.generateRequest();
    // if (this.settings.newArtifact) {
    //   delete this.settings.newArtifact;
    // }
    // if (this.settings.newWebpackage) {
    //   delete this.settings.newWebpackage;
    // }
    this.set('settings.webpackageId', this.item.webpackageId);
    this.set('settings.artifactId', this.item.artifactId);
    this.set('selection', true);
  }
  // ,

  // /**
  //  * Method gets the URL for the given component based on the retrieved metadata from initial search request.
  //  *
  //  * @method getItemUrl
  //  * @param  {Object} item metadata of initail request
  //  * @return {String} url URL ind Base for the given component
  //  */
  // getItemUrl: function (item) {
  //   var url = this.get('settings.baseUrl') + '/' + this.get('settings.store') + '/' + item.webpackageId + '/manifest.webpackage';
  //   return url;
  // },
  //
  // /**
  //  * Handles the AJAX response of the iron-ajax element. Sets the data for the given component for data-binding with other bde elements.
  //  *
  //  * @method handleResponse
  //  * @param  {Event} event The iron-ajax respons event.
  //  */
  // handleResponse: function (event) {
  //   var manifest = this.$.itemRequest.lastResponse;
  //   var path = inflection.pluralize(this.item.artifactType);
  //   var artifact = manifest.artifacts[ path ]
  //     .find((artifact) => artifact.artifactId === this.item.artifactId);
  //
  //   if (!artifact) {
  //     throw new Error('Something went wrong finding our artifact in the webpackage');
  //   }
  //
  //   artifact.is = this.item.artifactType;
  //   artifact.metadata = {
  //     url: this.getItemUrl(this.item),
  //     webpackageId: getWebpackageId(this.item)
  //   };
  //   this.set('lastItemSelected', artifact);
  //   this.fire('bde-load-manifest', manifest);
  //   return;
  //
  //   function getWebpackageId (item) {
  //     return item.groupId + '.' + item.name + '@' + item.version;
  //   }
  // }
});
