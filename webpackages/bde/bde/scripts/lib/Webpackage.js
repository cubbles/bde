(function (global) {
  'use strict';

  function Webpackage (init) {

    this.name = 'new-webpackage';
    this.groupId = 'com.example';
    this.version = '0.0.1-SNAPSHOT';
    this.modelVersion = '8.3';
    this.docType = 'Webpackage';
    this.description = '';
    this.author = {};
    this.contributors = [];
    this.license = 'MIT';
    this.homepage = '';
    this.keywords = [];
    this.man = '';
    this.runnables = [];
    this.artifacts = {
      apps: [],
      compoundComponents: [],
      elementaryComponents: [],
      utilities: []
    };

    // Set initial state
    if (init && typeof init === 'object') {
      var prop, props = Object.getOwnPropertyNames(init), i = props.length;
      while(prop = props[--i]) {
        this[prop] = init[props];
      }
    }

    // Public
    this.complete = function() {
      return !!(this.name && this.groupId && this.version && this.modelVersion && this.docType);
    };

    this.toString = function() {
      var i, out = {}, props = Object.getOwnPropertyNames(this);
      console.log(props);
      for (i = 0; i < props.length; i++) {
        if (typeof this[props[i]] === 'function') {
          continue;
        }
        out[props[i]] = this[props[i]];
      }

      return JSON.stringify(out);
    };

  };

  var exposed = global;

  exposed.Webpackage = Webpackage;

}(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window));
