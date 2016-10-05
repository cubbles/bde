(function () {
  'use strict';
  /**
   * class for convert cubbles manifest data for uses in graph
   * <code><pre>
   *   {
   *      components: [
   *        {
   *          name: 'base-chart', // name_of_component
   *          icon: 'cog', // icon for node cog for elementary and cogs for compound components
   *          inports: [
   *            {
   *              name: 'input', // name of the slot. this is the same as the slotId on slots array
   *              type: 'object' // type of the slot, all possible slottypes: number, boolean, string, object, array
   *            }
   *          ],
   *          outports: [
   *            {
   *              name: 'message', // name of the slot.
   *              type: 'string' // type of the slot, all possible slot types: number, boolean, string, object, array
   *            }
   *        }
   *     ],
   *     slots: [ // see schema-definition for manifest.webpacksge
   *       {
   *          slotId: 'input',
   *          type: 'object',
   *          directions: [ 'input', 'output'],
   *          descripton: 'input data, with format',
   *          value: {
   *            a: 8
   *          }
   *       }
   *     ],
   *     members: [
   *        {
   *          memberId: 'firstMembet', // see schema-definition for manifest.webpacksge
   *          componentId: 'my-artifact' // origin componentId is modified. Actuel is a artifactId
   *        }
   *     ],
   *     connections: [
   *        { // see schema-definition for manifest.webpacksge
   *          ...
   *        }
   *     ],
   *     inits: [
   *        { // see schema-definition for manifest.webpacksge
   *           ...
   *        }
   *     ],
   *   }

   *   <pre/></code>
   */
  class BdeDataConverter {
    /**
     * constructor define the icons for the compound and elementary nodes
     * @param {string} compoundIcon icon for compound components
     * @param {string} elementaryIcon icon for elemntary components
     */
    constructor (compoundIcon, elementaryIcon) {
      this.compoundIcon = compoundIcon;
      this.elementaryIcon = elementaryIcon;
    }

    /**
     * generate the data for the graph. For this convert the data of the artifact. for member resolution fetch the member components
     * from cubbles base, if they not enclosed in the same webpackage.
     * @param {string} artifactId id of the compound component to show in the graph
     * @param {object} manifest the webpackage manifest, wich included the artifact with artifactId.
     * @param {string} baseUrl base url to a cubbles base store
     * @param {array} resolutions resolutions array
     * @returns {Promise} Return a Promise wich will resolved with convertedData object.
     */
    resolveArtifact (artifactId, manifest, baseUrl, resolutions) {
      var promise = new Promise(function (resolve, reject) {
        var data = {
          components: [],
          members: [],
          slots: [],
          connections: [],
          inits: []
        };
        var artifact = this._getCompoundComponent(manifest, artifactId);
        if (!artifact) {
          console.error('The artifact with id "' + artifactId + '" not found in manifest.artifacts.compoundComponents.');
          return data;
        }
        if (artifact.members) {
          data.members = this._convertMembers(artifact.members);
        }
        if (artifact.slots) {
          data.slots = [ ...artifact.slots ];
        }
        if (artifact.connections) {
          data.connections = [ ...artifact.connections ];
        }
        if (artifact.inits) {
          data.inits = [ ...artifact.inits ];
        }
        this._fetchComponents(artifact, manifest, baseUrl, resolutions).then((components) => {
          data.components = components;
          resolve(data);
        }, (error) => {
          reject(error);
        });
      }.bind(this));
      return promise;
    }

    /**
     * convert a member object to a data structurs for add to the graph.
     * <code><pre>
     *   {
     *      component: {
   *          name: 'base-chart', // name_of_component
   *          icon: 'cog', // icon for node cog for elementary and cogs for compound components
   *          inports: [
   *            {
   *              name: 'input', // name of the slot. this is the same as the slotId on slots array
   *              type: 'object' // type of the slot, all possible slottypes: number, boolean, string, object, array
   *            }
   *          ],
   *          outports: [
   *            {
   *              name: 'message', // name of the slot.
   *              type: 'string' // type of the slot, all possible slot types: number, boolean, string, object, array
   *            }
   *        },
     *      member: {
   *          memberId: 'firstMembet', // see schema-definition for manifest.webpacksge
   *          componentId: 'my-artifact' // origin componentId is modified. Actuel is a artifactId
   *        }
     *   }
     * </pre></code>
     * @param {string} member member object from manifest which should be added as a member to the graph
     * @param {object} manifest the current manifest
     * @param {string} baseUrl the base url
     * @param {array} resolutions resolutions array
     * @returns {{components: Array, members: Array, slots: Array, connections: Array, inits: Array}}
     */
    resolveMember (member, manifest, baseUrl, resolutions) {
      function resolveFunction (resolve, reject) {
        var componentPromise = this._fetchComponent(member, manifest, baseUrl, resolutions);

        componentPromise.then((component) => {
          let data = {
            component: component,
            member: this._convertMember(member)
          };
          resolve(data);
        }, (error) => {
          reject(error);
        });
      };
      var promise = new Promise(resolveFunction.bind(this));
      return promise;
    }

    /**
     * Find the compound component with artifactId in the manifest, and get it.
     * @param {object} manifest
     * @param {string} artifactId
     * @returns {object|undefined} the found component, or undefined if the compound component not in the manifest.
     * @private
     */
    _getCompoundComponent (manifest, artifactId) {
      try {
        return manifest.artifacts.compoundComponents.find((compound) => compound.artifactId === artifactId);
      } catch (err) {
        return null;
      }
    }

    /**
     * Convert the members array. Change the value of the property componentId to artifactId.
     * @param {Array} members origin members from manifest.
     * @returns {Array} converted members
     * @private
     */
    _convertMembers (members) {
      var convertedMembers = [];
      members.forEach(function (member) {
        var convertedMember = this._convertMember(member);
        convertedMembers.push(convertedMember);
      }.bind(this));
      return convertedMembers;
    }

    _convertMember (member) {
      var convertedMember = {
        memberId: member.memberId
      };
      convertedMember.componentId = member.componentId.split('/')[ 1 ];
      return convertedMember;
    }

    /**
     * Generate and get the components array for usage inthe graph for the given artifact.
     * For this fetch the componnts from cubbles base, if they not contained in the manifest.
     *
     * @param {object} artifact the artifact
     * @param {object} manifest manifest of the webpackage
     * @param {string} baseUrl base url to a cubbles base store
     * @returns {Promise} Promise for all components fetched and converted, resolved the components array
     * @param {array} resolutions resolutions array
     * @private
     */
    _fetchComponents (artifact, manifest, baseUrl, resolutions) {
      var promises = [];

      promises.push(new Promise(function (resolve, reject) {
        if (resolutions) {
          resolutions[ artifact.artifactId ] = {
            artifact: artifact,
            componentId: 'this/' + artifact.artifactId
          };
        }
        resolve(this._createComponent(artifact, this.compoundIcon));
      }.bind(this)));
      artifact.members.forEach((member) => {
        promises.push(this._fetchComponent(member, manifest, baseUrl, resolutions));
      });
      return Promise.all(promises);
    }

    /**
     *
     * @param {object} member memberobject
     * @param {object} manifest the current manifest object
     * @param {string} baseUrl base url to a cubbles base store
     * @param {array} resolutions resolutions array
     * @returns {Promise} promise for fetch and convert a component, resolve the converted component object
     * @private
     */
    _fetchComponent (member, manifest, baseUrl, resolutions) {
      var resolverFunction = function (resolve, reject) {
        var artifact;
        var webpackageId = member.componentId.split('/')[ 0 ];
        var artifactId = member.componentId.split('/')[ 1 ];
        try {
          artifact = manifest.artifacts.compoundComponents.find((artifact) => artifact.artifactId === artifactId);
        } catch (err) {
          // do nothing
        }
        if (artifact) { // compound component found in own manifest
          if (resolutions) {
            resolutions[ artifact.artifactId ] = {
              artifact: artifact,
              componentId: member.componentId
            };
          }
          resolve(this._createComponent(artifact, this.compoundIcon));
          return;
        }
        try {
          artifact = manifest.artifacts.elementaryComponents.find((comp) => comp.artifactId === artifactId);
        } catch (err) {
          // do nothing
        }

        if (artifact) { // elementary component found in own manifest
          if (resolutions) {
            resolutions[ artifact.artifactId ] = {
              artifact: artifact,
              componentId: member.componentId
            };
          }
          resolve(this._createComponent(artifact, this.elementaryIcon));
          return;
        }
        artifact = this._getArtifactFromCubblesBase(webpackageId, artifactId, baseUrl, resolve, reject, resolutions);
      };
      return new Promise(resolverFunction.bind(this));
    }

    /**
     * Fetch an component from cubbles base, convert to the graph component object, and call resolved with this.
     * If the component not found call the reject function.
     * @param {string} webpackageId webpackageId of the required component
     * @param {string} artifactId artifactId of the required component
     * @param baseUrl url to a cubbles base store
     * @param resolve the rsolv function
     * @param reject the reject function
     * @private
     */
    _getArtifactFromCubblesBase (webpackageId, artifactId, baseUrl, resolve, reject, resolutions) {
      var url = baseUrl.endsWith('/') ? baseUrl + webpackageId + '/manifest.webpackage' : baseUrl + '/' + webpackageId + '/manifest.webpackage';
      fetch(url).then((result) => result.json()).then((manifest) => {
        var artifact;
        try {
          artifact = manifest.artifacts.compoundComponents.find((comp) => comp.artifactId === artifactId);
        } catch (err) {
          // do nothing
        }

        if (artifact) {
          if (resolutions) {
            resolutions[ artifact.artifactId ] = {
              artifact: artifact,
              componentId: webpackageId + '/' + artifactId
            };
          }
          resolve(this._createComponent(artifact, this.compoundIcon));
        }
        try {
          artifact = manifest.artifacts.elementaryComponents.find((comp) => comp.artifactId === artifactId);
        } catch (err) {
          // do nothing
        }
        if (artifact) {
          if (resolutions) {
            resolutions[ artifact.artifactId ] = {
              artifact: artifact,
              componentId: webpackageId + '/' + artifactId
            };
          }
          resolve(this._createComponent(artifact, this.elementaryIcon));
        }
        reject('The artifact "' + artifactId + '" not found in "' + baseUrl + webpackageId + '".');
      });
    }

    /**
     * Create a graph component object from an cubbles artifact.
     * @param {object} artifact an cubbles artifact
     * @param icon the icon for the node
     * @returns {object} generated graph component object
     * @private
     */
    _createComponent (artifact, icon) {
      var component = {
        name: artifact.artifactId,
        icon: icon,
        inports: this._changeSlotToPorts(artifact, 'input'),
        outports: this._changeSlotToPorts(artifact, 'output')
      };
      return component;
    }

    /**
     * generate a ports array. Depends of type generate from output slots or input slots for inports or outports.
     * @param {object} artifact the artifact, which slots converted to ports
     * @param {string} type (input|output)
     * @returns {Array} generated ports array
     * @private
     */
    _changeSlotToPorts (artifact, type) {
      let ports = [];
      let slots;
      if (artifact.slots) {
        slots = artifact.slots.filter((slot) => !slot.direction || slot.direction.includes(type));
      }
      if (slots && slots.length > 0) {
        slots.forEach((slot) => ports.push(createPort(slot.slotId, slot.type)));
      }

      return ports;
      /**
       * Create one port
       * @param {string} name the name of port corresponend with slotId
       * @param {string} type the type of the slot (number, boolean, string, object, array)
       * @returns {object} generated port object
       */
      function createPort (name, type) {
        var port = { name };
        if (type) {
          port.type = type;
        }
        return port;
      }
    }

  }
  if (!window.cubx) {
    window.cubx = {};
  }
  if (!window.cubx.bde) {
    window.cubx.bde = {};
  }
  // create global variable of the BdeDataConverter.
  window.cubx.bde.bdeDataConverter = new BdeDataConverter('cogs', 'cog');
})();
