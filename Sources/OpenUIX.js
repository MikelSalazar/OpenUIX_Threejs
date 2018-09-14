

// GLOBAL FUNCTIONS

/** Initializes a basic OpenUIX environment.
 * @param {*} params The initialization parameters.
 */
OpenUIX.Init = function(params) {

	// Check if the Threejs has been loaded
	// if (typeof THREE === 'undefined') 
	// 	throw new Error("Threejs has not been loaded.");

	var viewport = new OpenUIX.Viewport();
	new OpenUIX.DevTools(viewport);

	console.log("OpenUIX has been sucessfully initialized");
};

/** Creates a new DOM element.
 * @param {*} tag The tag of the new DOM element.
 * @param {*} id The id of the new DOM element.
 * @param {*} style The style of the new DOM element.
 * @param {*} parent The parent of the new DOM element.
 * @param {*} text The parent of the new DOM element.
 * @returns The created DOM element. */
function createDomElement(tag, parent = null, id = null, style = null, text = null) {
	var element = document.createElement(tag);
	if (id) element.id = id;
	if (style) element.style = style;
	if (text) element.textContent = text;
	if (parent) parent.appendChild(element);
	return element;
}