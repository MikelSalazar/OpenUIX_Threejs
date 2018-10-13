import { Scene, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, TetrahedronGeometry } from "THREE";

export class Viewport {
	element : HTMLElement;
	canvas : HTMLElement;
	renderer : WebGLRenderer;
	camera: PerspectiveCamera;
	scene: Scene;
	cube : Mesh;

	static instances: Viewport[] = [];

	/** Initializes a new Viewport instance.
	 * @param parent The parent element (by default, the body element).
	 * @param options The options of the viewport. */
	constructor(parent?:HTMLElement, options?: object) {
		let index = Viewport.instances.length, id = (index>0)? " " + index: "";
		parent = (parent)? parent : document.body;
		this.element = createDomElement("div", parent, "OpenUIX Viewport" + id);
		this.canvas = createDomElement("canvas", this.element, 
			"OpenUIX Canvas" + id, "width:100%; height:100%") ;

		this.renderer = new WebGLRenderer({canvas: this.canvas as HTMLCanvasElement});
		this.scene= new Scene();

		var geometry = new BoxGeometry( 1, 1, 1 );
		var material = new MeshBasicMaterial( { color: 0x00ff00 } );
		this.cube = new Mesh( geometry, material );
		this.scene.add( this.cube );

		this.camera = new PerspectiveCamera( 75, 
			this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000 );
		this.camera.position.z = 5;
		
		Viewport.instances.push(this);
		requestAnimationFrame(this.render);
		
	}


	/** Renders the viewport (through the requestAnimationFrame function). */
	render = () => {
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this.render);
	}
}

/** Creates a new DOM element.
 * @param tag The tag of the new DOM element.
 * @param id The id of the new DOM element.
 * @param style The style of the new DOM element.
 * @param parent The parent of the new DOM element.
 * @param text The parent of the new DOM element.
 * @returns The created DOM element. */
export function createDomElement(tag:string, parent?:HTMLElement, 
	id?:string, style?:string, text?:string) {
var element = document.createElement(tag);
if (id) element.id = id;
if (style) element.setAttribute("style", style);
if (text) element.textContent = text;
if (parent) parent.appendChild(element);
return element;
}