// @importedBy bde-manifest.html
'use strict';

Polymer({
  is: 'bde-manifest',

  properties: {
    /**
     * Counter of the added component.
     *
     * @type {Number}
     * @property arrtifactIdCounter
     */
    artifactIdCounter: {
      type: Number,
      value: 0
    },

    /**
     * Artifacts of the Cubble component. The 'main' metadata of the components for representation in the BDE with slots and connections beeing the main visual input in the app.
     *
     * @type {Object}
     * @property artifacts
     */
    artifacts: {
      type: Object,
      notify: true,
      value: function () {
        return {
          apps: [],
          compoundComponents: [],
          elementaryComponents: [],
          utilities: []
        };
      }
    },
    /**
     * Author of the Cubble component, object containing name and email address.
     *
     * @type {Object}
     * @property author
     */
    author: {
      type: Object,
      notify: true,
      value: function () {
        return {
          name: '',
          email: ''
        };
      }
    },

    /**
     * List of contributors to the component.
     *
     * @type {Array}
     * @property contributors
     */
    contributors: {
      type: Array,
      notify: true,
      value: function () {
        return [];
      }
    },

    /**
     * Document type of the component, which is usually the default 'webpackage'.
     *
     * @type {String}
     * @property docType
     */
    docType: {
      type: String,
      value: 'webpackage'
    },

    /**
     * Description of the Cubble component.
     *
     * @type {String}
     * @property description
     */
    description: {
      type: String,
      notify: true
    },

    /**
     * Group id of the component.
     * Can be modfied via the app settings.
     *
     * @type {String}
     * @property groupId
     */
    groupId: {
      type: String,
      notify: true,
      value: ''
    },

    /**
     * Homepage of the author/project, who is publighing this Cubble component.
     *
     * @type {String}
     * @property homepage
     */
    homepage: {
      type: String,
      notify: true
    },

    /**
     * Keywords for the Cubble component, is used in the base fopr referencing and searching for components.
     *
     * @type {Array}
     * @property keywords
     */
    keywords: {
      type: Array,
      value: function () {
        return [];
      },
      notify: true
    },

    /**
     * Licence under which the Cubble component is published.
     * MIT license is the default value, see [https://opensource.org/licenses/MIT]
     *
     * @type {String}
     * @property license
     */
    license: {
      type: String,
      value: 'MIT',
      notify: true
    },

    location: {
      type: Object,
      notification: true
    },
    /**
     * Manual(s) for the component, represented by an URL to a document.
     *
     * @type {Array}
     * @property man
     */
    man: {
      type: Array,
      value: function () {
        return [];
      },
      notify: true
    },

    /**
     * Model version of the component.
     * This cannot be modified in the app, it is set to the default value.
     *
     * @type {String}
     * @property modelVersion
     */
    modelVersion: {
      type: String,
      value: '9.1.1'
    },

    /**
     * Name of the Cubble component.
     *
     * @type {String}
     * @property name
     */
    name: {
      type: String,
      notify: true,
      value: 'new-webpackage'
    },

    /**
     * Runnables of the Cubble component, e.g. a demo page within the webpackage.
     *
     * @type {Array}
     * @property runnables
     */
    runnables: {
      type: Array,
      value: function () {
        return [];
      },
      notify: true
    },

    /**
     * Version of the component.
     * Can be modfied via the app settings.
     *
     * @type {String}
     * @property version
     */
    version: {
      type: String,
      value: '1.0.0-SNAPSHOT',
      notify: true
    },

    /**
     * Counter of the added component.
     *
     * @type {Number}
     * @property webpackageIdCounter
     */
    webpackageIdCounter: {
      type: Number,
      value: 0
    }

  },

  /* *******************************************************************************************/
  /* ********************************* public methods ******************************************/
  /* *******************************************************************************************/

  /**
   * Load a new manifest, fires event on finish.
   *
   * @param  {[Object]} manifest [description]
   * @method loadManifest
   */
  loadManifest: function (manifest) {
    this.fire('bde-manifest-loading');
    this.fire('bde-new-manifest');
    Object.keys(manifest)
      .filter(function (key) {
        return ((key[ 0 ] !== '_') && (key !== 'arguments'));
      })
      .forEach(function (key) {
        this.set(key, manifest[ key ]);
      }, this);

    this.fire('bde-manifest-loaded', { manifest: this });
  },

  /**
   * Resets the elements data to predefined deafult values.
   *
   * @method reset
   */
  reset: function (artifactId, groupId, name, version) {
    if (!artifactId) {
      artifactId = this._createArtifactId();
    }
    if (!groupId) {
      groupId = null;
    }
    if (!name) {
      name = this._createWebpackageName();
    }
    if (!version) {
      version = '1.0.0-SNAPSHOT';
    }
    this.set('name', name);
    this.set('groupId', groupId);
    this.set('version', version);
    this.set('modelVersion', '9.1.1');
    this.set('docType', 'webpackage');
    this.set('description', undefined);
    this.set('author', {
      name: undefined,
      email: undefined
    });
    this.set('contributors', []);
    this.set('license', 'MIT');
    this.set('homepage', null);
    this.set('keywords', []);
    this.set('man', []);
    this.set('runnables', []);
    this.set('artifacts', {
      compoundComponents: [
        {
          artifactId: artifactId,
          description: 'component description...',
          runnables: [],
          resources: [],
          dependencies: [],
          slots: [],
          members: [],
          connections: [],
          inits: []
        }
      ]
    });
    this.fire('bde-reset-webpackage-change', this.artifacts.compoundComponents[ 0 ]);
  },

  /**
   * Output current manifest in a base-compatible format.
   *
   * @return {Object}
   * @method toValidManifest
   */
  toValidManifest: function () {
    var validManifest = {};
    var thisCopy = this._clonePolymerElement(this);
    Object.keys(thisCopy.properties)
      .filter(function (key) {
        return this._filterRules(key);
      }, this)
      .forEach(function (key) {
        validManifest[ key ] = thisCopy[ key ];
      }, this);

    validManifest.artifacts.compoundComponents.forEach(function (component) {
      if (component.members) {
        component.members.forEach(function (member) {
          if (member.metadata) {
            delete member.metadata;
          }
        });
      }
      if (component.slots) {
        component.slots.forEach(function (slot) {
          if (slot && slot.id) {
            delete slot.id;
          }
        });
      }
    });

    return validManifest;
  },
  /* *******************************************************************************************/
  /* ********************************* private methods *****************************************/
  /* *******************************************************************************************/
  /**
   * Create a defined artifactId String
   *
   * @return {[String]} [new artifactid]
   * @method _createArtifactId
   */
  _createArtifactId: function () {
    var counter = this.get('artifactIdCounter');
    var id;
    if (counter === 0) {
      id = 'new-compound';
      counter++;
    } else {
      id = 'new-compound-' + counter++;
    }

    this.set('artifactIdCounter', counter);
    return id;
  },

  /**
   * Create a defined artifactId String
   *
   * @return {[String]} [new artifactid]
   * @method _createArtifactId
   */
  _createWebpackageName: function () {
    var counter = this.get('webpackageIdCounter');
    var id;
    if (counter === 0) {
      id = 'new-webpackage';
      counter++;
    } else {
      id = 'new-webpackage-' + counter++;
    }

    this.set('webpackageIdCounter', counter);
    return id;
  },

  /**
   * Helper function for filter rules for allowed keys.
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   * @method _filterRules
   */
  _filterRules: function (key) {
    var keyAllowed = key !== 'metadata';
    keyAllowed = keyAllowed && key !== 'artifactIdCounter';
    keyAllowed = keyAllowed && key !== 'webpackageIdCounter';
    keyAllowed = keyAllowed && (key !== 'description' || (key === 'description' && typeof this.description !== 'undefined' && this.description.trim().length > 0));
    keyAllowed = keyAllowed && key !== 'location';
    return keyAllowed;
  },

  _clonePolymerElement: function (element) {
    let copy = element.cloneNode(true);
    for (var i in element.properties) {
      copy[ i ] = typeof element[ i ] !== 'undefined' ? JSON.parse(JSON.stringify(element[ i ])) : element[ i ];
    }
    return copy;
  }
});
