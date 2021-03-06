(function (context) {
  'use strict';

  if (!context.fetch) {
    throw new Error('Browser must support Fetch API or have polyfill loaded.');
  }
  Polymer({
    is: 'bde-dataflow-view',

    properties: {

      // autolayoutAfterRerender: {
      //   type: Boolean,
      //   value: false
      // },
      /**
       * The metadata of the current component with properies artifactId and manifest object.
       * @type Object
       */
      currentComponentMetadata: {
        type: Object,
        notify: true
      },

      /**
       * The edit actions of the bde-graph contextmenu
       * @type Object
       */
      editActions: {
        type: Object,
        value: function () {
          return {
            main: function () {
              this.$.bdeCompoundDialog.set('artifact', this._artifact);
              this.$.bdeCompoundDialog.set('dialogOpened', true);
            }.bind(this),
            edge: function (graph, itemKey, item) {
              if (!item || !item.metadata || !item.metadata.connectionId) {
                console.error('Not a valid item.metadata.connectionId. Can not search for the connection.');
                return;
              }
              var connection = this._findConnectionInCurrentArtifact(item.metadata.connectionId);
              this.$.bdeConnectionDialog.set('connection', connection);
              this.$.bdeConnectionDialog.$.connectionDialog.open();
            }.bind(this),
            node: function (graph, itemKey, item, position) {
              var member = this._artifact.members.find((m) => m.memberId === itemKey);
              this.fire('bde-member-edit-dialog-open', member);
            }.bind(this),
            nodeInport: function (graph, itemKey, item) {
              this.fire('bde-edit-slot-init-dialog-open', {
                slot: this._findSlotInMemberArtifact(item.process, item.port),
                memberId: item.process
              });
            }.bind(this),
            // nodeOutport: function () {
            //   alert('Edit node outport: comming soon ...');
            // },
            graphInport: function (graph, itemKey, item) {
              this.fire('bde-edit-slot-init-dialog-open', {
                slot: this._findSlotInCurrentArtifact(itemKey),
                ownSlot: true
              });
            }.bind(this),
            graphOutport: function (graph, itemKey, item) {
              this.fire('bde-edit-slot-init-dialog-open', {
                slot: this._findSlotInCurrentArtifact(itemKey),
                ownSlot: true
              });
            }.bind(this)
          };
        }
      },

      /**
       * A map to cache the already resolved components. The key is the artifactId, the value has the property artifact with the artifact object, and the property componentId.
       * @type Object
       */
      resolutions: {
        type: Object,
        notify: true,
        value: function () {
          return {};
        }
      },

      /**
       * The list of the selected member components, completed with metadata for property editor.
       * @type Array
       */
      selectedMembersForProperties: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      /**
       * The list of selected connections.
       * @type Array
       */
      selectedConnections: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      /**
       * @type Object
       */
      settings: {
        type: Object
      },

      /**
       * The last selected member (node).
       * @type object
       */
      lastSelectedMember: {
        type: Object,
        notify: true
      },

      /**
       * The last selected connection.
       * @type Object
       */
      lastSelectedConnection: {
        type: Object,
        notify: true
      },

      /**
       * Current compound component, which is editing from the user.
       * @type Object
       */
      _artifact: {
        type: Object,
        notify: true
      },

      /**
       * The width of the graph.
       * @type Number
       */
      _graphWidth: {
        type: Number
      },

      /**
       * The height of the graph.
       * @type Number
       */
      _graphHeight: {
        type: Number
      },

      /**
       * The offset the x coordinate of the graph
       * @type Number
       */
      _graphOffsetX: {
        type: Number
      },

      /**
       * The offset the y coordinate of the graph
       * @type Number
       */
      _graphOffsetY: {
        type: Number
      },

      /**
       * the list of selected members (nodes) in the graph. The selected members has the  object structure of members used in the graph.
       * @type Array
       */
      _selectedMembers: {
        type: Array
      },

      /**
       * The list of selected edges in the graph.
       * @type Array
       */
      _selectedEdges: {
        type: Array
      }

    },

    observers: [
      '_currentComponentMetadataChanged(currentComponentMetadata.*)',
      '_selectedMembersChanged(_selectedMembers.splices)',
      '_selectedEdgesChanged(_selectedEdges.splices)',
      '_artifactIdChanged(_artifact.artifactId)',
      '_artifactConnectionsChanged(_artifact.connections.splices)',
      '_artifactSlotsChanged(_artifact.slots.splices)'
    ],

    listeners: {
      'bde-edit-slot-init-dialog-open': '_openSlotInitEditDialog',
      'bde-member-edit-dialog-open': '_openMemberEditDialog',
      'bde-want-autolayout': '_triggerAutolayout'
    },

    /* ********************************************************************/
    /* *********************** Lifecycle method ***************************/
    /* ********************************************************************/
    // _handleAddNode: function () {
    //   console.log(arguments);
    // },

    attached: function () {
      // Set initial graph size
      this.async(this.handleResize);

      // Resize cannot be bound using `listeners`
      window.addEventListener('resize', this.handleResize.bind(this));
    },
    /* ********************************************************************/
    /* ************************** public methods **************************/
    /* ********************************************************************/
    /**
     * Handle the resize event
     */
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

    /**
     * The method called on cklick of add member Button.
     */
    onAddMemberBtnClick: function () {
      this.$.browser.open();
    },

    /**
     * Reload the graf with the changed manifest or artifact.
     * 1. Reset slections
     * 2. resolve members
     * 3. init the graph
     * Resolved the member components
     */
    reload: function () {
      let manifest = this.currentComponentMetadata.manifest;
      let artifactId = this.currentComponentMetadata.artifactId;
      if (!manifest || !artifactId) { return; }

      this.set('_selectedMembers', []);
      this.set('_selectedEdges', []);
      this.set('_lastSelectedNode', void (0));
      this.set('_lastSelectedEdge', void (0));

      var artifact = manifest.artifacts.compoundComponents.find(function (artifact) {
        return artifact.artifactId === artifactId;
      });

      var bdeGraph = this.$.bdeGraph;
      if (bdeGraph.graphInitialized) {
        requestAnimationFrame(() => bdeGraph.rerender());
      } else {
        bdeGraph.rebuildGraph();
      }

      var promise = window.cubx.bde.bdeDataConverter.resolveArtifact(artifactId, manifest, this._baseUrl(), this.resolutions);
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

        this.autolayoutAfterRerender = true;
        if (this.autolayoutAfterRerender) {
          this.async(() => {
            requestAnimationFrame(() => bdeGraph.triggerAutolayout());
            this.set('autolayoutAfterRerender', false);
          }, 200);
        }
      });
    },

    reset: function () {
      this.$.bdeGraph.reset();
    },
    /**
     * Trigger the aotulayout.
     */
    triggerAutolayout: function () {
      this.$.bdeGraph.triggerAutolayout(true);
    },

    /**
     * Trigger to zoom for optimal presentation of the nodes.
     */
    zoomToFit: function () {
      this.$.bdeGraph.triggerFit();
    },

    /* ********************************************************************/
    /* ********************** property event listener**********************/
    /* ********************************************************************/
    /**
     * Load a new artifact results  areload of the graph.
     *
     * @param  {Object} manifest   [description]
     * @param  {String} artifactId [description]
     * @param  {String} endpointId [description]
     */
    _currentComponentMetadataChanged: function (changeRecord) {
      var manifest = this.currentComponentMetadata.manifest;
      var artifactId = this.currentComponentMetadata.artifactId;
      if (!manifest || !manifest.artifacts || !manifest.artifacts.compoundComponents) {
        return;
      }
      if (!manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === artifactId)) {
        return;
      }
      this.debounce('reload_graph', function () {
        this.reload();
      }, 100);
    },

    /* ********************************************************************/
    /* *********************** Graph event listener ***********************/
    /* ********************************************************************/

    _artifactConnectionsChanged: function (changeRecord) {
      if (!changeRecord) { return; }
      console.log(changeRecord);
      this._artifact.connections.forEach(con => {
        if (con && con.source.slot.indexOf('__SLOT__') === 0) {
          con.source.slot = con.source.slot.substr(8);
        }
        if (con && con.destination.slot.indexOf('__SLOT__') === 0) {
          con.destination.slot = con.destination.slot.substr(8);
        }
      });
      // BugFix changes are in changeRecord but not in _artifat property
      changeRecord.indexSplices.forEach(splice => {
        if (splice.addedCount > 0) {
          let con = splice.object[splice.index];
          if (!this._findConnectionInCurrentArtifact(con.connectionId)) {
            this.push('_artifact.connections', con);
          }
        }
        if (splice.removed && splice.removed.length > 0) {
          let connectionIndex = this._findConnectionIndexInCurrentArtifact(splice.removed[0].connectionId);
          if (connectionIndex > -1) {
            this.splice('_artifact.connections', connectionIndex, 1);
          }
        }
      });
    },

    _artifactSlotsChanged: function (changeRecord) {
      if (!changeRecord) { return; }
      console.log(changeRecord);

      // BugFix changes are in changeRecord but not in _artifat property
      changeRecord.indexSplices.forEach(splice => {
        if (splice.addedCount > 0) {
          let slot = splice.object[splice.index];
          if (!this._findSlotInCurrentArtifact(slot.slotId)) {
            this.push('_artifact.slots', slot);
          }
        }
        if (splice.removed && splice.removed.length > 0) {
          let slotIndex = this._findSlotIndexInCurrentArtifact(splice.removed[0].slotId);
          if (slotIndex > -1) {
            this.splice('_artifact.slots', slotIndex, 1);
          }
        }
      });
    },
    // _artifactMembersChanged: function (members) {
    //   console.log(members);
    // },

    /**
     * This handler method is called, if the selected edges changed.
     * @param {object} changeRecord
     */
    _selectedEdgesChanged: function (changeRecord) {
      var connections = this._selectedEdges.map(connectionForEdge.bind(this));
      this.set('selectedConnections', connections);
      this.set('lastSelectedConnection', connections[ connections.length - 1 ]);
      this.fire('iron-selected', { item: this._lastSelectedEdge, type: 'edge' });

      // Show PropertyEditor
      // this.showPropertyEditor = (this.selectedMembersForProperties.length > 0 || this.selectedConnections.length > 0);

      function connectionForEdge (edge) {
        return this._artifact.connections.find(function (connection) {
          return edge.from.node === connection.source.memberIdRef &&
            edge.to.node === connection.destination.memberIdRef &&
            edge.from.port === connection.source.slot &&
            edge.to.port === connection.destination.slot;
        });
      }
    },

    /**
     * This handler method is called, if the selected members (nodes) changed.
     * @param {object} changeRecord
     * @private
     */
    _selectedMembersChanged: function (changeRecord) {
      var members = this._selectedMembers;
      // add selected member with polymer array api methods for register changes in selectedMembersForProperties
      this.splice('selectedMembersForProperties', 0);
      members.forEach(function (member) {
        // add artifact metadata to member
        var artifactId = member.artifactId;
        var metadata = this.resolutions[ artifactId ].artifact || {};
        member.metadata = metadata;
        this.push('selectedMembersForProperties', member);
      }.bind(this));

      this.set('lastSelectedMember', this.selectedMembersForProperties[ members.length - 1 ]);
    },

    /* ********************************************************************/
    /* *********************** private methods ****************************/
    /* ********************************************************************/

    /**
     * Called if a new member selected in base browser.
     * @param {Event} event iron-selected event
     * @method _addMember
     */
    _addMember: function (event) {
      var cubble = event.detail.item;

      // Close the search dialog
      this.$.browser.close();

      var member = {
        memberId: cubble.memberId,
        artifactId: cubble.metadata.artifactId,
        displayName: cubble.displayName
      };

      var dependency = {
        artifactId: member.artifactId
      };
      if (cubble.metadata.webpackageId !== 'this') {
        dependency.webpackageId = cubble.metadata.webpackageId;
      }
      if (cubble.metadata.endpointId) {
        dependency.endpointId = cubble.metadata.endpointId;
      }
      if (!this._artifact.dependencies) {
        this.set('_artifact.dependencies', []);
      }
      this.push('_artifact.dependencies', dependency);

      var promise = window.cubx.bde.bdeDataConverter.resolveMember(member, cubble.metadata.webpackageId, this.currentComponentMetadata.manifest, this._baseUrl(), this.resolutions);
      promise.then((data) => {
        this.$.bdeGraph.registerComponent(data.component);
        this.push('_artifact.members', data.member);
        this.$.browser.refreshBrowserList();
        // End of loading animation - animation started with this.fire('bde-member-loading');
        this.fire('bde-member-loaded');
      });
    },
    /**
     * Called if the property _artifactId changed.
     * @param { object}changeRecord
     * @private
     */
    _artifactIdChanged: function (artifactId) {
      this.set('currentComponentMetadata.artifactId', artifactId);
      // let artifact = this._currentComponentMetadata.manifest.artifacts.compoundComponents.find(comp => comp.artifactId === artifactId);
      // this.set('_artifact', artifact);
    },

    /**
     * Get the store url
     * @returns {string}
     * @private
     */
    _baseUrl: function () {
      return this.settings.baseUrl.replace(/\/?$/, '/') + this.settings.store + '/';
    },

    /**
     * Find the connection with connection id in the current artifact.
     * @param {String} connectionId connection Id
     * @private
     */
    _findConnectionInCurrentArtifact: function (connectionId) {
      return this._artifact.connections.find((con) => con.connectionId === connectionId);
    },
    /**
     * Find the connection with connection id in the current artifact.
     * @param {String} connectionId connection Id
     * @private
     */
    _findConnectionIndexInCurrentArtifact: function (connectionId) {
      return this._artifact.connections.findIndex((con) => con.connectionId === connectionId);
    },
    /**
     * Find a slot in current artifact.
     * @param {string} slotId the slotId
     * @return {object} the slot object
     */
    _findSlotInCurrentArtifact: function (slotId) {
      return this._artifact.slots.find((slot) => slot.slotId === slotId || slot.slotId === slotId.replace('__SLOT__', ''));
    },
    /**
     * Find a slot in current artifact.
     * @param {string} slotId the slotId
     * @return {object} the slot object
     */
    _findSlotIndexInCurrentArtifact: function (slotId) {
      return this._artifact.slots.findIndex((slot) => slot.slotId === slotId || slot.slotId === slotId.replace('__SLOT__', ''));
    },
    /**
     * Find the slot definition in the member artifact.
     * @param {string} memberId the memberId
     * @param {string} slotId the slotId
     * @returns {object|undefined} the found slot object or undefined
     * @private
     */
    _findSlotInMemberArtifact: function (memberId, slotId) {
      var member = this._artifact.members.find((member) => member.memberId === memberId);
      if (member) {
        if (!member.metadata) {
          var artifactId = member.artifactId;
          var metadata = this.resolutions[ artifactId ].artifact || {};
          member.metadata = metadata;
        }
        var slot = member.metadata.slots.find((slot) => slot.slotId === slotId);
        return slot;
      }
      return null;
    },

    _openMemberEditDialog: function (evt) {
      var member = evt.detail;
      this.$.bdeMemberDialog.set('member', member);
      this.$.bdeMemberDialog.set('dialogOpened', true);
    },
    /**
     * Init and open the slot init edit dialog.
     * @param {Event} evt
     * @private
     */
    _openSlotInitEditDialog: function (evt) {
      this.$.bdeSlotEditDialog.set('slot', evt.detail.slot);
      // if (evt.detail.memberId && evt.detail.memberId.trim().length > 0) {
      this.$.bdeSlotEditDialog.set('memberId', evt.detail.memberId);
      // }
      if (typeof evt.detail.ownSlot !== 'undefined') {
        this.$.bdeSlotEditDialog.set('ownSlot', evt.detail.ownSlot);
      } else {
        this.$.bdeSlotEditDialog.set('ownSlot', false);
      }
      this.$.bdeSlotEditDialog.set('dialogOpened', true);
    },
    /**
     * Trigger autolayout
     * @private
     */
    _triggerAutolayout: function () {
      requestAnimationFrame(() => this.$.bdeGraph.triggerAutolayout());
    },
    /**
     * Get the url for the dependency
     * @param dependency
     * @returns {string}
     * @private
     */
    _urlFor: function (dependency) {
      var webpackageId = dependency.split('/')[ 0 ];

      var url = this._baseUrl();
      url += webpackageId + '/manifest.webpackage';

      return url;
    }

  });
})(this);
