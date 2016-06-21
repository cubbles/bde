(function (global) {
    'use strict';

    if (Function.prototype.method === undefined) {
        Function.prototype.method = function (name, func) {
            this.prototype[name] = func;
            return this;
        };
    }

    if (Object.extend === undefined) {
        Object.extend = function (prototype, api) {
            if (prototype && api) {
                var i, n = Object.getOwnPropertyNames(api);
                for (i = 0; (i < n.length) && (n = n[i]); i++) {
                    Object.copyOwnProperty(n, api, prototype);
                }
            }
            return prototype || api;
        };
    }

    if (Object.mixin === undefined) {
        Object.mixin = function (target, source) {
            for (var i in source) {
                target[i] = source[i];
            }
            return target;
        };
    }

    if (Object.copyOwnProperty == undefined) {
        Object.copyOwnProperty = function(name, source, target) {
            var pd;
            if (pd = Object.getOwnPropertyDescriptor(source, name)) {
                Object.defineProperty(target, name, pd);
            }
        };
    }

    var expose = global;

})(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window);



