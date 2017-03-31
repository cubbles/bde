'use strict';

function buildWebpackageId () { // eslint-disable-line no-unused-vars
  var groupId;
  var name;
  var version;
  if (arguments.length === 1 && typeof arguments[0] === 'object') {
    groupId = arguments[0].groupId;
    name = arguments[0].name;
    version = arguments[0].version;
  } else if (arguments.length === 3) {
    groupId = arguments[0];
    name = arguments[1];
    version = arguments[2];
  } else {
    throw new Error('Not expected arguments' + arguments.toString());
  }
  var webpackageId = name + '@' + version;
  if (groupId && groupId.length > 0) {
    webpackageId = groupId + '.' + webpackageId;
  }
  return webpackageId;
}

function createNewArtifact (obj) { // eslint-disable-line no-unused-vars
  var compound = {
    artifactId: null,
    artifactType: 'compoundComponent',
    description: null,
    runnables: [],
    resources: [],
    dependencies: [],
    slots: [],
    members: [],
    connections: [],
    inits: []
  };

  // Object.keys(compound).forEach((k) => { compound[ k ] = obj[ k ]; });
  var res = Object.assign(compound, obj);
  return res;
}
