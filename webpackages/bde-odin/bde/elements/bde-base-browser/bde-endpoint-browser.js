// @importedBy bde-endpoint-browser.html

Polymer({
  is: 'bde-endpoint-browser',
  properties: {
    /**
     * in base browser selected artifact
     * @type Object
     * @property artifact
     */
    artifact: {
      type: 'Object'
    }
  },
  /**
   * The handler method select an endpoint.
   * Fire bde-select-endpoint event with the metadata of the selected endpoint.
   * @param event
   * @method _selectEndpoint
   * @private
   */
  _selectEndpoint: function (event) {
    var item = event.target;
    this.fire('bde-select-endpoint', {artifact: item.dataset.artifact, endpointId: item.dataset.endpointId});
  }

});
