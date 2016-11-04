// @importedBy bde-design-view.html
/*global XMLHttpRequest*/

Polymer({
  is: 'bde-design-view',

  properties: {
    /**
     * Represents the manifest metadata of the current compound component.
     *
     * @type {Object}
     * @property currentComponentMetadata
     */
    currentComponentMetadata: {
      type: Object,
      notify: true
    },

    /**
     * Date Object, set when the component is loaded.
     *
     * @type {Object}
     * @property lastGeneratedTemplateBlobDocTime
     */
    lastGeneratedTemplateBlobDocTime: {
      type: Object
    },

    /**
     * The selected page, i.e. dataflowView.
     *
     * @type {String}
     * @property selectedPage
     */
    selectedPage: {
      notify: true,
      type: String
    },

    /**
     * Date object for last change.
     *
     * @type {Object}
     * @property lastChangeTime
     */
    lastChangeTime: {
      type: Object
    },

    /**
     * The selected compound component.
     *
     * @type {Object}
     * @property selectedCompound
     */
    selectedCompound: {
      type: Object,
      value: null
    },

    /**
     * Check value for compatible templates.
     *
     * @type {Boolean}
     * @property compatibleTemplate
     */
    compatibleTemplate: {
      type: Boolean,
      value: false
    },

    /**
     * Visibility property, is set to true on open.
     *
     * @type {Boolean}
     * @property isVisible
     */
    isVisible: {
      type: Boolean,
      value: false
    },

    /**
     * Disabled designView property is set, when template is incompatible.
     *
     * @type {Boolean}
     * @property designViewDisabled
     */
    designViewDisabled: {
      type: Boolean,
      value: false
    },

    /**
     * EndpointId of the current component
     *
     * @type {String}
     * @property lastEndpointId
     */
    lastEndpointId: {
      type: String
    }
  },

  listeners: {
    'confirmEnablingDialog.iron-overlay-closed': 'confirmEnablingDialogCloseHandler',
    'no-compatible-template': 'noCompatibleTemplateHandler',
    'compatible-template': 'compatibleTemplateHandler'
  },

  observers: [
    'currentComponentMetadataChanged(currentComponentMetadata.*)'
  ],

  /**
   * Polymer ready function. Setting event listeners.
   */
  ready: function () {
    this.parentNode.addEventListener('iron-deselect', this.leaveHandler);
    this.parentNode.addEventListener('iron-select', this.openHandler.bind(this));
  },

  /**
   * Helper function to set selectedPage on tap to dataflowView.
   *
   * @method handleTap
   */
  handleTap: function () {
    this.selectedPage = 'dataflowView';
  },

  /**
   * Sets properties concordingly, when a template is compatible.
   *
   * @method compatibleTemplateHandler
   *
   */
  compatibleTemplateHandler: function () {
    this.set('compatibleTemplate', true);
    this.set('designViewDisabled', false);
  },

  /**
   * Sets properties concordingly, when a template is iscompatible.
   *
   * @method noCompatibleTemplateHandler
   */
  noCompatibleTemplateHandler: function () {
    this.set('compatibleTemplate', false);
    this.set('designViewDisabled', true);
    if (this.isVisible) {
      this.$.confirmEnablingDialog.open();
    }
  },

  /**
   * Observer for the currentComponentMetadata property. Loads new component data on change.
   *
   * @method currentComponentMetadataChanged
   */
  currentComponentMetadataChanged: function () {
    if (!this.currentComponentMetadata || !this.currentComponentMetadata.manifest || !this.currentComponentMetadata.artifactId || !this.currentComponentMetadata.endpointId) {
      return;
    }
    this.debounce('loadNewCompound', function () {
      this.loadNewCompound();
    }, 2);
  },

  /**
   * Loads new compound component data.
   *
   * @method loadNewCompound
   */
  loadNewCompound: function () {
    this.set('designViewDisabled', false);
    var compoundComponents = this.currentComponentMetadata.manifest.artifacts.compoundComponents;
    compoundComponents.forEach(function (item) {
      if (item.artifactId === this.currentComponentMetadata.artifactId) {
        this.lastGeneratedTemplateBlobDocTime = new Date(0);
        this.set('selectedCompound', item);
        this.lastEndpointId = this.currentComponentMetadata.endpointId;
        this.loadHtmlResources();
      }
    }.bind(this));
  },

  /**
   * Helper function for opening the designView.
   *
   * @param  {[Event]} e [Tap event]
   * @method openHandler
   */
  openHandler: function (e) {
    var designView = e.detail.item;
    if (designView.id !== 'designView') {
      return;
    }
    designView.set('isVisible', true);
    if (!designView.compatibleTemplate && designView.designViewDisabled) {
      designView.$.confirmEnablingDialog.open();
    }
  },

  /**
   * Helper function for closing designView.
   *
   * @param  {[Event]} e [tap event]
   * @method confirmEnablingDialogCloseHandler
   */
  confirmEnablingDialogCloseHandler: function (e) {
    if (e.detail.confirmed) {
      this.set('designViewDisabled', false);
      this.$.bdeFlexboxLayouter.templateChanged('override extern template');
    } else {
      this.set('designViewDisabled', true);
    }
  },

  /**
   * Helper function for leaving designView, sets the view invisible, and the concording properties to false.
   *
   * @method leaveHandler
   */
  leaveHandler: function (e) {
    // TODO create global mapping for blob url for webpackage generation
    var designView = e.detail.item;
    if (designView.id !== 'designView' || designView.designViewDisabled) {
      return;
    }
    designView.set('isVisible', false);
  },

  /**
   * Returns an array of endpoints from the current component.
   *
   * @param  {[String]} endpointId [Id of the endpoint of the current component]
   * @return {[Array]}            [Array of endpoints]
   */
  getEndpointFromSelectedCompound: function (endpointId) {
    for (var i = 0; i < this.selectedCompound.endpoints.length; i++) {
      if (this.selectedCompound.endpoints[i].endpointId === endpointId) {
        return this.selectedCompound.endpoints[i];
      }
    }
    return;
  },

  /**
   * Get HTML resources out of the webpackage url.
   *
   * @method loadHtmlResources
   */
  loadHtmlResources: function () {
    if (!this.currentComponentMetadata || !this.currentComponentMetadata.endpointId) {
      return;
    }
    var endpoint = this.getEndpointFromSelectedCompound(this.currentComponentMetadata.endpointId);
    if (endpoint) {
      var absoluteUrl;
      var index;
      for (var i = 0; i < endpoint.resources.length; i++) {
        if (endpoint.resources[i].indexOf('.html') > -1) {
          absoluteUrl = this.buildSelectedCompoundResourceUrl(endpoint.resources[i]);
        } else {
          index = endpoint.resources[i].indexOf('?type=html');
          if (index > -1) {
            absoluteUrl = endpoint.resources[i].substring(0, index);
          }
        }
        if (absoluteUrl) {
          this.loadFile(absoluteUrl, function (response) {
            this.$$('bde-flexbox-layouter').loadTemplate(response);
          }.bind(this));
        }
      }
      if (!absoluteUrl) {
        this.$$('bde-flexbox-layouter').loadSelectedCompound();
      }
    }
  },

  /**
   * Create and XMLHttpRequest to load the resources from the webpackage url.
   *
   * @param  {[String]} url             [webpackage url]
   * @param  {[type]} successCallback [description]
   * @method loadFile
   */
  loadFile: function (url, successCallback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          successCallback.call(this, xhr.responseText);
        } else {
          console.error('Error loading "' + url + '". Request returned a status of ' + xhr.status);
        }
      }
    }.bind(this);
    xhr.open('GET', url, true);
    xhr.send();
  },

  /**
   * Create the url for the webpackage out of the webpackage metadata.
   *
   * @param  {[type]} resourceUrl [description]
   * @return {[String]}             [url sting]
   * @method buildSelectedCompoundResourceUrl
   */
  buildSelectedCompoundResourceUrl: function (resourceUrl) {
    var webpackageQName = '';
    webpackageQName = this.currentComponentMetadata.manifest.name + '@' + this.currentComponentMetadata.manifest.version;
    if (this.currentComponentMetadata.manifest.groupId && this.currentComponentMetadata.manifest.groupId.length > 0) {
      webpackageQName = this.currentComponentMetadata.manifest.groupId + '.' + webpackageQName;
    }
    var baseUrl = this.settings.baseUrl + '/' + this.settings.store + '/' + webpackageQName + '/' + this.selectedCompound.artifactId + '/';

    return this.relativeToAbsolute(baseUrl, resourceUrl);
  },

  /**
   * Helper function to create absolute url.
   *
   * @param  {[type]} baseUrl     [description]
   * @param  {[type]} relativeUrl [description]
   * @return {[type]}             [description]
   * @method relativeToAbsolute
   */
  relativeToAbsolute: function (baseUrl, relativeUrl) {
    var stack = baseUrl.split('/');
    var parts = relativeUrl.split('/');
    stack.pop(); // remove current file name (or empty string)
                 // (omit if 'base' is the current folder without trailing slash)
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === '.') {
        continue;
      }
      if (parts[i] === '..') {
        stack.pop();
      } else {
        stack.push(parts[i]);
      }
    }
    return stack.join('/');
  }
});
