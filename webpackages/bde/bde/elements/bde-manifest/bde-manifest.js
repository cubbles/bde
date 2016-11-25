// @importedBy bde-manifest.html
'use strict';

Polymer({
  is: 'bde-manifest',

  properties: {

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
     * Counter of the added component.
     *
     * @type {Number}
     * @property createCounter
     */
    createCounter: {
      type: Number,
      value: 1
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
          compoundComponents: [
            {
              artifactId: 'new-compound',
              description: 'component description...',
              runnables: [
                {
                  name: 'demo',
                  path: '/demo/index.html',
                  description: 'component demo...'
                },
                {
                  name: 'docs',
                  path: '/docs/index.html',
                  description: 'Dataflow of the component'
                }
              ],
              resources: [],
              dependencies: [],
              slots: [],
              members: [],
              connections: [],
              inits: []
            }
          ],
          elementaryComponents: [],
          utilities: []
        };
      }
    }

  },

  // listeners: {
  //   'library-update-required': 'onLibraryUpdate'
  // },

  /**
   * Polymer attached function, sets data from the app.
   */
  attached: function () {
    document.querySelector('bde-app').set('selectedArtifact', this.artifacts.compoundComponents[ 0 ]);
    document.querySelector('bde-app').set('manifest', this);
  },

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
   * Output current manifest in a base-compatible format.
   *
   * @return {Object}
   * @method toValidManifest
   */
  toValidManifest: function () {
    var manifest = {};

    Object.keys(this.properties)
      .filter(function (key) {
        return this._filterRules(key);
      }, this)
      .forEach(function (key) {
        manifest[ key ] = this[ key ];
      }, this);

    manifest.artifacts.compoundComponents.forEach(function (component) {
      if (component.members) {
        component.members.forEach(function (member) {
          if (member.metadata) {
            delete member.metadata;
          }
        });
      }
    });

    return manifest;
  },

  /**
   * Resets the elements data to predefined deafult values.
   *
   * @method reset
   */
  reset: function () {
    var artifactId = this._createArtifactId();
    this.set('name', this._createWebpacakgeName());
    this.set('groupId', null);
    this.set('version', '1.0.0-SNAPSHOT');
    this.set('modelVersion', '9.1.1');
    this.set('docType', 'webpackage');
    this.set('description', undefined);
    this.set('author', {
      name: undefined,
      email: undefined
    });
    this.set('createCounter', 1);
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
    document.querySelector('bde-app').set('selectedArtifact', this.artifacts.compoundComponents[ 0 ]);
  },

  /**
   * Create a defined artifactId String
   *
   * @return {[String]} [new artifactid]
   * @method _createArtifactId
   */
  _createArtifactId: function () {
    var counter = this.get('createCounter');
    var id = 'new-compound-' + counter++;
    this.set('createCounter', counter);
    return id;
  },

  /**
   * Create a defined artifactId String
   *
   * @return {[String]} [new artifactid]
   * @method _createArtifactId
   */
  _createWebpacakgeName: function () {
    var counter = this.get('createCounter');
    var id = 'new-webpackage-' + counter++;
    this.set('createCounter', counter);
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
    keyAllowed = keyAllowed && key !== 'createCounter';
    keyAllowed = keyAllowed && (key !== 'description' || key === 'description' && typeof this.description !== 'undefined' && this.description.trim().length > 0);
    return keyAllowed;
  }
});
