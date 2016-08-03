(function () {
  'use strict';

  Polymer({
    is: 'bde-manifest',

    properties: {

      name: {
        type: String,
        notify: true,
        value: 'new-webpackage'
      },

      createCounter: {
        type: Number,
        value: 1
      },

      groupId: {
        type: String,
        notify: true,
        value: ''
      },

      version: {
        type: String,
        value: '1.0-SNAPSHOT',
        notify: true
      },

      modelVersion: {
        type: String,
        value: '8.3.0'
      },

      docType: {
        type: String,
        value: 'webpackage'
      },

      description: {
        type: String,
        notify: true
      },

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

      contributors: {
        type: Array,
        notify: true,
        value: function () {
          return [];
        }
      },

      license: {
        type: String,
        value: 'MIT',
        notify: true
      },

      homepage: {
        type: String,
        notify: true
      },

      keywords: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },

      man: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },

      runnables: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },

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
                endpoints: [
                  {
                    endpointId: 'main',
                    resources: [],
                    dependencies: []
                  }
                ],
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

    listeners: {
      'library-update-required': 'onLibraryUpdate'
    },

    attached: function () {
      document.querySelector('bde-app').set('selectedArtifact', this.artifacts.compoundComponents[ 0 ]);
      document.querySelector('bde-app').set('manifest', this);
    },

    /**
     * Load a new manifest
     *
     * @param  {[type]} manifest [description]
     * @return {[type]}          [description]
     */
    loadManifest: function (manifest) {
      this.fire('bde-manifest-loading');

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
     * Output current manifest in a base-compatible format
     *
     * @param  {Function|Array} replacer (optional)
     * @param  {String|Number}  space    (optional)
     * @return {String}
     */
    toValidManifest: function () {
      var manifest = {};

      Object.keys(this.properties)
        .filter(function (key) {
          return ((key !== 'metadata'));
        })
        .forEach(function (key) {
          manifest[ key ] = this[ key ];
        }, this);

      manifest.artifacts.compoundComponents.forEach(function (component) {
        component.members.forEach(function (member) {
          if (member.metadata) {
            delete member.metadata
          }
        });
      });

      return manifest;
    },
    reset: function () {
      var artifactId = this._createArtifactId();
      this.set('name', 'new-webpackage');
      this.set('groupId', null);
      this.set('version', '1.0.0-SNAPSHOT');
      this.set('modelVersion', '8.3.0');
      this.set('docType', 'webpackage');
      this.set('description', null);
      this.set('author', {
        name: '',
        email: ''
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
            endpoints: [
              {
                endpointId: 'main',
                resources: [],
                dependencies: []
              }
            ],
            slots: [],
            members: [],
            connections: [],
            inits: []
          }
        ]
      });
      document.querySelector('bde-app').set('selectedArtifact', this.artifacts.compoundComponents[ 0 ]);
    },
    _createArtifactId: function () {
      var counter = this.get('createCounter');
      var id = 'new-compound-' + counter++;
      this.set('createCounter', counter);
      return id;
    }
  });
})();

