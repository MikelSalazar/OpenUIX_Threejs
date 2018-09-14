// This file
// Message console, Debug, watchers, profiling
OpenUIX.DevTools = class {
	constructor(viewport, element = null, position = null) {
		
		//Check the given parameters
		if (!viewport) throw new Error("No OpenUIX viewport defined"); 
		
		// Private fields
		this._position = null;
		this.element = element;

		if (!this.element) {
			this.element = createDomElement("div", viewport.element);
		}
	}

	get position () { return this._position; }
	set position (value) {
		
		switch (value) {

			default:
			throw new Error("Invalid DevTools Position");
		}
		return this._position;
	}


	placePanel(position = "bottom") {

		var style =	this.panel.style;
		style ="position:absolute; background-color:red;";

		switch(position) {
			case "bottom": 
			style.width= "100%";
			this.panel.style.height= "100px";
			this.panel.style.bottom= "0";
			break;

		}
	}
};

var d = new DevTools();
d._position
d.position = 3;

OpenUIX.DevTools.Profiling = Profiling = class {
	constructor(env) {
	}
};
