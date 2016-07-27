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
     * The webpackageId in the base, generated from `groupId`,
     * `name`, and `version`.
     *
     * @return {string}
     */
    // get _id ()  {
    //   return this.groupId + '.' + this.name + '@' + this.version;
    // },

    // get apps () {
    //   return this.artifacts.filter(function(artifact) {
    //     return artifact.is === 'app';
    //   });
    // },

    // get elementaries () {
    //   return this.artifacts.filter(function(artifact) {
    //     return artifact.is === 'elementary';
    //   });
    // },

    // get compounds () {
    //   return this.artifacts.filter(function(artifact) {
    //     return artifact.is === 'compound';
    //   });
    // },

    // get utilities () {
    //   return this.artifacts.filter(function(artifact) {
    //     return artifact.is === 'utility';
    //   });
    // },

    /**
     * Getter for localArtifacts property
     *
     * Returns an array of all artifacts in the
     * manifest. Every array item will have a
     * `is` property set to identify the artifact
     * type.
     */
    // get localArtifacts () {
    //     return [].concat(
    //       (this.artifacts.apps) ?
    //         this.artifacts.apps.map(function(artifact) {
    //           artifact.is = 'app';
    //           return artifact;
    //         }) : [],
    //       (this.artifacts.elementaryComponents) ?
    //         this.artifacts.elementaryComponents.map(function(artifact) {
    //           artifact.is = 'elementary';
    //           return artifact;
    //         }) : [],
    //       (this.artifacts.compoundComponents) ?
    //         this.artifacts.compoundComponents.map(function(artifact) {
    //           artifact.is = 'compound';
    //           return artifact;
    //         }) : [],
    //       (this.artifacts.utilities) ?
    //         this.artifacts.utilities.map(function(artifact) {
    //           artifact.is = 'utility';
    //           return artifact;
    //         }) : []
    //     );
    // },

    /**
     * Setter for localArtifacts property
     *
     * Will replace the `artifacts` property
     * with the given array. The array must contain
     * artifact items with an `is` property
     * hinting the artifact type.
     */
    // set localArtifacts (newLocalArtifacts) {
    //     var artifacts = {
    //         apps: [],
    //         elementaryComponents: [],
    //         compoundComponents: [],
    //         utilities: []
    //     };

    //     newLocalArtifacts.forEach(function (artifact) {
    //         switch (artifact.is) {
    //             case 'app':
    //                 delete artifact.is;
    //                 artifacts.apps.push(artifact);
    //                 break;

    //             case 'elementary':
    //                 delete artifact.is;
    //                 artifacts.elementaryComponents.push(artifact);
    //                 break;

    //             case 'compound':
    //                 delete artifact.is;
    //                 artifacts.compoundComponents.push(artifact);
    //                 break;

    //             case 'utility':
    //                 delete artifact.is;
    //                 artifacts.utilities.push(artifact);
    //                 break;
    //         }
    //     });

    //     this.set('artifacts', artifacts);
    // },

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

      // @TODO (fdu): Do we still need the webpackageId in every member?
      // this.artifacts.compoundComponents = this.artifacts.compoundComponents.map(function(artifact) {
      //   artifact.members = artifact.members.map(function(member) {
      //     member.componentId = [
      //       member.metadata.webpackageId,
      //       member.metadata.artifactId
      //     ].join('/');
      //     delete member.metadata;

      //     return member;
      //   });
      // });

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
