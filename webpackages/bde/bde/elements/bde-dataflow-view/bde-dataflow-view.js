(function(context) {
  "use strict";

  if (!context.fetch) {
    throw new Error("Browser must support Fetch API or have polyfill loaded.");
  }

  Polymer({
    is: 'bde-dataflow-view',

    properties: {

      currentComponentMetadata: {
        type: Object,
        notify: true
      },

      selectedMembers: {
        type: Array,
        notify: true,
        value: function() {
          return [];
        }
      },

      selectedConnections: {
        type: Array,
        notify: true,
        value: function() {
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
        type: Object
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

      _selectedNodes: {
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
      'manifestChanged(currentComponentMetadata.manifest)',
      'membersChanged(_artifact.members.splices)',
      'selectedNodesChanged(_selectedNodes.splices)',
      'selectedEdgesChanged(_selectedEdges.splices)',
      'showPropertyEditorChanged(showPropertyEditor)'
    ],

    listeners: {
      'library-update-required': 'onLibraryUpdate',
      'the-graph-add-node': 'handleAddNode',
      'the-graph-remove-node': 'handleRemoveNode',
      'the-graph-add-inport': 'handleAddInport',
      'the-graph-remove-inport': 'handleRemoveInport',
      'the-graph-add-outport': 'handleAddOutport',
      'the-graph-remove-outport': 'handleRemoveOutport',
      'the-graph-add-edge': 'handleAddEdge',
      'the-graph-remove-edge': 'handleRemoveEdge'
    },

    attached: function() {
      // Set initial graph size
      this.async(this._handleResize);

      // Resize cannot be bound using `listeners`
      window.addEventListener('resize', this._handleResize.bind(this));
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
    artifactIdChanged: function(manifest, artifactId, endpointId) {

      if (!manifest || !artifactId || !endpointId) { return; }

      this.set('_selectedNodes', Array());
      this.set('_selectedEdges', Array());
      this.set('_lastSelectedNode', void(0));
      this.set('_lastSelectedEdge', void(0));

      var self = this;
      var settings = this.settings;
      var artifact = manifest.localArtifacts.find(function(artifact) {
        return artifact.artifactId === artifactId;
      });
      var endpoint = artifact.endpoints.find(function(endpoint) {
        return endpoint.endpointId === endpointId;
      });

      this.set('_artifact', artifact);
      this.notifyPath('currentComponentMetadata.manifest', this.currentComponentMetadata.manifest);

      // Go through all dependencies and resolve,
      // either from the same webpackage or by requesting the base
      Promise.all(endpoint.dependencies.map(resolveDependency))
        .then(function(resolutions) {
          var newLibrary = {};

          resolutions.forEach(function(resolution) {
            newLibrary[resolution.artifactId] = resolution.definition;
          });

          // We are done, load the graph
          self.set('library', newLibrary);
          self.set('graph', self._graphFromArtifact(artifact));
          self.triggerAutolayout();
        });

      function artifactToComponent(artifact) {
        return {
          artifactId: artifact.artifactId,
          definition: {
            name: artifact.displayName || artifact.artifactId,
            description: artifact.description,
            icon: 'cog',
            inports: artifact.slot ? artifact.slots.filter(filterInslots).map(transformSlot) : [],
            outports: artifact.slot ? artifact.slots.filter(filterOutslots).map(transformSlot) : []
          }
        };
      }

      function filterInslots(slot) {
        return (slot.direction.indexOf('input') !== -1);
      }

      function filterOutslots(slot) {
        return (slot.direction.indexOf('output') !== -1);
      }

      function findInManifest(manifest, artifactId) {
        // We don't care about webpackageId here
        var artifactId = artifactId.split('/')[1];
        var artifacts = [];
        Object.keys(manifest.artifacts).forEach(function(artifactType) {
          artifacts = artifacts.concat(manifest.artifacts[artifactType]);
        });

        return artifacts.find(function(artifact) {
          return artifact.artifactId === artifactId;
        });
      }

      function resolveDependency(dependency) {
        return new Promise(function(resolve, reject) {
          if (dependency.startsWith('this')) { // Resolve local dependency
            var artifact = findInManifest(manifest, dependency);

            resolve(artifactToComponent(artifact));
          } else { // Resolve remote dependency
            fetch(urlFor(dependency))
              .then(function(response) { return response.json() })
              .then(function(manifest) {
                var artifact = findInManifest(manifest, dependency);

                resolve(artifactToComponent(artifact));
              });
          }
        });
      }

      function transformSlot (slot) {
        return { name: slot.slotId, type: slot.type };
      }

      function urlFor(dependency) {
        var webpackageId = dependency.split('/')[0];

        var url = settings.baseUrl.replace(/\/?$/, '/') + settings.store + '/';
        url += webpackageId + '/manifest.webpackage';

        return url;
      }
    },

    handleAddNode: function(event) {
      var node = event.detail;
      // @TODO (fdu): Get the cubble component from dependencies
      //              and add the new member
      console.log('handleAddNode', event.detail);
    },

    handleRemoveNode: function(event) {
      var node = event.detail;
      var memberIdx = this._artifact.members.findIndex(m => m.memberId === node.id);
      this.splice('_artifact.members', memberIdx, 1);
    },

    handleAddInport: function(event, port) {
      var inport = this.$.graph.nofloGraph.inports[port];
      this.push('_artifact.slots', {
        slotId: port,
        type: 'all', // @TODO (fdu): Fix this to be type of source slot
        direction: ['input']
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

    handleRemoveInport: function(event, port) {
      var slotIdx = this._artifact.slots.findIndex(s => s.slotId === port);
      this._artifact.connections.forEach(function(connection, connectionIdx) {
          if (!connection.source.memberIdRef &&
               connection.source.slot === port) {
            this.splice('_artifact.connections', connectionIdx, 1)
          }
        }, this);
      this.splice('_artifact.slots', slotIdx, 1);
    },

    handleAddOutport: function(event, port) {
      var outport = this.$.graph.nofloGraph.outports[port];
      this.push('_artifact.slots', {
        slotId: port,
        type: 'all', // @TODO (fdu): Fix this to be type of source slot
        direction: ['output']
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

    handleRemoveOutport: function(event, port) {
      var slotIdx = this._artifact.slots.findIndex(s => s.slotId === port);
      this._artifact.connections.forEach(function(connection, connectionIdx) {
          if (!connection.destination.memberIdRef &&
               connection.destination.slot === port) {
            this.splice('_artifact.connections', connectionIdx, 1)
          }
        }, this);
      this.splice('_artifact.slots', slotIdx, 1);
    },

    handleAddEdge: function(event) {
      var edge = event.detail;

      this.push('_artifact.connections', {
        connectionId: Math.random().toString(36).substring(7),
        source: {
          memberIdRef: edge.from.node,
          slot: edge.from.port
        },
        destination: {
          memberIdRef: edge.to.node,
          slot: edge.to.port
        }
      });
    },

    handleRemoveEdge: function(event) {
      var edge = event.detail;
      var cIdx = this._artifact.connections.findIndex(function(connection) {
        return connection.source.memberIdRef === edge.from.node &&
          connection.source.slot === edge.from.port &&
          connection.destination.memberIdRef === edge.to.node &&
          connection.destination.slit === edge.to.port;
      });

      this.splice('_artifact.connections', cIdx, 1);
    },

    membersChanged: function(changeRecord) {
      if (!changeRecord) { return; }

      changeRecord.indexSplices.forEach(function(s) {
        // @TODO (fdu) removed.forEach(...)

        for(var i = 0; i < s.addedCount; i++) {
          this.$.graph.addMember(s.object[s.index + i]);
        }
      }, this);
    },

    onLibraryUpdate: function(event) {
      var component = event.detail.item;
      this.$.graph.registerComponent(component, false);
    },

    selectedEdgesChanged: function(changeRecord) {
      var connections = this._selectedEdges.map(connectionForEdge.bind(this));
      this.set('selectedConnections', connections);
      this.set('lastSelectedConnection', connections[connections.length - 1]);
      this.fire('iron-selected', { item: this._lastSelectedEdge, type: 'edge' });

      // Show PropertyEditor
      this.showPropertyEditor = (this.selectedMembers.length > 0 || this.selectedConnections.length > 0);

      function connectionForEdge(edge) {
        return this._artifact.connections.find(function(connection) {
          return edge.from.node === connection.source.memberIdRef &&
                   edge.to.node === connection.destination.memberIdRef &&
                 edge.from.port === connection.source.slot &&
                   edge.to.port === connection.destination.slot;
        });
      }
    },

    selectedNodesChanged: function(changeRecord) {
      var members = this._selectedNodes.map(memberForNode.bind(this));

      this.set('selectedMembers', members);
      this.set('lastSelectedMember', members[members.length - 1]);
      this.fire('iron-selected', { item: this.lastSelectedMember, type: 'member' });

      // Show PropertyEditor
      this.showPropertyEditor = (this.selectedMembers.length > 0 || this.selectedConnections.length > 0);

      function memberForNode(node) {
        return this._artifact.members.find(function(member) {
          return member.memberIdRef === node.id;
        });
      }
    },

    showPropertyEditorChanged: function(showPropertyEditor) {
      if (showPropertyEditor) {
        this.$.drawerPanel.openDrawer();
      } else {
        this.$.drawerPanel.closeDrawer();
      }
    },

    triggerAutolayout: function() {
      this.$.graph.triggerAutolayout(true);
    },

    zoomToFit: function() {
      this.$.graph.triggerFit();
    },

    _addMember: function(event) {
      var item = event.detail.item;
      this.$.dialog.close();

      this.push('_artifact.members', item);
      this.push('_artifact.endpoints.#0.dependencies',
        item.metadata.webpackageId + '/' + item.metadata.artifactId + '/' + item.metadata.endpointId
      );
    },

    _addCubbleClass: function(showPropertyEditor) {
      return (showPropertyEditor) ? 'moveRight' : '';
    },

    _graphFromArtifact: function(artifact) {
      if (!artifact) { return; }

      var graph = {
        "id": Math.random().toString(36).substring(7),
        "project": "",
        "properties": {
          "name": artifact.artifactId
        },
        "caseSensitive": true,
        "inports": {},
        "outports": {},
        "processes": {},
        "connections": []
      };

      // External inslots
      artifact.connections
      .filter(function(connection) {
        return (!connection.source.memberIdRef &&
          connection.destination.memberIdRef);
      })
      .forEach(function(connection) {
        var slot = artifact.slots
        .filter(function(slot) {
          return slot.direction.indexOf('input') !== -1;
        })
        .find(function(slot) {
          return slot.slotId === connection.source.slot;
        });

        graph.inports[slot.slotId] = {
          "process": connection.destination.memberIdRef,
          "port": connection.destination.slot,
          "metadata": { x: 0, y: 0 }
        };
      });

      // External outslots
      artifact.connections
      .filter(function(connection) {
        return (!connection.destination.memberIdRef &&
          connection.source.memberIdRef);
      })
      .forEach(function(connection) {
        var slot = artifact.slots
        .filter(function(slot) {
          return slot.direction.indexOf('output') !== -1;
        })
        .find(function(slot) {
          return slot.slotId === connection.destination.slot;
        });

        graph.inports[slot.slotId] = {
          "process": connection.source.memberIdRef,
          "port": connection.source.slot,
          "metadata": { x: 0, y: 0 }
        };
      });

      // Members
      artifact.members.forEach(function(member) {
        graph.processes[member.memberId] = {
          "component": member.componentId.split('/')[1],
          "metadata": {
            "x": 0,
            "y": 0,
            "label": member.displayName || member.memberId
          }
        };
      });

      // Connections
      artifact.connections.forEach(function(connection) {
        var connection = {
          "src": {
            "process": connection.source.memberIdRef,
            "port": connection.source.slot
          },
          "tgt": {
            "process": connection.destination.memberIdRef,
            "port": connection.destination.slot
          },
          "metadata": {}
        };

        graph.connections.push(connection);
      });

      // Initializers
      artifact.inits.forEach(function(init) {
        var connection = {
          "data": init.value,
          "tgt": {
            "process": init.memberIdRef,
            "port": init.slot
          }
        };

        graph.connections.push(connection);
      });

      return graph;
    },

    _handleResize: function() {
      var clientRects = this.getClientRects();
      var width = clientRects[0].width;
      var height = clientRects[0].height;
      var offsetX = clientRects[0].left;
      var offsetY = clientRects[0].top;

      this._graphWidth = width;
      this._graphHeight = height;
      this._graphOffsetX = offsetX;
      this._graphOffsetY = offsetY;
    }
  });
})(this);
