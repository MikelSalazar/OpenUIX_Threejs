// DevTools/DevTools.js

// This file
// Message console, Debug, watchers, profiling
OpenUIX.DevTools = class {
	constructor(viewport = null, panel = null) {
		if (!viewport) throw new Error("No OpenUIX viewport defined"); 
		
		if (panel) this.panel = panel;
		else {
			this.panel = createDomElement("div", viewport.element);
			this.placePanel();
		}
	}

	placePanel(position = "bottom") {
		var style =	this.panel.style;
		this.panel.style ="position:absolute; background-color:red;";

		switch(position) {
			case "bottom": 
			this.panel.style.width= "100%";
			this.panel.style.height= "100px";
			this.panel.style.bottom= "0";
				
			break;

		}
	}
};

OpenUIX.DevTools.Profiling = Profiling = class {
	constructor(env) {
	}
};


// Viewport.js

OpenUIX.Viewport = class {
	constructor() {
		var number = OpenUIX.Viewport.instances++;
		var style = "width:100%; height:100%; background-color:black;";
		this.element = createDomElement("div", document.body, 
			"OpenUIX_Viewport" + ((number>0)? number:""), style);
		this.canvas = createDomElement("canvas", this.element, 
			"OpenUIX_Canvas" + ((number>0)? number:""), style);
	}
};

OpenUIX.Viewport.instances = 0;

// OpenUIX.js



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

