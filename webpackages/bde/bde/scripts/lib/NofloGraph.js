(function(global) {

  'use strict';

  function NofloGraph(artifact) {

    if (!artifact || typeof artifact !== 'object') {
      throw new TypeError("`artifact` must be an object.");
    }

    // Setup
    this.id = Math.random().toString(36).substring(7);
    this.project = "";
    this.properties = {
      name: artifact.artifactId,
      environment: {}
    };
    this.inports = {};
    this.outports = {};
    this.groups = [];
    this.processes = {};
    this.connections = [];

    // Setup inports
    artifact.slots
      .filter(slot => slot.direction.indexOf('input') !== -1)
      .forEach((slot) => this.inports[slot.slotId] = {});

    // Populate inports
    artifact.connections
      .filter(connection => connection.source.memberIdRef === undefined)
      .forEach(function(connection) {
        this.inports[connection.source.slot] = {
          process: connection.destination.memberIdRef,
          port: connection.destination.slot,
          metadata: {}
        };
      }.bind(this));

    // Setup outports
    artifact.slots
      .filter(slot => slot.direction.indexOf('output') !== -1)
      .forEach((slot) => this.outports[slot.slotId] = {});

    // Populate outports
    artifact.connections
      .filter(connection => connection.destination.memberIdRef === undefined)
      .forEach(function(connection) {
        this.outports[connection.destination.slot] = {
          processes: connection.source.memberIdRef,
          port: connection.source.slot,
          metadata: {}
        };
      }.bind(this));

    // Processes
    artifact.members.forEach(function(member) {
      this.processes[member.memberId] = {
        component: member.componentId,
        metadata: {
          label: member.displayName || member.memberId
        }
      };
    }.bind(this));

    // Connections
    artifact.connections
      .filter(connection => connection.destination.memberIdRef !== undefined)
      .filter(connection => connection.source.memberIdRef !== undefined)
      .forEach(function(connection) {
        this.connections.push({
          src: {
            process: connection.source.memberIdRef,
            port: connection.source.slot
          },
          tgt: {
            processes: connection.destination.memberIdRef,
            port: connection.destination.slot
          },
          metadata: {}
        });
      }.bind(this));

    return this;
  };

  NofloGraph.prototype = {

    toString: function() {
      var args = Array.from(arguments);
      args.unshift(this);
      return JSON.stringify.apply(this, args);
    }

  };

  var exposed = global;

  exposed.NofloGraph = NofloGraph;

}(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window));
