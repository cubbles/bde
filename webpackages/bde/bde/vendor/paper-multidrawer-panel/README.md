<!--
[![Build Status](https://travis-ci.org/PolymerElements/paper-drawer-panel.svg?branch=master)](https://travis-ci.org/PolymerElements/paper-drawer-panel)

_[Demo and API Docs](https://elements.polymer-project.org/elements/paper-drawer-panel)_
 -->

# &lt;paper-multidrawer-panel&gt;

**Full API and Docs [here](http://woodywoodsta.github.io/paper-multidrawer-panel/)**

Material design: [Navigation drawer](https://www.google.com/design/spec/patterns/navigation-drawer.html)

`paper-multidrawer-panel`, adapted from [paper-drawer-panel](https://elements.polymer-project.org/elements/paper-drawer-panel), contains one or two drawer panels and a main panel.  The drawer panels and the main panel are side-by-side with drawers on the sides specified.  When the browser window size is smaller than the `responsiveWidth`, `paper-multidrawer-panel` changes to narrow layout.  In narrow layout, both drawers will be stacked on top of the main panel.  The drawers will slide in/out to hide/reveal the main panel.  When the window is smaller than the `responsiveWidthLeft`, the left drawer will stack and slide in/out and so forth for the right drawer using `responsiveWidthRight`.

Use the attribute `left-drawer` to indicate that the element is a drawer panel to be placed on the left, `right-drawer` to indicate that the element is a drawer panel on the right and `main` to indicate that the element is the main panel.

Example:

```html
<paper-multidrawer-panel>
  <div left-drawer> Left drawer panel... </div>
  <div right-drawer> Right drawer panel... </div>
  <div main> Main panel... </div>
</paper-multidrawer-panel>
```

The drawer and the main panels are not scrollable.  You can set CSS overflow property on the elements to make them scrollable or use `paper-header-panel`.

Example:

```html
<paper-multidrawer-panel>
  <paper-header-panel left-drawer>
    <paper-toolbar></paper-toolbar>
    <div> Drawer content... </div>
  </paper-header-panel>
  <paper-header-panel main>
    <paper-toolbar></paper-toolbar>
    <div> Main content... </div>
  </paper-header-panel>
</paper-multidrawer-panel>
```

An element that should toggle the left drawer or the right drawer will automatically do so if it's given the `paper-multidrawer-toggle-left` or `paper-multidrawer-toggle-right` attribute respectively. Also this element will automatically be hidden in wide layout (if the drawers have not stacked).

Example:

```html
<paper-multidrawer-panel>
  <paper-header-panel left-drawer>
    <paper-toolbar>
      <div>Application</div>
    </paper-toolbar>
    <div> Drawer content... </div>
  </paper-header-panel>
  <paper-header-panel main>
    <paper-toolbar>
      <paper-icon-button icon="menu" paper-multidrawer-toggle-left></paper-icon-button>
      <div>Title</div>
    </paper-toolbar>
    <div> Main content... </div>
  </paper-header-panel>
</paper-multidrawer-panel>
```

### Styling

To change the main container:

```css
paper-multidrawer-panel {
  --paper-multidrawer-panel-main-container: {
    background-color: gray;
  };
}
```

To change the drawer container on the left:

```css
paper-multidrawer-panel {
  --paper-multidrawer-panel-left-drawer-container: {
    background-color: white;
  };
}
```

To change the drawer container on the right:

```css
paper-multidrawer-panel {
  --paper-multidrawer-panel-right-drawer-container: {
    background-color: white;
  };
}
```

To customize the scrim:

```css
paper-multidrawer-panel {
  --paper-multidrawer-panel-scrim: {
    background-color: red;
  };
}
```

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-multidrawer-panel-drawer-container` | Mixin applied to drawer container | {}
`--paper-multidrawer-panel-left-drawer-container` | Mixin applied to container when it's in the left side | {}
`--paper-multidrawer-panel-right-drawer-container` | Mixin applied to container when it's in the right side | {}
`--paper-multidrawer-panel-main-container` | Mixin applied to main container | {}
`--paper-multidrawer-panel-scrim-opacity` | Scrim opacity | 1
`--paper-multidrawer-panel-scrim` | Mixin applied to scrim | {}

---

## Todo

- [ ] Fix demo page
- [ ] Add timing function mixin
- [ ] Add some tests
- [ ] Send a huge thanks to the polymer team :)
