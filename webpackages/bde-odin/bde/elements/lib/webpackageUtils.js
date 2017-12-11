'use strict';

/**
 * Build and returns the webpackageId from  groupId, name and webpackageId. Parameters are: Wether the manifest object or groupId, name and version in this order.
  * @returns {string}
 */
function buildWebpackageId () { // eslint-disable-line no-unused-vars
  var groupId;
  var name;
  var version;
  if (arguments.length === 1 && typeof arguments[0] === 'object' && arguments[0] !== null) {
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

/**
 * Creates a returns a new empty compound.
 * @param {object} obj artifact properties
 * @returns {*}
 */
function createNewArtifact (obj) { // eslint-disable-line no-unused-vars
  if (!obj) {
    obj = {};
  }
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

/**
 * Split a webpackageId to groupId, name and version and returns in a new object with this properties.
 * @param {string} webpackageId a webpackageId
 * @returns {{}} an object with groupId, name and version properties.
 */
function splitWebpackageId (webpackageId) { // eslint-disable-line no-unused-vars
  var splittedObject = {};
  var splitting = webpackageId.split('@');
  var lastIndexOfPoint = splitting[0].lastIndexOf('.');
  if (lastIndexOfPoint > -1) {
    splittedObject.name = splitting[0].substr(lastIndexOfPoint + 1);
    splittedObject.groupId = splitting[0].substr(0, lastIndexOfPoint);
  } else {
    splittedObject.name = splitting[0];
    splittedObject.groupId = null;
  }

  splittedObject.version = splitting[1];
  return splittedObject;
}

/**
 * Generate a unique display name for the choosen component.
 * (Search in all members displayname with patterns  {artifactId}-{number}, find the largest number,
 * and added as a new displayname {artifactId}-{bigestNumber + 1}, or if no displayname with the pattern exist added {artifactId}-1
 *
 * @param  {[String]} artifactId [current cubble's artifactId]
 * @return {[String]}            [modified artifactId]
 * @method _generateDisplayName
 */
function generateDisplayName (artifactId, members) { // eslint-disable-line no-unused-vars
  var filteredMembers = members.filter(function (member) {
    return member && member.displayName && member.displayName.startsWith(artifactId);
  });
  if (filteredMembers.length === 0) {
    return artifactId;
  }
  var max = 0;
  filteredMembers.forEach(function (member) {
    var ext = member.displayName.substr(artifactId.length);
    if (ext.startsWith('-') && !isNaN(ext.substr(1))) {
      max = Math.max(max, ext.substr(1));
    }
  });
  return artifactId + '-' + (++max);
}
