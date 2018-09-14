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