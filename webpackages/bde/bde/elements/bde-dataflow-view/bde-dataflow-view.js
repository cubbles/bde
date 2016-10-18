(function (context) {
  'use strict';

  if (!context.fetch) {
    throw new Error('Browser must support Fetch API or have polyfill loaded.');
  }

  Polymer({
    is: 'bde-dataflow-view',

    properties: {

      currentComponentMetadata: {
        type: Object,
        notify: true
      },

      resolutions: {
        type: Object,
        notify: true,
        value: function () {
          return {};
        }
      },

      selectedMembers: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      selectedConnections: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      settings: {
        type: Object
      },

      showPropertyEditor: {
        type: Boolean,
        value: false
      },

      lastSelectedMember: {
        type: Object,
        notify: true
      },

      lastSelectedConnection: {
        type: Object,
        notify: true
      },

      _artifact: {
        type: Object,
        notify: true
      },

      _graphWidth: {
        type: Number
      },

      _graphHeight: {
        type: Number
      },

      _graphOffsetX: {
        type: Number
      },

      _graphOffsetY: {
        type: Number
      },

      _selectedMembers: {
        type: Array
      },

      _selectedEdges: {
        type: Array
      },

      _sidepanel: {
        type: Boolean,
        value: false
      }
    },

    observers: [
      'artifactIdChanged(currentComponentMetadata.manifest, currentComponentMetadata.artifactId, currentComponentMetadata.endpointId)',
      'selectedMembersChanged(_selectedMembers.splices)',
      'selectedEdgesChanged(_selectedEdges.splices)',
      'showPropertyEditorChanged(showPropertyEditor)',
      '_artifactChanged(_artifact.*)'
    ],

    listeners: {
      'the-graph-add-node': 'handleAddNode',
      'the-graph-remove-node': 'handleRemoveNode',
      'the-graph-add-inport': 'handleAddInport',
      'the-graph-remove-inport': 'handleRemoveInport',
      'the-graph-add-outport': 'handleAddOutport',
      'the-graph-remove-outport': 'handleRemoveOutport',
      'the-graph-add-edge': 'handleAddEdge',
      'the-graph-remove-edge': 'handleRemoveEdge'
    },
    attached: function () {
      // Set initial graph size
      this.async(this.handleResize);

      // Resize cannot be bound using `listeners`
      window.addEventListener('resize', this.handleResize.bind(this));
    },
    /**
     * Load the new artifact
     *
     * 1. Resolve dependencies
     * 2. Rebuild Graph
     * 3. ???
     * 4. Profit!
     *
     * @param  {Object} manifest   [description]
     * @param  {String} artifactId [description]
     * @param  {String} endpointId [description]
     */
    artifactIdChanged: function (manifest, artifactId, endpointId) {
      this.reload(manifest, artifactId, endpointId);
    },

    handleRemoveNode: function (event) {
      var node = event.detail;
      var memberIdx = this._artifact.members.findIndex((m) => m.memberId === node.id);
      this.splice('_artifact.members', memberIdx, 1);
    },

    handleAddInport: function (event, port) {
      var inport = this.$.bdeGraph.nofloGraph.inports[ port ];
      this.push('_artifact.slots', {
        slotId: port,
        type: 'all', // @TODO (fdu): Fix this to be type of source slot
        direction: [ 'input' ]
      });
      this.push('_artifact.connections', {
        connectionId: Math.random().toString(36).substring(7),
        source: {
          slot: port
        },
        destination: {
          memberIdRef: inport.process,
          slot: inport.port
        }
      });
    },

    handleRemoveInport: function (event, port) {
      var slotIdx = this._artifact.slots.findIndex((s) => s.slotId === port);
      this._artifact.connections.forEach(function (connection, connectionIdx) {
        if (!connection.source.memberIdRef &&
          connection.source.slot === port) {
          this.splice('_artifact.connections', connectionIdx, 1);
        }
      }, this);
      this.splice('_artifact.slots', slotIdx, 1);
    },

    handleAddOutport: function (event, port) {
      var outport = this.$.bdeGraph.nofloGraph.outports[ port ];
      this.push('_artifact.slots', {
        slotId: port,
        type: 'all', // @TODO (fdu): Fix this to be type of source slot
        direction: [ 'output' ]
      });
      this.push('_artifact.connections', {
        connectionId: Math.random().toString(36).substring(7),
        source: {
          memberIdRef: outport.process,
          slot: outport.port
        },
        destination: {
          slot: port
        }
      });
    },

    handleRemoveOutport: function (event, port) {
      var slotIdx = this._artifact.slots.findIndex((s) => s.slotId === port);
      this._artifact.connections.forEach(function (connection, connectionIdx) {
        if (!connection.destination.memberIdRef &&
          connection.destination.slot === port) {
          this.splice('_artifact.connections', connectionIdx, 1);
        }
      }, this);
      this.splice('_artifact.slots', slotIdx, 1);
    },

    handleAddEdge: function (event) {
      var edge = event.detail;

      this.push('_artifact.connections', {
        connectionId: 'connection-' + Math.random().toString(36).substring(7),
        source: {
          memberIdRef: edge.from.node,
          slot: edge.from.port
        },
        destination: {
          memberIdRef: edge.to.node,
          slot: edge.to.port
        },
        copyValue: true,
        repeatedValues: false
      });
    },

    handleRemoveEdge: function (event) {
      var edge = event.detail;
      var cIdx = this._artifact.connections.findIndex(function (connection) {
        return connection.source.memberIdRef === edge.from.node &&
          connection.source.slot === edge.from.port &&
          connection.destination.memberIdRef === edge.to.node &&
          connection.destination.slot === edge.to.port;
      });

      this.splice('_artifact.connections', cIdx, 1);
    },

    handleResize: function () {
      var clientRects = this.getClientRects();
      if (clientRects.length === 0) {
        return;
      }
      var width = clientRects[ 0 ].width;
      var height = clientRects[ 0 ].height;
      var offsetX = clientRects[ 0 ].left;
      var offsetY = clientRects[ 0 ].top;

      this._graphWidth = width;
      this._graphHeight = height;
      this._graphOffsetX = offsetX;
      this._graphOffsetY = offsetY;
    },

    reload: function (manifest, artifactId, endpointId) {
      if (arguments.length === 0 && this.currentComponentMetadata) {
        manifest = this.currentComponentMetadata.manifest;
        artifactId = this.currentComponentMetadata.artifactId;
        endpointId = this.currentComponentMetadata.endpointId;
      }
      if (!manifest || !artifactId || !endpointId) { return; }

      this.set('_selectedMembers', []);
      this.set('_selectedEdges', []);
      this.set('_lastSelectedNode', void (0));
      this.set('_lastSelectedEdge', void (0));

      // var self = this;
      // var settings = this.settings;

      var artifact = manifest.artifacts.compoundComponents.find(function (artifact) {
        return artifact.artifactId === artifactId;
      });

      var bdeGraph = this.$.bdeGraph;
      var promise = window.cubx.bde.bdeDataConverter.resolveArtifact(artifactId, manifest, this._baseUrl(), this.resolutions);
      bdeGraph.rebuildGraph();
      promise.then((data) => {
        data.components.map((component) => {
          bdeGraph.registerComponent(component);
        });
        var _artifact = artifact;
        _artifact.members = data.members;
        _artifact.slots = data.slots;
        _artifact.connections = data.connections;
        _artifact.inits = data.inits;
        this.set('_artifact', _artifact);
        requestAnimationFrame(() => bdeGraph.triggerAutolayout());
      });
    },
    selectedEdgesChanged: function (changeRecord) {
      var connections = this._selectedEdges.map(connectionForEdge.bind(this));
      this.set('selectedConnections', connections);
      this.set('lastSelectedConnection', connections[ connections.length - 1 ]);
      this.fire('iron-selected', { item: this._lastSelectedEdge, type: 'edge' });

      // Show PropertyEditor
      this.showPropertyEditor = (this.selectedMembers.length > 0 || this.selectedConnections.length > 0);

      function connectionForEdge (edge) {
        return this._artifact.connections.find(function (connection) {
          return edge.from.node === connection.source.memberIdRef &&
            edge.to.node === connection.destination.memberIdRef &&
            edge.from.port === connection.source.slot &&
            edge.to.port === connection.destination.slot;
        });
      }
    },

    selectedMembersChanged: function (changeRecord) {
      var members = this._selectedMembers;
      // add selected member with polymer array api methods for register changes in selectedMembers
      this.splice('selectedMembers', 0);
      members.forEach(function (member) {
        // add artifact metadata to member
        var artifactId = member.componentId.split('/')[1];
        var metadata = this.resolutions[ artifactId ].artifact || {};
        member.metadata = metadata;
        this.push('selectedMembers', member);
      }.bind(this));

      this.showPropertyEditor = false;
      this.set('lastSelectedMember', this.selectedMembers[ members.length - 1 ]);
      // this.fire('iron-selected', { item: this.lastSelectedMember, type: 'member' });

      // Show PropertyEditor
      // this.showPropertyEditor = (this.selectedMembers.length > 0 || this.selectedConnections.length > 0);
      this.showPropertyEditor = (this.selectedMembers.length > 0);
    },

    showPropertyEditorChanged: function (showPropertyEditor) {
      if (showPropertyEditor) {
        this.$.graphPanel.openDrawer();
      } else {
        this.$.graphPanel.closeDrawer();
      }
    },

    triggerAutolayout: function () {
      this.$.bdeGraph.triggerAutolayout(true);
    },

    zoomToFit: function () {
      this.$.bdeGraph.triggerFit();
    },

    onAddMemberBtcClick: function () {
      this.$.browser.open();
    },

    _addMember: function (event) {
      var cubble = event.detail.item;
      var endpointId = this.currentComponentMetadata.endpointId;
      var endpoint = this._artifact.endpoints.find(function (endpoint) { return endpoint.endpointId === endpointId; });
      var endpointPath = Polymer.Collection.get(this._artifact.endpoints).getKey(endpoint); // e.g. #0

      // Close the search dialog
      this.$.browser.close();

      var member = {
        memberId: cubble.memberId,
        componentId: cubble.metadata.webpackageId + '/' + cubble.metadata.artifactId,
        displayName: cubble.displayName
      };
      var promise = window.cubx.bde.bdeDataConverter.resolveMember(member, this.currentComponentMetadata.manifest, this._baseUrl(), this.resolutions);
      promise.then((data) => {
        this.$.bdeGraph.registerComponent(data.component);
        this.push('_artifact.members', data.member);
        this.push('_artifact.endpoints.' + endpointPath + '.dependencies',
          member.componentId + '/' + cubble.metadata.endpointId
        );
        // End of loading animation - animation started with this.fire('bde-member-loading');
        this.fire('bde-member-loaded');
      });
    },

    _addCubbleClass: function (showPropertyEditor) {
      return (showPropertyEditor) ? 'moveRight' : '';
    },

    _artifactChanged: function (changeRecord) {
      console.log('bde-dataflow-view _artifactChanged', changeRecord);
      if (!changeRecord) { return; }

      var compoundComponents = this.currentComponentMetadata.manifest.artifacts.compoundComponents;
      var path = new Polymer.Collection(compoundComponents).getKey(this._artifact);
      path = changeRecord.path.replace('_artifact', 'currentComponentMetadata.manifest.artifacts.compoundComponents.' + path);

      this.set(path, changeRecord.value);
      // this._updateGraph(changeRecord);
    },

    // _graphFromArtifact: function (artifact) {
    //   if (!artifact) { return; }
    //
    //   var graph = {
    //     'id': Math.random().toString(36).substring(7),
    //     'project': '',
    //     'properties': {
    //       'name': artifact.artifactId
    //     },
    //     'caseSensitive': true,
    //     'inports': {},
    //     'outports': {},
    //     'processes': {},
    //     'connections': []
    //   };
    //
    //   // External inslots
    //   artifact.connections
    //     .filter(function (connection) {
    //       return (!connection.source.memberIdRef &&
    //       connection.destination.memberIdRef);
    //     })
    //     .forEach(function (connection) {
    //       var slot = artifact.slots
    //         .filter(function (slot) {
    //           return slot.direction.indexOf('input') !== -1;
    //         })
    //         .find(function (slot) {
    //           return slot.slotId === connection.source.slot;
    //         });
    //
    //       graph.inports[ slot.slotId ] = {
    //         'process': connection.destination.memberIdRef,
    //         'port': connection.destination.slot,
    //         'metadata': { x: 15, y: 15 }
    //       };
    //     });
    //
    //   // External outslots
    //   artifact.connections
    //     .filter(function (connection) {
    //       return (!connection.destination.memberIdRef &&
    //       connection.source.memberIdRef);
    //     })
    //     .forEach(function (connection) {
    //       var slot = artifact.slots
    //         .filter(function (slot) {
    //           return slot.direction.indexOf('output') !== -1;
    //         })
    //         .find(function (slot) {
    //           return slot.slotId === connection.destination.slot;
    //         });
    //
    //       graph.inports[ slot.slotId ] = {
    //         'process': connection.source.memberIdRef,
    //         'port': connection.source.slot,
    //         'metadata': { x: 0, y: 0 }
    //       };
    //     });
    //
    //   // Members
    //   artifact.members.forEach(function (member) {
    //     graph.processes[ member.memberId ] = {
    //       'component': member.componentId,
    //       'metadata': {
    //         'x': 0,
    //         'y': 0,
    //         'label': member.displayName || member.memberId
    //       }
    //     };
    //   });
    //
    //   // Connections
    //   artifact.connections.forEach(function (con) {
    //     var connection = {
    //       'src': {
    //         'process': con.source.memberIdRef,
    //         'port': con.source.slot
    //       },
    //       'tgt': {
    //         'process': con.destination.memberIdRef,
    //         'port': con.destination.slot
    //       },
    //       'metadata': {}
    //     };
    //
    //     graph.connections.push(connection);
    //   });
    //
    //   // Initializers
    //   artifact.inits.forEach(function (init) {
    //     var connection = {
    //       'data': init.value,
    //       'tgt': {
    //         'process': init.memberIdRef,
    //         'port': init.slot
    //       }
    //     };
    //
    //     graph.connections.push(connection);
    //   });
    //
    //   return graph;
    // },

    _baseUrl: function () {
      return this.settings.baseUrl.replace(/\/?$/, '/') + this.settings.store + '/';
    },
    _urlFor: function (dependency) {
      var webpackageId = dependency.split('/')[ 0 ];

      var url = this._baseUrl();
      url += webpackageId + '/manifest.webpackage';

      return url;
    }
  });
})(this);
