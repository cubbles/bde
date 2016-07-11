(function(context) {
  "use strict";

  if (!context.fetch) {
    throw new Error("Browser must support Fetch API or have polyfill loaded.");
  }

  Polymer({
    is: 'bde-dataflow-view',

    properties: {

      artifact: {
        type: Object,
        notify: true,
        observer: '_artifactChanged'
      },

      manifest: {
        type: Object,
        observer: '_manifestChanged'
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
      '_handleSelectedNodesChanged(selectedNodes.splices)',
      '_handleSelectedEdgesChanged(sselectedEdges.splices)',
      'membersChanged(artifact.members.splices)',
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

    handleAddNode: function(event) {
      var node = event.detail;
      // @TODO (fdu): Get the cubble component from dependencies
      //              and add the new member
      console.log('handleAddNode', event.detail);
    },

    handleRemoveNode: function(event) {
      var node = event.detail;
      var memberIdx = this.artifact.members.findIndex(m => m.memberId === node.id);
      this.splice('artifact.members', memberIdx, 1);
    },

    handleAddInport: function(event, port) {
      var inport = this.$.graph.nofloGraph.inports[port];
      this.push('artifact.slots', {
        slotId: port,
        type: 'all', // @TODO (fdu): Fix this to be type of source slot
        direction: ['input']
      });
      this.push('artifact.connections', {
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
      var slotIdx = this.artifact.slots.findIndex(s => s.slotId === port);
      this.artifact.connections.forEach(function(connection, connectionIdx) {
          if (!connection.source.memberIdRef &&
               connection.source.slot === port) {
            this.splice('artifact.connections', connectionIdx, 1)
          }
        }, this);
      this.splice('artifact.slots', slotIdx, 1);
    },

    handleAddOutport: function(event, port) {
      var outport = this.$.graph.nofloGraph.outports[port];
      this.push('artifact.slots', {
        slotId: port,
        type: 'all', // @TODO (fdu): Fix this to be type of source slot
        direction: ['output']
      });
      this.push('artifact.connections', {
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
      var slotIdx = this.artifact.slots.findIndex(s => s.slotId === port);
      this.artifact.connections.forEach(function(connection, connectionIdx) {
          if (!connection.destination.memberIdRef &&
               connection.destination.slot === port) {
            this.splice('artifact.connections', connectionIdx, 1)
          }
        }, this);
      this.splice('artifact.slots', slotIdx, 1);
    },

    handleAddEdge: function(event) {
      var edge = event.detail;

      this.push('artifact.connections', {
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
      var cIdx = this.artifact.connections.findIndex(function(connection) {
        return connection.source.memberIdRef === edge.from.node &&
          connection.source.slot === edge.from.port &&
          connection.destination.memberIdRef === edge.to.node &&
          connection.destination.slit === edge.to.port;
      });

      this.splice('artifact.connections', cIdx, 1);
    },

    /**
     * Resolve dependencies in a cubble manifest
     *
     * Resolve all dependencies for the selected artifact
     * and add entries to library
     *
     * @param  {Object} manifest
     * @param  {Object} selectedArtifact
     * @param  {String} endpoint
     * @return {Promise}
     */
    resolveDependencies: function(manifest, selectedArtifact, endpoint) {
      return new Promise(function(resolve, reject) {
        // Need settings to be set here to continue
        if (!this.settings) { return; }

        var library = {};

        var dependencies = selectedArtifact.endpoints[endpoint].dependencies;

        // Resolve local dependencies
        dependencies
          .filter(function(d) { return d.startsWith('this'); })
          .forEach(function(dependency) {
            var artifact = findInManifest(dependency);

            library[artifact.artifactId] = {
              name: artifact.displayName || artifact.artifactId,
              description: artifact.description,
              icon: 'cog',
              inports: artifact.slots.filter(filterInslots).map(transformSlot),
              outports: artifact.slots.filter(filterOutslots).map(transformSlot),
            };
          });

        // Resolve remote dependencies
        var promises = [];
        dependencies
          .filter(function(d) { return !d.startsWith('this'); })
          .forEach(function(dependency) {
            // Resolve the dependency and add to library
            promises.push(new Promise(function(resolve, reject) {
              fetch(urlFor(dependency))
                .then(function(res) { return res.json() })
                .then(function(manifest) {
                  var artifactId = dependency.split('/')[1];
                  library[artifactId] = resolveDependency(dependency, artifactId);
                });
            }));
          });

        Promise.all(promises).then(function() {
          resolve(library);
        }).catch(reject);
      });

      function filterInslots(slot) {
        return (slot.direction.indexOf('input') !== -1);
      }

      function filterOutslots(slot) {
        return (slot.direction.indexOf('output') !== -1);
      }

      function findInManifest(artifactId) {
        // First part will always be 'this'
        var artifactId = artifactId.split('/')[1];

        return manifest.localArtifacts.find(function(artifact) {
          return artifact.artifactId === artifactId;
        });
      }

      function resolveDependency(manifest, artifactId) {
        var artifacts = [].concat(
          manifest.artifacts.elementaryComponents,
          manifest.artifacts.compoundComponents
        );
        var artifact = artifacts.find(function(artifact) {
          return artifact.artifactId === artifactId;
        })

        if (artifact) {
          return {
            name: artifact.displayName || artifact.artifactId,
            description: artifact.description,
            icon: 'cog',
            inports: artifact.slots.filter(filterInslots).then(transformSlot),
            outports: artifact.slots.filter(filterOutslots).then(transformSlot)
          };
        }
      }

      function transformSlot (slot) {
        return {
          name: slot.slotId,
          type: slots.type
        };
      }

      function urlFor(dependency) {
        var webpackageId = dependency.split('/')[0];

        var url = this.settings.baseUrl.replace(/\/?$/, '/') + this.settings.store + '/';
        url += webpackageId + '/webpackage.manifest';
      }

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

    _addCubble: function(event) {
      var item = event.detail.item;
      this.$.dialog.close();
      this.push('artifact.members', item);
      this.push('artifact.endpoints.#0.dependencies',
        item.metadata.webpackageId + '/' + item.metadata.artifactId
      );
    },

    _addCubbleClass: function(showPropertyEditor) {
      return (showPropertyEditor) ? 'moveRight' : '';
    },

    _artifactChanged: function(newArtifact, oldArtifact) {
      if (!newArtifact || newArtifact === oldArtifact) { return; }

      this.set('selectedNodes', Array());
      this.set('selectedEdges', Array());
      this.set('lastSelectedNode', void(0));
      this.set('lastSelectedEdge', void(0));

      this.set('graph', this._graphFromArtifact(newArtifact));
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
          "component": member.componentId,
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
    },

    _handleSelectedNodesChanged: function() {
      var selectedMembers = this.selectedNodes.map(this._memberForNode.bind(this));
      this.set('selectedMembers', selectedMembers);
      this.set('lastSelectedMember', this.selectedMembers[this.selectedMembers.length - 1]);
      this.fire('iron-selected', { item: this.lastSelectedMember, type: 'member' });

      // Show PropertyEditor
      this.showPropertyEditor = (this.selectedMembers.length > 0 || this.selectedConnections.length > 0);

    },

    _handleSelectedEdgesChanged: function() {
      var selectedConnections = this.sselectedEdges.mao(this._connectionForEdge.bind(this));
      this.set('selectedConnections', selectedConnections);
      this.set('lastSelectedConnection', this.selectedConnections[this.selectedConnections.length - 1]);
      this.fire('iron-selected', { item: this.lastSelectedEdge, type: 'edge' });

      // Show PropertyEditor
      this.showPropertyEditor = (this.selectedMembers.length > 0 || this.selectedConnections.length > 0);
    },

    /**
     * Parse the manifest and resolve all dependencies.
     * Add them to the-graph library.
     */
    _manifestChanged: function(manifest) {
      var dependencies = [];

      manifest.artifacts.elementaryComponents.forEach(extractComponentInfo);
      manifest.artifacts.compoundComponents.forEach(extractComponentInfo);

      this.$.graph.library = dependencies;

      function extractComponentInfo (artifact) {
        dependencies.push({
          name: artifact.artifactId,
          description: artifact.description,
          icon: 'cog',
          inports: artifact.slots.filter(filterInslots).map(transformSlot),
          outports: artifact.slots.filter(filterOutslots).map(transformSlot)
        });
      }

      function filterInslots (slot) {
        return (slot.direction.indexOf('input') !== -1);
      }

      function filterOutslots (slot) {
        return (slot.direction.indexOf('output') !== -1);
      }

      function transformSlot (slot) {
        return {
          name: slot.slotId,
          type: slot.type
        }
      }
    },

    _memberForNode: function(node) {
      return this.artifact.members.find(function(member) {
        return member.memberId === node.id;
      });
    },

    _connectionForEdge: function(edge) {
      return this.artifact.connections.find(function(connection) {
        return edge.from.node === connection.source.memberIdRef &&
               edge.to.node === connection.destination.memberIdRef &&
               edge.from.port === connection.source.slot &&
               edge.to.port === connection.destination.slot;
      });
    }
  });
})(this);
