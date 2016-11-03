// @importedBy bde-app.html
/* globals klayCubbles,TheGraph,ReactDOM */
(function () {
  'use strict';
  Polymer({

    is: 'bde-graph',

    properties: {

      artifactId: {
        type: String,
        notify: true
      },

      autolayout: {
        type: Boolean,
        value: true
      },

      /**
       * The list of connections (edges) between membrs in the graph
       *
       * @type {Array}
       * @property connections
       */
      connections: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      displaySelectionGroup: {
        type: Boolean,
        value: true,
        notify: true
      },

      editActions: {
        type: Object,
        value: function () {
          return {
            main: function () {
              alert('Edit the main document: comming soon ...');
            },
            edge: function () {
              alert('Edit edge: comming soon ...');
            },
            node: function () {
              alert('Edit node: comming soon ...');
            },
            nodeInport: function () {
              alert('Edit node inport: comming soon ...');
            },
            nodeOutport: function () {
              alert('Edit node outport: comming soon ...');
            },
            graphInport: function () {
              alert('Edit graph inport: comming soon ...');
            },
            graphOutport: function () {
              alert('Edit graph outport: comming soon ...');
            }
          };
        }
      },

      editable: {
        type: Boolean,
        value: true
      },

      forceSelection: {
        type: Boolean,
        value: false,
        notify: true
      },

      /**
       * A distance of grid points,
       *
       * @type {Number}
       * @property grid
       */
      grid: {
        type: Number,
        value: 72
      },

      /**
       * height of the graph
       *
       * @type {Number}
       * @property height
       */
      height: {
        type: Number,
        notify: true,
        reflectToAttribute: true,
        value: 600
      },
      /**
       * The list of initialisation objects inside of the shown compound components.
       * @type {Array}
       * @property inits
       */
      inits: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      /**
       * A list of component deifinitions used in the graph. (all prototypes of components for the graph.)
       *@type {Array}
       * @property libraray
       */
      library: {
        type: Object,
        value: function () {
          return {};
        }
      },

      maxZoom: {
        type: Number,
        value: 15,
        notify: true
      },

      menus: {
        type: Object,
        value: function () {
          return {};
        }
      },

      minZoom: {
        type: Number,
        value: 0.15,
        notify: true
      },

      /**
       * The list of the members components (nodes) in the graph
       *
       * @type {Array}
       * @property members
       */
      members: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      /**
       * offset for x position of the graph. (left side distance distance  of the graph)
       *
       * @type {Number}
       * @property offsetX
       */
      offsetX: {
        type: Number,
        notify: true,
        value: null
      },

      /**
       * offset for y position of the graph. (top distance  of the graph)
       *
       * @type {Number}
       * @property offsetY
       */
      offsetY: {
        type: Number,
        notify: true,
        value: null
      },

      pan: {
        type: Object,
        notify: true,
        value: function () {
          return { x: 0, y: 0 };
        }
      },

      scale: {
        type: Number,
        value: 1,
        notify: true
      },

      /**
       * The list of selected connections.
       *
       * @type {Array}
       * @property selectedConnections
       */
      selectedConnections: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      /**
       * the list of selected input slots
       * @type {Array}
       * @property selectedInputSlots
       */
      selectedInputSlots: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      /**
       * The list of selected members.
       *
       * @type {Array}
       * @property selectedMembers
       */
      selectedMembers: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      /**
       * the list of selected output slots
       * @type {Array}
       * @property selectedOutputSlots
       */
      selectedOutputSlots: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      slots: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      snap: {
        type: Number,
        value: 36
      },

      theme: {
        type: String,
        notify: true,
        reflectToAttribute: true,
        value: 'dark'
      },

      /**
       * width of the graph
       *
       * @type {Number}
       * @property width
       */
      width: {
        type: Number,
        notify: true,
        reflectToAttribute: true,
        value: 800
      },

      _autolayouter: {
        type: Object,
        value: function () {
          return {};
        }
      },

      _appView: {
        type: Object,
        value: null
      },

      _graph: {
        type: Object,
        value: function () {
          return {};
        }
      },

      _graphView: {
        type: Object,
        value: null
      },

      _selectedEdges: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },
      /**
       * Hold intern the slot-Array. Changes for the slot property should be after the update actions to the graph updated with the slots properties.
       * @type Array
       *
       */
      _slots: {
        type: Array
      }
    },

    observers: [
      '_autolayoutChanged(autolayout)',
      '_connectionsChanged(connections.*)',
      '_dimensionsChanged(width, height)',
      '_displaySelectionGroupChanged(displaySelectionGroup)',
      '_forceSelectionChanged(forceSelection)',
      '_initsChanged(inits.*)',
      '_membersChanged(members.*)',
      '_panChanged(pan)',
      '_selectedEdgesChanged(_selectedEdges.splices)',
      '_selectedMembersChanged(selectedMembers.*)',
      '_selectedOutputSlotChanged(selectedOutputSlots.*)',
      '_selectedInputSlotChanged(selectedInputSlots.*)',
      '_slotsChanged(slots.*)',
      '_themeChanged(theme)',
      '_editActionsChanged(editActions.*)'
    ],

    listeners: {
      'svgcontainer.track': '_noop',
      'svgcontainer.tap': '_noop',
      'svgcontainer.up': '_noop',
      'svgcontainer.down': '_noop'
    },
    /* ***************************************************/
    /* **************** Lifecycle Methods ****************/
    /* ***************************************************/
    created: function () {
      // Initialize the autolayouter
      this._autolayouter = klayCubbles.init({
        onSuccess: this._applyAutolayout.bind(this),
        workerScript: '../../klayjs/klay.js'
      });
      // Attach context menus
      this._defineMenus();
    },
    ready: function () {

    },
    attached: function () {
      window.addEventListener('resize', this.onResize.bind(this));
      this.onResize();
    },
    /* ***************************************************/
    /* **************** Public Methods *******************/
    /* ***************************************************/
    /**
     * This is called by the graph, when a context menu is shown.
     */
    getMenuDef: function (options) {
      var defaultMenu;

      // Options: type, graph, itemKey, item
      if (options.type && this.menus[ options.type ]) {
        defaultMenu = this.menus[ options.type ];
        if (defaultMenu.callback) {
          return defaultMenu.callback(defaultMenu, options);
        }
        return defaultMenu;
      }
    },

    /**
     * Build or rebuild the graph.
     */
    rebuildGraph: function () {
      if (!this._graph) { return; }

      if (this._graph.removeListener) {
        this._graph.removeListener('endTransaction', this.onGraphChanged.bind(this));
      }

      this._graph = window.createGraph(this.artifactId, { caseSensitive: true });

      // Listen for graph changes
      this._graph.on('endTransaction', this.onGraphChanged.bind(this));
      this._graph.on('addEdge', this.onAddEdge.bind(this));
      this._graph.on('addNode', this.onAddNode.bind(this));
      this._graph.on('removeEdge', this.onRemoveEdge.bind(this));
      this._graph.on('addInport', this.onAddInport.bind(this));
      this._graph.on('removeInport', this.onRemoveInport.bind(this));
      this._graph.on('addOutport', this.onAddOutport.bind(this));
      this._graph.on('removeOutport', this.onRemoveOutport.bind(this));
      this._graph.on('addInitial', this.onAddInitial.bind(this));
      this._graph.on('removeInitial', this.onRemoveInitial.bind(this));

      if (this._appView) {
        // Remove previous instance
        ReactDOM.unmountComponentAtNode(this.$.svgcontainer);
        this._appView = null;
      }

      // Setup app
      this.$.svgcontainer.innerHTML = '';
      this._appView = ReactDOM.render(window.TheGraph.App({
        graph: this._graph,
        width: this.width,
        height: this.height,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        library: this.library,
        menus: this.menus,
        getMenuDef: this.getMenuDef,
        displaySelectionGroup: this.displaySelectionGroup,
        editable: this.editable,
        forceSelection: this.forceSelection,
        onEdgeSelection: this.onEdgeSelection.bind(this),
        onNodeSelection: this.onNodeSelection.bind(this),
        onInportSelection: this.onInportSelection.bind(this),
        onOutportSelection: this.onOutportSelection.bind(this),
        onPanScale: this.onPanScale.bind(this),
        offsetY: this.offsetY,
        offsetX: this.offsetX
      }), this.$.svgcontainer);
      this._graphView = this._appView.refs.graph;
    },

    /**
     * This will register a component with the graph
     * and force a _rerender
     * @param {object}definition an object with node definition
     * <code><pre>
     *   {
     *    "name": "my-component", // artifactId
     *    "icon": "cogs", // icon for component
     *    "inports": [
     *      { // input slot as inport
     *        "name": "firstInputSlot",
     *        "type": "boolean"
     *      }, {
     *        "name": "secondInputSlot",
     *        "type": "string"
     *      },
     *    ],
     *    "outports": [
     *      { // outputslot as outport
     *        "name": "firstOutputSlot",
     *        "type": "object"
     *      },
     *      {
     *        "name": "secondOutputSlot",
     *        "type": "string"
     *      }
     *    ]
     *  },
     * </pre><code>
     */
    registerComponent: function (definition) {
      var component = this.library[ definition.name ];
      if (component) {
        // Don't override real definition with dummy
        return;
      }
      this.library[ definition.name ] = definition;
      this.notifyPath('library', this.library);

      // Render changes
      this._debounceLibraryRefresh();
    },

    /**
     * Trigger to run the autolayout.
     */
    triggerAutolayout: function () {
      var portInfo = this._graphView ? this._graphView.portInfo : null;

      // Call the autolayouter
      this._autolayouter.layout({
        'graph': this._graph,
        'portInfo': portInfo,
        'direction': 'RIGHT',
        'options': {
          'intCoordinates': true,
          'algorithm': 'de.cau.cs.kieler.klay.layered',
          'layoutHierarchy': true,
          'spacing': 36,
          'borderSpacing': 20,
          'edgeSpacingFactor': 0.2,
          'inLayerSpacingFactor': 2,
          'nodePlace': 'BRANDES_KOEPF',
          'nodeLayering': 'NETWORK_SIMPLEX',
          'edgeRouting': 'POLYLINE',
          'crossMin': 'LAYER_SWEEP',
          'direction': 'RIGHT'
        }
      });
    },

    /**
     * Trigger to run the fit to optimal zoomlevel
     */
    triggerFit: function () {
      if (!this._appView) { return; }
      this._appView.triggerFit();
    },

    /* ***************************************************/
    /* **************** Graph Handler Methods ******************/
    /* ***************************************************/

    onAddEdge: function (edge) {
      var connection = this._getConnectionForEdge(edge);
      if (!connection) {
        var newConnection = {
          connectionId: edge.metadata.connectionId,

          source: {
            //  memberIdRef: edge.from.node,
            slot: edge.from.port
          },
          destination: {
            // memberIdRef: edge.to.node,
            slot: edge.to.port
          }
        };
        if (edge.from.node) {
          newConnection.source.memberIdRef = edge.from.node;
        }
        if (edge.to.node) {
          newConnection.destination.memberIdRef = edge.to.node;
        }
        if (edge.metadata.description){
          newConnection.description = edge.metadata.description;
        }
        this.push('connections', newConnection);
      }
    },

    onAddInitial: function (initializer) {},

    onAddInport: function (publicPort, port) {
      var slot = this._getSlotForPort(publicPort);
      if (!slot) {
        this.push('slots', {
          slotId: publicPort,
          type: port.metadata.type,
          description: port.metadata.description,
          direction: [ 'input' ]
        });
      }
    },

    onAddNode: function (node) {
      var member = this._getMemberForNode(node);
      if (!member) {
        this.push('members', {
          memberId: node.id,
          artifactId: node.artifactId,
          componentId: node.metadata.componentId
        });
      }
    },

    onAddOutport: function (publicPort, port) {
      var slot = this._getSlotForPort(publicPort);
      if (slot) {
        if (slot.direction.indexOf('output') === -1) {
          this.splice('slots', this.slots.indexOf(slot), 1);
          slot.direction.push('output');
          this.push('slots', slot);
        }
      } else {
        this.push('slots', {
          slotId: publicPort,
          type: port.metadata.type,
          description: port.metadata.description,
          direction: [ 'output' ]
        });
      }
    },

    onGraphChanged: function (transaction, metadata) {
      console.log('onGraphChanged', ...arguments);
    },

    onRemoveEdge: function (edge) {
      var connection = this._getConnectionForEdge(edge);
      var idx = this.connections.indexOf(connection);
      if (idx !== -1) {
        this.splice('connections', idx, 1);
      }
    },

    onResize: function (event) {
      this.width = this.parentElement.offsetWidth;
      this.height = this.parentElement.offsetHeight;
    },

    onRemoveInitial: function (initializer) {},

    onRemoveInport: function (key, port) {
      var slot = this._getSlotForPort(key);
      var idx = this.slots.indexOf(slot);
      if (!slot) { return; }

      this.splice('slots', idx, 1);

      if (slot.direction.length > 1) {
        slot.direction = [ 'output' ];
        this.push('slots', slot);
      }
    },

    onRemoveNode: function (node) {
      var member = this._getMemberForNode(node);
      var idx = this.members.indexOf(member);
      if (member) {
        this.splice('members', idx, 1);
      }
    },

    onRemoveOutport: function (key, port) {
      var slot = this._getSlotForPort(key);
      var idx = this.slots.indexOf(slot);
      if (!slot) { return; }

      this.splice('slots', idx, 1);

      if (slot.direction.length > 1) {
        slot.direction = [ 'input' ];
        this.push('slots', slot);
      }
    },

    onRenameNode: function (oldId, newId) {
      // @todo: (fdu) Do we need this?
      // Removing a member would trigger a change in graph
      // so this is actually a removeNode/addNode operation.
    },

    onEdgeSelection: function (itemKey, item, toggle) {
      var index, isSelected, shallowClone;

      if (itemKey === undefined) {
        if (this._selectedEdges.length > 0) {
          this.splice('_selectedEdges', 0, this._selectedEdges.length);
        }
      } else {
        if (toggle) {
          index = this._selectedEdges.indexOf(item);
          isSelected = index !== -1;
          shallowClone = this._selectedEdges.slice();
          if (isSelected) {
            shallowClone.splice(index, 1);
            this.set('_selectedEdges', shallowClone);
          } else {
            shallowClone.push(item);
            this.set('_selectedEdges', shallowClone);
          }
        } else {
          this.splice('_selectedEdges', 0, this._selectedEdges.length);
          this.push('_selectedEdges', item);
        }
      }
    },

    onInportSelection: function (itemKey, metadata, toggle) {
      console.log(' onInportSelection itemKey', itemKey, 'metadata', metadata, 'toggle', toggle);

      var slot;
      var index;
      var isSelected;

      if (itemKey === undefined) {
        this.splice('selectedInputSlots', 0, this.selectedInputSlots.length);
        return;
      }

      slot = this._getSlotForPort(itemKey);
      index = this.slots.indexOf(slot);
      if (toggle) {
        isSelected = (index !== -1);
        if (isSelected) {
          this.splice('selectedInputSlots', this.selectedInputSlots.indexOf(slot), 1);
        } else {
          this.push('selectedInputSlots', slot);
        }
      } else {
        this.splice('selectedInputSlots', 0, this.selectedInputSlots.length);
        this.push('selectedInputSlots', slot);
      }
    },

    onNodeSelection: function (itemKey, item, toggle) {
      var member, index, isSelected;

      if (itemKey === undefined) {
        this.splice('selectedMembers', 0, this.selectedMembers.length);
        return;
      }

      member = this._getMemberForNode(item);
      index = this.selectedMembers.indexOf(member);
      if (toggle) {
        isSelected = (index !== -1);
        if (isSelected) {
          this.splice('selectedMembers', this.selectedMembers.indexOf(member), 1);
        } else {
          this.push('selectedMembers', member);
        }
      } else {
        this.splice('selectedMembers', 0, this.selectedMembers.length);
        this.push('selectedMembers', member);
      }
    },

    onPanScale: function (x, y, scale) {
      this.set('pan', { x: x, y: y });
      this.set('scale', scale);
    },

    onOutportSelection: function (itemKey, metadata, toggle) {
      console.log('onOutportSelection temKey', itemKey, 'metadata', metadata, 'toggle', toggle);
      var slot;
      var index;
      var isSelected;

      if (itemKey === undefined) {
        this.splice('selectedOutputSlots', 0, this.selectedOutputSlots.length);
        return;
      }

      slot = this._getSlotForPort(itemKey);
      index = this.slots.indexOf(slot);
      if (toggle) {
        isSelected = (index !== -1);
        if (isSelected) {
          this.splice('selectedOutputSlots', this.selectedOutputSlots.indexOf(slot), 1);
        } else {
          this.push('selectedOutputSlots', slot);
        }
      } else {
        this.splice('selectedOutputSlots', 0, this.selectedOutputSlots.length);
        this.push('selectedOutputSlots', slot);
      }
    },
    /* ***********************************************************************/
    /* ***************************** private methods *************************/
    /* ***********************************************************************/
    _addConnectionToGraph: function (conn) {
      var metadata = {
        connectionId: conn.connectionId,
        copyValue: conn.copyValue,
        repeatedValues: conn.repeatedValues,
        hookFunction: conn.hookFunction,
        description: conn.description,

      };
      this._graph.addEdge(
        conn.source.memberIdRef, conn.source.slot,
        conn.destination.memberIdRef, conn.destination.slot,
        metadata
      );
    },
    /**
     * Add a node for a member to the graph.
     * @param {Object} member member of the compound
     * @private
     */
    _addMemberToGraph: function (member) {
      var coordinates = this._calculateCoordiantes();
      if (!this._getNodeForMember(member)) {
        var metadata = {
          displayName: member.displayName || member.memberId,
          description: member.description,
          componentId: member.componentId,

          x: member.x || coordinates.x,
          y: member.y || coordinates.y
        };
        this._graph.addNode(member.memberId, member.artifactId, metadata);
        if (!this.library[ member.artifactId ]) {
          console.warn('Component', member.artifactId, 'is not defined for the graph');
        }
      }
    },

    _addSlotToGraph: function (slot) {
      var isOutputSlot = false;
      var isInputSlot = false;
      if (slot.direction && slot.direction.find((direction) => direction === 'output')) {
        isOutputSlot = true;
      }
      if (slot.direction && slot.direction.find((direction) => direction === 'input')) {
        isInputSlot = true;
      }

      if (!slot.direction || slot.direction.length === 0) {
        isOutputSlot = true;
        isInputSlot = true;
      }
      if (isOutputSlot && this._graph.outports[ slot.slotId ]) {
        return;
      }
      if (isInputSlot && this._graph.inports[ slot.slotId ]) {
        return;
      }
      var metadata = {
        description: slot.description
      };
      if (isInputSlot) {
        this._graph.addInport(slot.slotId, slot.type, metadata);
      }
      if (isOutputSlot) {
        this._graph.addOutport(slot.slotId, slot.type, metadata);
      }
    },

    _applyAutolayout: function (layoutedKGraph) {
      var nofloNode, klayChild, idSplit, expDirection, expKey, metadata;

      this._graph.startTransaction('autolayout');

      // Update graph nodes with the new coordinates from KIELER graph
      layoutedKGraph.children.forEach(function (klayNode) {
        nofloNode = this._graph.getNode(klayNode.id);

        // Nodes inside groups
        if (klayNode.children) {
          Object.keys(klayNode.children).forEach(function (idx) {
            klayChild = klayNode.children[ idx ];
            if (klayChild.id) {
              this._graph.setNodeMetadata(klayChild.id, {
                x: Math.round((klayNode.x + klayChild.x) / this.snap) * this.snap,
                y: Math.round((klayNode.y + klayChild.y) / this.snap) * this.snap
              });
            }
          }, this);
        }

        metadata = {
          x: Math.round(klayNode.x / this.snap) * this.snap,
          y: Math.round(klayNode.y / this.snap) * this.snap
        };

        // Nodes outside groups
        if (nofloNode) {
          this._graph.setNodeMetadata(klayNode.id, metadata);
        } else {
          // Find inport or outport
          idSplit = klayNode.id.split(':::');
          expDirection = idSplit[ 0 ];
          expKey = idSplit[ 1 ];

          if (expDirection === 'inport' && this._graph.inports[ expKey ]) {
            this._graph.setInportMetadata(expKey, metadata);
          } else if (expDirection === 'outport' && this._graph.outports[ expKey ]) {
            this._graph.setOutportMetadata(expKey, metadata);
          }
        }
      }, this);

      this._graph.endTransaction('autolayout');

      // Fit the window
      this.triggerFit();
    },

    /**
     * Calculate a x and y coordinates of a new member
     * @returns {{x: number, y: number}}
     * @private
     */
    _calculateCoordiantes: function () {
      var x = this._getRandomInt(0, this.grid);
      var y = this._getRandomInt(0, this.grid);
      var coord = {
        x: x,
        y: y
      };
      return coord;
    },

    _debounceLibraryRefresh: function () {
      this.debounce('debounceLibraryRefresh', function () {
        this._rerender({ libraryDirty: true });
      }, 200);
    },

    /**
     * Convert the coords for usage in graph sreen.
     * @param {x: Nember, x: Number} coords coordinates
     * @returns {{x: *, y: *}}
     * @private
     * @jtrs transform method
     */
    _transformMenuPosition: function (coords) {
      var svg = this.querySelector('svg');
      var point = svg.createSVGPoint();
      point.x = coords.x;
      point.y = coords.y;
      // get svg elem with class= view (screen for graph
      var CTMView = this.querySelector('.view').getScreenCTM();
      // transform from menu coords to graph view coords
      var transformedPoint = point.matrixTransform(CTMView.inverse());
      return {
        x: transformedPoint.x,
        y: transformedPoint.y
      };
    },

    /**
     * Define the circular context menus for the graph
     */
    _defineMenus: function () {
      var pasteMenu = {
        icon: 'paste',
        iconLabel: 'paste',
        action: function (graph, itemKey, item, position) {
          var pasted = TheGraph.Clipboard.paste(graph, this._transformMenuPosition(position)); // @jtrs tran
          var members = pasted.nodes.map(this._getMemberForNode.bind(this));
          this.set('selectedMembers', members);
          this.set('selectedConnections', []);
        }.bind(this)
      };

      var nodeActions = {
        delete: function (graph, itemKey, item, position) {
          var member = this._getMemberForNode(item);
          var index = this.members.indexOf(member);
          this.splice('members', index, 1);

          // Remove selection
          var newSelection = this.selectedMembers.filter(function (selected) {
            return selected !== member;
          });
          this.set('selectedMembers', newSelection);
        }.bind(this),

        copy: function (graph, itemKey, item, position) {
          TheGraph.Clipboard.copy(graph, [ itemKey ]);
        }.bind(this) // eslint-disable-line no-extra-bind
      };

      var edgeActions = {
        delete: function (graph, itemKey, item, position) {
          var connection = this._getConnectionForEdge(item);
          var index = this.connections.indexOf(connection);
          this.splice('connections', index, 1);

          // Remove selection
          var newSelection = this.selectedConnections.filter(function (selected) {
            return selected !== connection;
          });
          this.set('selectedConnections', newSelection);
        }.bind(this)
      };

      var exportOutportAction = function (graph, itemKey, item) {
        var pub = item.port;
        var count = 0;
        // Make sure public is unique
        while (graph.outports[ pub ]) {
          pub = item.port + (++count);
        }
        var priNode = graph.getNode(item.process);
        var metadata = {
          x: priNode.metadata.x + 144,
          y: priNode.metadata.y + this._getRandomInt(0, this.grid)
        };

        graph.addOutport(pub, item.type, metadata);
        graph.addEdge(item.process, item.port, undefined, pub, {
          route: 5
        });
      }.bind(this);

      var exportInportAction = function (graph, itemKey, item) {
        var pub = item.port;

        if (pub === 'start') {
          pub = 'start1';
        }

        if (pub === 'graph') {
          pub = 'graph1';
        }

        var count = 0;
        // Make sure public is unique
        while (graph.inports[ pub ]) {
          pub = item.port + (++count);
        }
        var priNode = graph.getNode(item.process);
        var metadata = {
          x: priNode.metadata.x - 144,
          y: priNode.metadata.y + this._getRandomInt(0, this.grid)
        };

        graph.addInport(pub, item.type, metadata);
        graph.addEdge(undefined, pub, item.process, item.port, {
          route: 2
        });
      }.bind(this);

      var menus = {

        // Background
        main: {

          icon: 'sitemap',
          // n4: {
          //   iconLabel: 'edit',
          //   icon: 'pencil-square-o',
          //   action: this.editActions.main
          // },
          e4: pasteMenu
        },

        // Connection
        edge: {
          actions: edgeActions,
          icon: 'long-arrow-right',
          // n4: {
          //   iconLabel: 'edit',
          //   icon: 'pencil-square-o',
          //   action: this.editActions.edge
          // },
          s4: {
            icon: 'trash-o',
            iconLabel: 'delete',
            action: edgeActions.delete
          }
        },

        // Members
        node: {
          actions: nodeActions,
          // n4: {
          //   iconLabel: 'edit',
          //   icon: 'pencil-square-o',
          //   action: this.editActions.node
          // },
          s4: {
            icon: 'trash-o',
            iconLabel: 'delete',
            action: nodeActions.delete
          },
          w4: {
            icon: 'copy',
            iconLabel: 'copy',
            action: nodeActions.copy
          }
        },

        nodeInport: {
          // n4: {
          //   iconLabel: 'edit',
          //   icon: 'pencil-square-o',
          //   action: this.editActions.nodeInport
          // },
          w4: {
            icon: 'sign-in',
            iconLabel: 'export',
            action: exportInportAction
          }
        },

        nodeOutport: {
          // n4: {
          //   iconLabel: 'edit',
          //   icon: 'pencil-square-o',
          //   action: this.editActions.nodeOutport
          // },
          e4: {
            icon: 'sign-out',
            iconLabel: 'export',
            action: exportOutportAction
          }
        },

        // Exported Slots
        graphInport: {
          icon: 'sign-in',
          iconColor: 2,
          // n4: {
          //   iconLabel: 'edit',
          //   icon: 'pencil-square-o',
          //   action: this.editActions.graphInport
          // },
          s4: {
            icon: 'trash-o',
            iconLabel: 'delete',
            action: function (graph, itemKey, item) {
              graph.removeInport(itemKey);
            }
          }
        },

        graphOutport: {
          icon: 'sign-out',
          iconColor: 5,
          // n4: {
          //   iconLabel: 'edit',
          //   icon: 'pencil-square-o',
          //   action: this.editActions.graphOutport
          // },
          s4: {
            icon: 'trash-o',
            iconLabel: 'delete',
            action: function (graph, itemKey, item) {
              graph.removeOutport(itemKey);
            }
          }
        },

        // Selection
        selection: {
          icon: 'th',
          w4: {
            icon: 'copy',
            iconLabel: 'copy',
            action: function (graph, itemKey, item) {
              TheGraph.Clipboard.copy(graph, item.nodes);
            }
          },
          e4: pasteMenu
        }
      };

      this.set('menus', menus);
    },

    _getConnectionForEdge: function (edge) {
      console.log('_getConnectionForEdge this.connections', this.connections);
      console.log('_getConnectionForEdge edge', edge);
      return this.connections.find(function (conn) {
        return conn.source.memberIdRef === edge.from.node &&
          conn.source.slot === edge.from.port &&
          conn.destination.memberIdRef === edge.to.node &&
          conn.destination.slot === edge.to.port;
      });
    },

    _getEdgeFromConnection: function (connection) {
      return {
        'from': {
          'node': connection.source.memberIdRef,
          'port': connection.source.slot
        },
        'metadata': {},
        'to': {
          'node': connection.destination.memberIdRef,
          'port': connection.destination.slot
        }
      };
    },

    _getNodeForMember: function (member) {
      return this._graph.nodes.find(function (node) {
        return member.memberId === node.id;
      });
    },

    _getMemberForNode: function (node) {
      return this.members.find(function (member) {
        return member.memberId === node.id;
      });
    },

    /**
     * Generate and get a random integer  between min and max
     * @param {Number} min lower limit for the random integer
     * @param {Number }max upper limit for the random integer
     * @returns {number} the generated random integer
     * @private
     */
    _getRandomInt: function (min, max) {
      var minInt = Math.ceil(min);
      var maxInt = Math.floor(max);
      return Math.floor(Math.random() * (maxInt - minInt)) + minInt;
    },

    _getSlotForPort: function (publicPort) {
      return this.slots.find(function (slot) {
        return slot.slotId === publicPort;
      });
    },

    _focusMember: function (member) {
      if (!this._graph) { return; }
      var node = this._graph.getNode(member.memberId);

      if (!node) { return; }
      this.$._appView.focusNode(node);
    },

    _noop: function (event) {
      // Don't propagate events beyond the graph
      event.stopPropagation();
    },

    _rerender: function (options) {
      if (!this._graphView) { return; }
      this._graphView.markDirty(options);
    },
    /* ***********************************************************************/
    /* ***************************** change methods *************************/
    /* ***********************************************************************/
    _autolayoutChanged: function (autolayout) {
      if (!this._graph) { return; }

      // Only listen to changes that affect layout
      if (this.autolayout) {
        this._graph.on('addNode', this.triggerAutolayout.bind(this));
        this._graph.on('removeNode', this.triggerAutolayout.bind(this));
        this._graph.on('addInport', this.triggerAutolayout.bind(this));
        this._graph.on('removeInport', this.triggerAutolayout.bind(this));
        this._graph.on('addOutport', this.triggerAutolayout.bind(this));
        this._graph.on('removeOutport', this.triggerAutolayout.bind(this));
        this._graph.on('addEdge', this.triggerAutolayout.bind(this));
        this._graph.on('removeEdge', this.triggerAutolayout.bind(this));
      } else {
        this._graph.removeListener('addNode', this.triggerAutolayout.bind(this));
        this._graph.removeListener('removeNode', this.triggerAutolayout.bind(this));
        this._graph.removeListener('addInport', this.triggerAutolayout.bind(this));
        this._graph.removeListener('removeInport', this.triggerAutolayout.bind(this));
        this._graph.removeListener('addOutport', this.triggerAutolayout.bind(this));
        this._graph.removeListener('removeOutport', this.triggerAutolayout.bind(this));
        this._graph.removeListener('addEdge', this.triggerAutolayout.bind(this));
        this._graph.removeListener('removeEdge', this.triggerAutolayout.bind(this));
      }
    },

    /**
     * Called if the connections list changed. (Added or removed connections.)
     * @param {Object} changeRecord the polymer chamgeRecord object
     */
    _connectionsChanged: function (changeRecord) {
      var i, index, conn, metadata, path;

      if (!changeRecord) { return; }

      // Connections were added or removed
      if (changeRecord.path === 'connections.splices') {
        changeRecord.value.indexSplices.forEach(function (s) {
          // Connections were removed
          s.removed.forEach(function (conn) {
            this._graph.removeEdge(
              conn.source.memberIdRef, conn.source.slot,
              conn.destination.memberIdRef, conn.destination.slot
            );
          }, this);

          // Connections were added
          for (i = 0; i < s.addedCount; i++) {
            index = s.index + i;
            conn = s.object[ index ];
            this._addConnectionToGraph(conn);
          }
        }, this);
      } else if (changeRecord.path === 'connections' || changeRecord.path === 'connections.length') {
        // Connections were set
        if (changeRecord.value instanceof Array && changeRecord.value.length > 0) {
          for (let i = 0; i < changeRecord.value.length; i++) {
            this._addConnectionToGraph(changeRecord.value[ i ]);
          }
        }
        // @todo: (fdu) Do we need to do something here?
      } else {
        // Connection was changed
        path = changeRecord.path.replace(/connections\.#\d+(\.\S+)/, ''); // Strip everything after the index
        conn = this.get(path); // Get the referred connection
        metadata = {
          connectionId: conn.connectionId,
          copyValue: conn.copyValue,
          repeatedValues: conn.repeatedValues,
          hookFunction: conn.hookFunction,
          description: conn.description
        };
        this._graph.setEdgeMetadata(
          conn.source.memberIdRef, conn.source.slot,
          conn.destination.memberIdRef, conn.destination.slot,
          metadata
        );
      }
    },

    _dimensionsChanged: function (width, height) {
      if (!this._appView) { return; }
      this._appView.setState({
        width: width,
        height: height
      });
    },

    _displaySelectionGroupChanged: function (displaySelectionGroup) {
      if (!this._graphView) { return; }
      this._graphView.setState({ displaySelectionGroup: displaySelectionGroup });
    },

    _editActionsChanged: function (changeRecord) {
      console.log(changeRecord);
      if (changeRecord.path === 'editActions') { // the whole object changed
        var actionsObject = changeRecord.value;
        for (let action in actionsObject) {
          if (actionsObject.hasOwnProperty(action)) {
            if (this.menus && this.menus[ action ]) {
              this.menus[ action ].n4 = {
                iconLabel: 'edit',
                icon: 'pencil-square-o',
                action: actionsObject[ action ]
              };
            }
          }
        }
        for (let m in this.menus) {
          if (this.menus.hasOwnProperty(m)) {
            if (!actionsObject[ m ]) {
              delete this.menus[ m ].n4;
            }
          }
        }
      } else if (changeRecord.path.startsWith('editActions.')) { // one of the menus changed
        var action = changeRecord.path.split('.')[ 1 ];
        if (this.menus && this.menus[ action ]) {
          this.menus[ action ].n4.action = changeRecord.value;
        }
      }
    },

    _forceSelectionChanged: function (forceSelection) {
      if (!this._graphView) { return; }
      this._graphView.setState({ forceSelection: forceSelection });
    },
    /**
     * Called if the inits list changed. (Added or removed connections.)
     * @param {Object} changeRecord the polymer chamgeRecord object
     */
    _initsChanged: function (changeRecord) {
      if (!changeRecord) { return; }
      // Inits were added or removed
      if (changeRecord.path === 'inits.splices') {
        changeRecord.value.indexSplices.forEach(function (s) {
          // Inits were removed
          s.removed.forEach(function (init) {
            this._graph.removeInitial(init.memberIdRef, init.slot);
          });

          // Inits were added
          for (let i = 0; i < s.addedCount; i++) {
            let index = s.index + i;
            init = s.object[ index ];
            let metadata = {
              description: init.description
            };
            this._graph.addInitial(init.value, init.memberIdRef, init.slot, metadata);
          }
        }, this);
      } else if (changeRecord.path === 'inits' || changeRecord.path === 'inits.length') {
        // Inits were set
        if (changeRecord.value instanceof Array && changeRecord.value.length > 0) {
          this._graph.initializers = [];
          for (let i = 0; i < changeRecord.value.length; i++) {
            var init = changeRecord.value[ i ];
            let metadata = {
              description: init.description
            };
            this._graph.addInitial(init.value, init.memberIdRef, init.slot, metadata);
          }
        }
      } else {
        // Init was changed
        let path = changeRecord.path.replace(/(inits\.#\d+)(\.\S+)/, '$1'); // Strip everything after the index
        init = this.get(path); // Get the referred init
        let metadata = {
          description: init.description
        };
        this._graph.updateInitial(init.value, init.memberIdRef, init.slot, metadata);
      }
    },

    /**
     * Called if the members list changed. (For Example added or removed members.)
     * @param {Object} changeRecord the polymer changeRecord object
     */
    _membersChanged: function (changeRecord) {
      var i, index, member, path;

      if (!changeRecord) { return; }

      // Members were added or remove
      if (changeRecord.path === 'members.splices') {
        changeRecord.value.indexSplices.forEach(function (s) {
          // Members were removed
          s.removed.forEach(function (member) {
            this._graph.removeNode(member.memberId);
          }, this);
          // Members were added
          for (i = 0; i < s.addedCount; i++) {
            index = s.index + i;
            member = s.object[ index ];
            this._addMemberToGraph(member);
          }
        }, this);
      } else if (changeRecord.path === 'members' || changeRecord.path === 'members.length') {
        // Members were set
        if (changeRecord.value instanceof Array && changeRecord.value.length > 0) {
          for (let i = 0; i < changeRecord.value.length; i++) {
            this._addMemberToGraph(changeRecord.value[ i ]);
          }
        }
      } else {
        // Member was modified
        path = changeRecord.path.replace(/(members\.#\d+)(\.\S+)/, '$1'); // Strip everything after the index
        member = this.get(path); // Get the referred member
        this._graph.setNodeMetadata(member.memberId, {
          label: member.displayName || member.memberId,
          description: member.description
        });
      }
    },

    _panChanged: function (pan) {
      // Send pan back to React
      if (!this._appView) { return; }
      this._appView.setState(pan);
    },

    _selectedEdgesChanged: function (changeRecord) {
      var i, conn, index;

      if (!changeRecord || !this._graphView) { return; }

      changeRecord.indexSplices.forEach(function (s) {
        s.removed.forEach(function (edge) {
          conn = this._getConnectionForEdge(edge);
          index = this.selectedConnections.indexOf(edge);
          this.splice('selectedConnections', index, 1);
        }, this);

        for (i = 0; i < s.addedCount; i++) {
          index = s.index + i;
          conn = s.object[ index ];
          this.push('selectedConnections', conn);
        }
      }, this);

      this._graphView.setSelectedEdges(this._selectedEdges);
      this.fire('edges', this._selectedEdges);
    },

    /**
     * Called, if the list of selectedMembers changed by selction or deselection of members,
     * @param {Object} changeRecord the polymer chamgeRecord object
     */
    _selectedMembersChanged: function (changeRecord) {
      if (!changeRecord || !this._graphView) { return; }

      var selectedNodesHash = {};
      this.selectedMembers.forEach(function (member) {
        selectedNodesHash[ member.memberId ] = true;
      });

      this._graphView.setSelectedNodes(selectedNodesHash);
    },

    _selectedInputSlotChanged: function (changeRecord) {
      if (!changeRecord || !this._graphView) { return; }
      var selectedNodesHash = {};
      this.selectedInputSlots.forEach(function (port) {
        selectedNodesHash[ port.slotId ] = true;
      });

      this._graphView.setSelectedNodes(selectedNodesHash);
    },

    _selectedOutputSlotChanged: function (changeRecord) {
      if (!changeRecord || !this._graphView) { return; }
      var selectedNodesHash = {};
      this.selectedOutputSlots.forEach(function (port) {
        selectedNodesHash[ port.slotId ] = true;
      });

      this._graphView.setSelectedNodes(selectedNodesHash);
    },

    _slotsChanged: function (changeRecord) {
      console.log('##########_slotsChanged changeRecord', changeRecord);
      var i, index, slot, path, key, value;

      if (!changeRecord) { return; }

      // Slots were added or removed
      if (changeRecord.path === 'slots.splices') {
        changeRecord.value.indexSplices.forEach(function (s) {
          // Slots were removed
          s.removed.forEach(function (slot) {
            if (slot.direction.indexOf('input') !== -1) {
              this._graph.removeInport(slot.slotId);
            }
            if (slot.direction.indexOf('output') !== -1) {
              this._graph.removeOutport(slot.slotId);
            }
          }, this);

          // Slot was added
          for (i = 0; i < s.addedCount; i++) {
            index = s.index + i;
            slot = s.object[ index ];
            this._addSlotToGraph(slot);
          }
        }, this);
      } else if (changeRecord.path === 'slots' || changeRecord.path === 'slots.length') {
        // Slots were set
        if (changeRecord.value instanceof Array && changeRecord.value.length > 0) {
          for (let i = 0; i < changeRecord.value.length; i++) {
            this._addSlotToGraph(changeRecord.value[ i ]);
          }
        }
      } else {
        // Slot was modified
        path = changeRecord.path.match(/slots\.(#\d+)(\.(\S*))?$/);
        key = path[ 1 ];

        value = changeRecord.value;
        slot = Polymer.Collection.get(this.slots).getItem(key);

        if (path.length === 4) {
          let changeKey = path[ 3 ];
          if (changeKey === 'description' || changeKey === 'type') {
            this._updateSlotMetadata(slot, { key: changeKey, value: value });
          }

          if (changeKey === 'slotId') {
            let oldSlot = Polymer.Collection.get(this._slots).getItem(key);
            this._updateSlotInGraph(slot, oldSlot);
          }
        }
      }

      this._updateInternalSlotProperty();
    },

    _themeChanged: function (theme) {
      this.$.svgcontainer.classList.remove('the-graph-dark', 'the-graph-light');
      this.$.svgcontainer.classList.add('the-graph-' + theme);
    },

    _updateInternalSlotProperty: function () {
      if (this.slots) {
        let _slots = [];
        this.slots.forEach((slot) => {
          let _slot = JSON.parse(JSON.stringify(slot));
          _slots.push(_slot);
        });
        this.set('_slots', _slots);
      }
    },
    _updateSlotMetadata: function (slot, changes) {
      if (!slot.direction || slot.direction.includes('input')) {
        let metadata = this._graph.getInportMetadata(slot.slotId);
        for (let prop in changes) {
          if (changes.hasOwnProperty(prop)) {
            metadata[ prop ] = changes[ prop ];
          }
        }
        this._graph.setInportMetadata(slot.slotId, metadata);
      }
      if (!slot.direction || slot.direction.includes('output')) {
        let metadata = this._graph.getOutportMetadata(slot.slotId);
        for (let prop in changes) {
          if (changes.hasOwnProperty(prop)) {
            metadata[ prop ] = changes[ prop ];
          }
        }
        this._graph.setOutportMetadata(slot.slotId, metadata);
      }
    },

    _updateSlotInGraph: function (slot, oldSlot) {
      if (!slot.direction || slot.direction.includes('input')) {
        let oldPort = this._graph.inports[ oldSlot.slotId ];
        // TODO getEdges with old inport
        let slotEdges = this._graph.edges.filter((edge) => (edge.from.port === oldSlot.slotId));
        this._addSlotToGraph(slot);
        let newPort = this._graph.inports[ slot.slotId ];
        newPort.metadata.x = oldPort.metadata.x;
        newPort.metadata.y = oldPort.metadata.y;
        slotEdges.forEach((edge) => {
          this._graph.addEdge(undefined, slot.slotId, edge.to.node, edge.to.port, edge.metadata);
          this._graph.removeEdge(undefined, oldSlot.slotId, edge.to.node, edge.to.port);
        });
        this._graph.removeInport(oldSlot.slotId);
      }
      if (!slot.direction || slot.direction.includes('output')) {
        let oldPort = this._graph.outports[ oldSlot.slotId ];
        let slotEdges = this._graph.edges.filter((edge) => (edge.to.port === oldSlot.slotId));
        this._addSlotToGraph(slot);
        let newPort = this._graph.outports[ slot.slotId ];
        newPort.metadata.x = oldPort.metadata.x;
        newPort.metadata.y = oldPort.metadata.y;
        slotEdges.forEach((edge) => {
          this._graph.addEdge(edge.from.node, edge.from.port, undefined, slot.slotId, edge.metadata);
          this._graph.removeEdge(edge.from.node, edge.from.port, undefined, oldSlot.slotId);
        });
        this._graph.removeOutport(oldSlot.slotId);
      }
    }
  });
})();
