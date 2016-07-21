Polymer({
  is: 'bde-endpoint-browser',
  properties: {
    artifact: {
      type: 'Object'
    }
  },
  selectEndpoint: function (event) {
    var item = event.target;
    this.fire('bde-select-endpoint', {artifact: item.dataset.artifact, endpointId: item.dataset.endpointId});
  }

});
