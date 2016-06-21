/**
 * Created by ene on 17.07.2015.
 */

addEventListener('polymer-ready', function(){

	var cubxRoot = document.querySelector('[cubx-core-crc]').firstElementChild
	var rootChild = cubxRoot.children

	// set all children of cubxRoot as draggable elements
	for (i = 0; i != rootChild.length; i++) {
		//console.log('++ rootChild :', i, rootChild[i].tagName)

		rootChild[i].setAttribute('class', 'draggable')

		//var newDiv = document.createElement('div')
		//newDiv.setAttribute('class', 'handle')
		//rootChild[i].shadowRoot.appendChild(newDiv)
		////rootChild[i].appendChild(newDiv)

		//TODO (ene): draggabilly disables the usage of form elements..., possible to use <div class='handle'><div>

	}
	initDraggable()
})

function initDraggable(){
	// if you have multiple .draggable elements
	// get all draggie elements
	var draggableElems = document.querySelectorAll('.draggable');
	// array of Draggabillies
	//var draggies = []
	// init Draggabillies
	for (var i = 0, len = draggableElems.length; i < len; i++) {
		var draggableElem = draggableElems[i];
		var draggie = new Draggabilly(draggableElem, {
			// options

			//handle : '.handle'

		});
		//draggies.push(draggie);
	}
	//console.log('++ drag-elements', draggableElems)
}
