/* globals React,ReactDOM */
(function (context) {
  'use strict';

  var TheGraph = context.TheGraph;

  // Initialize configuration for the Port view.
  TheGraph.config.port = {
    container: {
      className: 'port arrow'
    },
    backgroundCircle: {
      className: 'port-circle-bg'
    },
    arc: {
      className: 'port-arc'
    },
    innerCircle: {
      ref: 'circleSmall'
    },
    text: {
      ref: 'label',
      className: 'port-label drag'
    }
  };

  TheGraph.factories.port = {
    createPortGroup: TheGraph.factories.createGroup,
    createPortBackgroundCircle: TheGraph.factories.createCircle,
    createPortArc: TheGraph.factories.createPath,
    createPortInnerCircle: TheGraph.factories.createCircle,
    createPortLabelText: TheGraph.factories.createText
  };

  // Port view

  TheGraph.Port = React.createFactory(React.createClass({
    displayName: 'TheGraphPort',
    mixins: [
      TheGraph.mixins.Tooltip
    ],
    componentDidMount: function () {
      // Preview edge start
      ReactDOM.findDOMNode(this).addEventListener('tap', this.edgeStart);
      ReactDOM.findDOMNode(this).addEventListener('track', this.edgeStart);

      // Make edge
      ReactDOM.findDOMNode(this).addEventListener('track', this.triggerDropOnTarget);
      ReactDOM.findDOMNode(this).addEventListener('the-graph-edge-drop', this.edgeStart);

      // Show context menu
      if (this.props.showContext) {
        ReactDOM.findDOMNode(this).addEventListener('contextmenu', this.showContext);
        ReactDOM.findDOMNode(this).addEventListener('hold', this.showContext);
      }
    },
    getTooltipTrigger: function () {
      return ReactDOM.findDOMNode(this);
    },
    shouldShowTooltip: function () {
      return (
        this.props.app.state.scale < TheGraph.zbpBig ||
        this.props.label.length > 8
      );
    },
    showContext: function (event) {
      // Don't show port menu on export node port
      if (this.props.isExport) {
        return;
      }
      // Click on label, pass context menu to node
      if (event && (event.target === ReactDOM.findDOMNode(this.refs.label))) {
        return;
      }
      // Don't show native context menu
      event.preventDefault();

      // Don't tap graph on hold event
      event.stopPropagation();
      if (event.preventTap) { event.preventTap(); }

      // Get mouse position
      var x = event.x - this.props.app.props.offsetX || event.clientX - this.props.app.props.offsetX || 0;
      var y = event.y - this.props.app.props.offsetY || event.clientY - this.props.app.props.offsetY || 0;

      // App.showContext
      this.props.showContext({
        element: this,
        type: (this.props.isIn ? 'nodeInport' : 'nodeOutport'),
        x: x,
        y: y,
        graph: this.props.graph,
        itemKey: this.props.label,
        item: this.props.port
      });
    },
    getContext: function (menu, options, hide) {
      return TheGraph.Menu({
        menu: menu,
        options: options,
        label: this.props.label,
        triggerHideContext: hide
      });
    },
    edgeStart: function (event) {
      // @debug enable floating exports
      // Don't start edge on export node port
      // if (this.props.isExport) {
      //   return;
      // }

      // Don't tap graph
      event.stopPropagation();

      if (event.type === 'track' && event.detail.state !== 'start') { return; }

      // Click on label, pass context menu to node
      if (event && (event.target === ReactDOM.findDOMNode(this.refs.label))) {
        return;
      }

      var edgeStartEvent = new CustomEvent('the-graph-edge-start', {
        detail: {
          isIn: this.props.isIn,
          port: this.props.port,
          process: this.props.processKey,
          route: this.props.route || 0
        },
        bubbles: true
      });
      ReactDOM.findDOMNode(this).dispatchEvent(edgeStartEvent);
    },
    triggerDropOnTarget: function (event) {
      // If dropped on a child element will bubble up to port
      if (event.type === 'track' && event.detail.state !== 'end') { return; }

      var relatedTarget = event.detail.sourceEvent.target;
      if (!relatedTarget) { return; }

      var dropEvent = new CustomEvent('the-graph-edge-drop', {
        detail: null,
        bubbles: true
      });
      relatedTarget.dispatchEvent(dropEvent);

      // var hoverTarget = event.detail.hover();
      // if (!hoverTarget) { return; }

      // var dropEvent = new CustomEvent('the-graph-edge-drop', {
      //   detail: null,
      //   bubbles: true
      // });
      // hoverTarget.dispatchEvent(dropEvent);
    },
    render: function () {
      var style;
      if (this.props.label.length > 7) {
        var fontSize = 6 * (30 / (4 * this.props.label.length));
        style = { 'fontSize': fontSize + 'px' };
      }
      var r = 4;
      // Highlight matching ports
      var highlightPort = this.props.highlightPort;
      var inArc = TheGraph.arcs.inport;
      var outArc = TheGraph.arcs.outport;
      if (highlightPort && highlightPort.isIn === this.props.isIn && (highlightPort.type === this.props.port.type || this.props.port.type === 'any')) {
        r = 6;
        inArc = TheGraph.arcs.inportBig;
        outArc = TheGraph.arcs.outportBig;
      }

      var backgroundCircleOptions = TheGraph.merge(TheGraph.config.port.backgroundCircle, { r: r + 1 });
      var backgroundCircle = TheGraph.factories.port.createPortBackgroundCircle.call(this, backgroundCircleOptions);

      var arcOptions = TheGraph.merge(TheGraph.config.port.arc, { d: (this.props.isIn ? inArc : outArc) });
      var arc = TheGraph.factories.port.createPortArc.call(this, arcOptions);

      var innerCircleOptions = {
        className: 'port-circle-small fill route' + (this.props.route || 'null'),
        r: r - 1.5
      };

      innerCircleOptions = TheGraph.merge(TheGraph.config.port.innerCircle, innerCircleOptions);
      var innerCircle = TheGraph.factories.port.createPortInnerCircle.call(this, innerCircleOptions);

      var labelTextOptions = {
        x: (this.props.isIn ? 5 : -5),
        style: style,
        children: this.props.label
      };
      labelTextOptions = TheGraph.merge(TheGraph.config.port.text, labelTextOptions);
      var labelText = TheGraph.factories.port.createPortLabelText.call(this, labelTextOptions);

      var portContents = [
        backgroundCircle,
        arc,
        innerCircle,
        labelText
      ];

      var containerOptions = TheGraph.merge(TheGraph.config.port.container, { title: this.props.label, transform: 'translate(' + this.props.x + ',' + this.props.y + ')' });
      return TheGraph.factories.port.createPortGroup.call(this, containerOptions, portContents);
    }
  }));
})(this);
