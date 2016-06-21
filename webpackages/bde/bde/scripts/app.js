/*jslint
    es5: true, browser: true, nomen: true
 */

(function (document, Webpackage) {
    'use strict';

    // Reference to the auto-binding template
    var app = document.querySelector('#app');

    app._computeAddComponent = function (sidebar) {
        return sidebar ? 'push-right' : '';
    };

    app._concatArray = [].concat.bind([]);

    app.webpackage = new Webpackage({
        artifacts: {
            apps: [],
            compoundComponents: [],
            elementaryComponents: [],
            utilities: []
        }
    });

    app.initializeDefaultSettings = function initializeDefaultSettings() {
        this.set('settings', {
            baseUrl: 'https://cubbles.world',
            baseName: 'sandbox',
            author: {
                name: '',
                email: '',
                url: ''
            }
        });
    };
    app.initializeDefaultSettings();

    app.computeBaseUrl = function computeBaseUrl(settings, partial) {
        if (!partial || typeof partial !== 'string') {
            throw new TypeError("`partial` must be a string");
        }

        if (partial[0] !== '/') {
            partial = '/' + partial;
        }

        try {
            return settings.baseUrl + '/' + settings.baseName + partial;
        } catch (e) {
            return '';
        }
    };

    // Listen for template bound event to know when bindings
    // have resolved and content has been stamped to the page
    app.addEventListener('dom-change', function () {

        // Select dataflow view
        this.selected = 0;

        // Explorer hidden
        this.showExplorer = true;

        // Initialize internal state
        this.data = this.$.store;

        // Calculate the correct size of the graph (important for SVG)
        // and attach a window resize listener, to update the size
        // on the fly
        function resize() {
            this.graphWidth = this.$.pages.clientWidth;
            this.graphHeight = this.$.pages.clientHeight;
        }

        window.addEventListener('resize', resize.bind(this));
        this.async(resize);

        // Handle zoom-to-fit button
        this.zoomToFit = () => {
            this.$.editor.triggerFit();
        };

        // Handle trigger-autoload button
        this.triggerAutolayout = () => {
            this.$.editor.triggerAutolayout(true);
        };

        // Setup and open the repository browser for adding cubbles
        this.openRepositoryBrowser = () => {
            this.$.browser.compoundOnly = false;
            this.$.parser.showCompoundMembers = false;
            this.$.browser.toggleDialog();
        };

        // Setup and open repository browser for loading compounds
        this.$.compoundBtn.addEventListener('tap', () => {
            this.$.browser.compoundOnly = true;
            this.$.parser.showCompoundMembers = true;
            this.$.browser.toggleDialog();
        });

        // Open general data dialog
        this.$.settingsBtn.addEventListener('tap', () => {
            this.$.settings.opened = !this.$.settings.opened;
        });

        // Open about dialog
        this.$.aboutBtn.addEventListener('tap', () => {
            this.$.about.opened = !this.$.about.opened;
        });

        // Open help dialog
        this.$.helpBtn.addEventListener('tap', () => {
            this.$.help.opened = !this.$.help.opened;
        });

        // General purpose event to redraw the graph
        document.addEventListener('graph-needs-update', () => {
            this.$.editor.rerender();
        });
    });

}(document, Webpackage));
