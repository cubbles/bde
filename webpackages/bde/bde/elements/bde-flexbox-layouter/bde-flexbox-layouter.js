/*global XMLHttpRequest*/
Polymer({
  is: 'bde-flexbox-layouter',
  properties: {
    selectedCompound: {
      type: Object,
      value: null,
      observer: 'selectedCompoundChanged'
    },
    compoundMembersOpen: {
      type: Boolean,
      value: true
    },
    layoutSettingsOpen: {
      type: Boolean,
      value: false
    },
    flexDirection: {
      type: String,
      value: 'row',
      observer: 'flexDirectionChanged'
    },
    flexWrap: {
      type: String,
      value: 'wrap',
      observer: 'flexWrapChanged'
    },
    justifyContent: {
      type: String,
      value: 'flex-start',
      observer: 'justifyContentChanged'
    },
    alignItems: {
      type: String,
      value: 'flex-start',
      observer: 'alignItemsChanged'
    },
    /*
     alignContent: {
     type: String,
     value: 'flex-start',
     observer: 'alignContentChanged'
     },*/
    flexGrow: {
      type: String,
      observer: 'flexGrowChanged'
    },
    flexShrink: {
      type: String,
      observer: 'flexShrinkChanged'
    },
    bdeVersion: {
      type: String
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  ready: function () {
    var sortable = this.$$('.sortable');
    Polymer.dom(sortable).observeNodes(this.templateChanged.bind(this));
  },
  selectedCompoundChanged: function (compound) {
    this.clearContainer();
    var sortable = this.$$('.sortable.selected');

    if (compound) {
      var members = compound.members;
      for (let i = 0; i < members.length; i++) {
        var element = document.createElement(this.trimComponentId(members[i].componentId));

        Polymer.dom(sortable).appendChild(element);
        element.setAttribute('class', 'member style-scope bde-flexbox-layouter');
        element.setAttribute('member-id-ref', members[i].memberId);
        element.innerHTML = members[i].memberId;
        element.addEventListener('tap', this.selectMember.bind(this));
      }
    }
  },
  clearContainer: function () {
    var container = this.$$('#flexbox-container');
    var flexboxes = Polymer.dom(container).querySelectorAll('.flexbox');

    for (var i = 0; i < flexboxes.length; i++) {
      var sortable = Polymer.dom(flexboxes[i]).querySelector('.sortable');
      var nodes = Polymer.dom(flexboxes[i]).querySelectorAll('.member');

      // Remove flexbox
      if (i > 1) {
        Polymer.dom(container).removeChild(flexboxes[i]);
      } else {
        for (let n = 0; n < nodes.length; n++) {
          Polymer.dom(sortable).removeChild(nodes[n]);
        }
        sortable.style.display = 'flex';
        sortable.style.flexDirection = 'row';
        this.flexDirection = sortable.style.flexDirection;
        sortable.style.flexWrap = 'wrap';
        this.flexWrap = sortable.style.flexWrap;
        sortable.style.justifyContent = 'flex-start';
        this.justifyContent = sortable.style.justifyContent;
        sortable.style.alignItems = 'flex-start';
        this.alignItems = sortable.style.alignItems;
      }
    }
    // Select first flexbox
    this.$$('.sortable:not(.parking)').classList.add('selected');
    this.templateChanged();
  },
  flexDirectionChanged: function (value) {
    var container = this.$$('.sortable.selected');
    container.style.display = 'flex';
    container.style.flexDirection = value;

    if (value === 'row' || value === 'row-reverse') {
      this.$$('#justify-content').classList.remove('hidden');
      this.$$('#align-items').classList.add('hidden');
      this.$$('#wrap').classList.remove('hidden');
    } else {
      this.$$('#justify-content').classList.add('hidden');
      this.$$('#align-items').classList.remove('hidden');
      this.$$('#wrap').classList.add('hidden');
    }
    this.templateChanged();
  },
  flexWrapChanged: function (value) {
    var container = this.$$('.sortable.selected');
    container.style.display = 'flex';
    container.style.flexWrap = value;

    if (value === 'nowrap') {
      this.$$('#flex-shrink').classList.remove('hidden');
    } else {
      this.$$('#flex-shrink').classList.add('hidden');
    }
    this.templateChanged();
  },
  justifyContentChanged: function (value) {
    var container = this.$$('.sortable.selected');
    container.style.display = 'flex';
    container.style.justifyContent = value;
    this.templateChanged();
  },
  alignItemsChanged: function (value) {
    var container = this.$$('.sortable.selected');
    container.style.display = 'flex';
    container.style.alignItems = value;
    this.templateChanged();
  },
  /* Requires to set the height of the container
   this.$$('#flexbox-container').offsetHeight;
   alignContentChanged: function (value) {
   var container = this.$$('#flexbox-container');
   container.style.display = 'flex';
   container.style.alignContent = value;
   },*/
  flexGrowChanged: function (value) {
    var item = this.$$('.member-selected');
    if (item) item.style.flexGrow = value;
    this.templateChanged();
  },
  flexShrinkChanged: function (value) {
    var item = this.$$('.member-selected');
    if (item) item.style.flexShrink = value;
    this.templateChanged();
  },
  trimComponentId: function (componentId) {
    return componentId.substring(componentId.indexOf('/') + 1);
  },
  addFlexbox: function () {
    var container = this.$$('#flexbox-container');
    var flexbox = document.createElement('div');
    var sortable = document.createElement('sortable-js');
    var removeButton = document.createElement('i');

    Polymer.dom(flexbox).appendChild(sortable);
    Polymer.dom(flexbox).appendChild(removeButton);
    Polymer.dom(container).appendChild(flexbox);
    flexbox.setAttribute('class', 'flexbox style-scope bde-flexbox-layouter');
    sortable.setAttribute('class', 'sortable style-scope bde-flexbox-layouter');
    sortable.setAttribute('group', 'sortable');
    sortable.setAttribute('ghost-class', 'ghost');
    sortable.style.display = 'flex';
    sortable.style.flexDirection = 'row';
    sortable.style.flexWrap = 'wrap';
    sortable.style.justifyContent = 'flex-start';
    sortable.style.alignItems = 'flex-start';
    sortable.addEventListener('tap', this.selectFlexbox.bind(this));
    sortable.addEventListener('sort', this.templateChanged.bind(this));
    sortable.addEventListener('add', this.moveMember);
    Polymer.dom(sortable).observeNodes(this.templateChanged.bind(this));
    removeButton.setAttribute('class', 'style-scope bde-flexbox-layouter');
    removeButton.innerHTML = '✖';
    removeButton.addEventListener('tap', this.removeFlexbox.bind(this));
    this.templateChanged();
    return flexbox;
  },
  selectFlexbox: function (event) {
    var selectedElements = Polymer.dom(event).localTarget.parentNode.parentNode.querySelectorAll('.selected');
    for (let i = 0; i < selectedElements.length; i++) {
      selectedElements[i].classList.remove('selected');
    }
    Polymer.dom(event).localTarget.classList.add('selected');
    // Update flexbox settings
    this.updateFlexboxSettings(Polymer.dom(event).localTarget);
    // Unselect member
    selectedElements = Polymer.dom(this.root).querySelectorAll('.member-selected');
    for (let i = 0; i < selectedElements.length; i++) {
      selectedElements[i].classList.remove('member-selected');
    }
    this.$$('#item-settings').classList.add('hidden');
  },
  updateFlexboxSettings: function (element) {
    this.flexDirection = element.style.flexDirection;
    this.flexWrap = element.style.flexWrap;
    this.justifyContent = element.style.justifyContent;
    this.alignItems = element.style.alignItems;
  },
  removeFlexbox: function (event) {
    var container = this.$$('#flexbox-container');
    var flexbox = Polymer.dom(event).localTarget.parentNode;
    var sortable = Polymer.dom(flexbox).querySelector('.sortable');
    var nodes = Polymer.dom(flexbox).querySelectorAll('.member');

    // Flexboxes with members can not be removed
    if (nodes.length > 0) {
      this.$.toast.open();
    } else {
      // If the flexbox to be removed is selected, select first by default
      if (sortable.classList.contains('selected')) {
        this.$$('.sortable:not(.parking)').classList.add('selected');
      }
      // Remove flexbox
      Polymer.dom(container).removeChild(flexbox);
      this.templateChanged();
    }
  },
  selectMember: function (event) {
    // Hidden members can not be selected
    if (!Polymer.dom(event).localTarget.parentNode.classList.contains('parking')) {
      var container = Polymer.dom(event).localTarget.parentNode.parentNode.parentNode;
      var flexboxes = Polymer.dom(container).querySelectorAll('.sortable:not(.parking)');

      for (let i = 0; i < flexboxes.length; i++) {
        var selectedElements = Polymer.dom(flexboxes[i]).querySelectorAll('.member-selected');
        for (let i = 0; i < selectedElements.length; i++) {
          selectedElements[i].classList.remove('member-selected');
        }
      }
      Polymer.dom(event).localTarget.classList.add('member-selected');
      this.$$('#item-settings').classList.remove('hidden');
      this.flexGrow = Polymer.dom(event).localTarget.style.flexGrow;
      this.flexShrink = Polymer.dom(event).localTarget.style.flexShrink;
    }
    event.stopPropagation();
  },
  moveMember: function (event) {
    var from = Polymer.dom(event).event.from;
    var to = Polymer.dom(event).event.to;
    var member = Polymer.dom(event).event.item;

    if (from && to && member) {
      Polymer.dom(from).removeChild(member);
      Polymer.dom(to).appendChild(member);
    }
  },
  templateChanged: function () {
    console.log('<bde-flexbox-layouter>::templateChanged', this.getTemplate());
  },
  getTemplate: function () {
    var flexboxes = Polymer.dom(this.root).querySelectorAll('.sortable');
    var template = document.createElement('template');
    template.setAttribute(this.buildAttributeName('template'), '');

    for (let i = 0; i < flexboxes.length; i++) {
      let flexbox = flexboxes[i].cloneNode(true),
        div = document.createElement('div');
      if (flexbox.classList.contains('parking')) {
        div.style.display = 'none';
        div.setAttribute(this.buildAttributeName('hidden-div'), '');
      } else {
        div.style.cssText = flexbox.getAttribute('style');
        div.setAttribute(this.buildAttributeName('flex-div'), '');
      }

      template.content.appendChild(div);
      while (flexbox.hasChildNodes()) {
        if (flexbox.firstChild.nodeName.toString().toLowerCase() !== 'i') {
          Polymer.dom(div).appendChild(flexbox.removeChild(flexbox.firstChild));
        } else {
          flexbox.removeChild(flexbox.firstChild);
        }
      }
      for (let ii = 0; ii < div.children.length; ii++) {
        div.children[ii].removeAttribute('class');
        div.children[ii].removeAttribute('draggable');
        div.children[ii].innerHTML = '';
      }
    }
    return template;
  },
  loadTemplate: function (templateString) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = templateString;
    var template = tempDiv.querySelector('[' + this.buildAttributeName('template') + ']');
    if (!template) {
      this.fire('no-compatible-template');
      return;
    }
    this.fire('compatible-template');
    this.clearContainer();
    var sortables = Polymer.dom(this.root).querySelectorAll('.sortable');
    // Load hidden members
    var hiddenDiv = template.content.querySelector('[' + this.buildAttributeName('hidden-div') + ']');
    for (var i = 0; i < hiddenDiv.children.length; i++) {
      Polymer.dom(sortables[0]).appendChild(this.prepareMemberToBeAdded(hiddenDiv.children[i]));
    }
    // Load visible members
    var flexDivs = template.content.querySelectorAll('[' + this.buildAttributeName('flex-div') + ']');
    var members;
    var flexbox;
    for (var j = 0; j < flexDivs.length; j++) {
      if (j >= 1) {
        // Add flexvbox divs when needed
        flexbox = this.addFlexbox().querySelector('.sortable');
      } else {
        flexbox = sortables[1];
        flexbox.classList.remove('selected');
      }
      // Apply style to divs
      flexbox.setAttribute('style', flexDivs[j].getAttribute('style'));
      members = flexDivs[j].children;
      for (var k = 0; k < members.length; k++) {
        Polymer.dom(flexbox).appendChild(this.prepareMemberToBeAdded(members[k]));
      }
    }
    // Select last edited flexbox div
    flexbox.classList.add('selected');
    this.updateFlexboxSettings(flexbox);
  },
  prepareMemberToBeAdded: function (memberElement) {
    memberElement.innerHTML = memberElement.getAttribute('member-id-ref');
    memberElement.className = 'member';
    return memberElement;
  },
  buildAttributeName: function (suffix) {
    var version = this.bdeVersion || 'unknown';
    return 'bde-' + version.replace(/\./g, '-') + '-generated-' + suffix;
  }
});
