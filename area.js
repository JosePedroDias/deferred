if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SCALE = 1;
var MARGIN = 100;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight - 2 * MARGIN;

var NEAR = 1.0;
var FAR = 350.0;
var VIEW_ANGLE = 40;

// controls
var mouseX = 0;
var mouseY = 0;

var targetX = 0, targetY = 0;
var angle = 0;
var target = new THREE.Vector3( 0, 0, 0 );

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// core
var renderer, camera, scene, stats, clock;
var areaLight1, areaLight2, areaLight3;



init();
animate();



function init() {
	// renderer
	renderer = new THREE.WebGLDeferredRenderer( {
		width:  WIDTH,
		height: HEIGHT,
		scale:  SCALE,
		antialias:   true,
		tonemapping: THREE.FilmicOperator,
		brightness:  2.5
	} );

	renderer.domElement.style.position = "absolute";
	renderer.domElement.style.top = MARGIN + "px";
	renderer.domElement.style.left = "0px";

	var container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );

	// effects
	var bloomEffect = new THREE.BloomPass( 0.65 );
	renderer.addEffect( bloomEffect );

	// camera
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, WIDTH / HEIGHT, NEAR, FAR );
	camera.position.y = 40;

	// scene
	scene = new THREE.Scene();
	scene.add( camera );

	// stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '8px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	// clock
	clock = new THREE.Clock();

	// add lights
	initLights();

	// add objects
	initObjects();

	// events
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );
}



function createAreaEmitter( light ) {
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: light.color.getHex(), vertexColors: THREE.FaceColors } );

	var backColor = 0x222222;

	geometry.faces[ 5 ].color.setHex( backColor );
	geometry.faces[ 4 ].color.setHex( backColor );
	geometry.faces[ 2 ].color.setHex( backColor );
	geometry.faces[ 1 ].color.setHex( backColor );
	geometry.faces[ 0 ].color.setHex( backColor );

	var emitter = new THREE.Mesh( geometry, material );
	emitter.scale.set( light.width * 2, 0.2, light.height * 2 );

	return emitter;
}



function setupAreaLight( light ) {
	var matrix = light.matrixWorld;

	light.right.set( 1, 0, 0 );
	light.normal.set( 0, -1, 0 );

	light.right.applyMatrix4( matrix );
	light.normal.applyMatrix4( matrix );
}



function initLights() {
	areaLight1 = new THREE.AreaLight( 0xffffff, 1 );
	areaLight1.position.set( 0.0001, 10.0001, -18.5001 );
	areaLight1.rotation.set( -0.74719, 0.0001, 0.0001 );
	areaLight1.width = 10;
	areaLight1.height = 1;
	scene.add( areaLight1 );

	var meshEmitter = createAreaEmitter( areaLight1 );
	areaLight1.add( meshEmitter );

	//

	areaLight2 = new THREE.AreaLight( 0x33ff66, 1.5 );
	areaLight2.position.set( -19.0001, 3.0001, 0.0001 );
	areaLight2.rotation.set( -1.5707, 0.0001, 1.5707 );
	areaLight2.width = 8;
	areaLight2.height = 1;
	scene.add( areaLight2 );

	var meshEmitter = createAreaEmitter( areaLight2 );
	areaLight2.add( meshEmitter );

	//

	areaLight3 = new THREE.AreaLight( 0x3366ff, 1.5 );
	areaLight3.position.set( 19.0001, 3.0001, 0.0001 );
	areaLight3.rotation.set( 1.5707, 0.0001, -1.5707 );
	areaLight3.width = 8;
	areaLight3.height = 1;
	scene.add( areaLight3 );

	var meshEmitter = createAreaEmitter( areaLight3 );
	areaLight3.add( meshEmitter );
}



function initObjects() {
	var loader = new THREE.BinaryLoader();
	loader.load( "obj/box/box.js", function ( geometry, materials ) {
		var material = new THREE.MeshPhongMaterial( { color: 0xffaa55, specular: 0x888888, shininess: 200 } );
		var object = new THREE.Mesh( geometry, material );
		object.scale.multiplyScalar( 2 );
		scene.add( object );
	} );
}



function onWindowResize( event ) {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight - 2 * MARGIN;

	renderer.setSize( WIDTH, HEIGHT );

	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}



function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) * 1;
	mouseY = ( event.clientY - windowHalfY ) * 1;
}



function animate() {
	requestAnimationFrame( animate );

	render();
	stats.update();
}



function render() {
	// update camera
	var delta = clock.getDelta();

	targetX = mouseX * .001;
	targetY = mouseY * .001;

	angle += 0.05 * ( targetX - angle );

	camera.position.x = -Math.sin( angle ) * 40;
	camera.position.z =  Math.cos( angle ) * 40;

	camera.lookAt( target );

	var time = Date.now();

	areaLight1.position.x = Math.sin( Date.now() * 0.001 ) * 9;
	areaLight1.position.y = Math.sin( Date.now() * 0.0013 ) * 5 + 5;

	areaLight2.position.y = Math.sin( Date.now() * 0.0011 ) * 3 + 5;
	areaLight2.position.z = Math.sin( Date.now() * 0.00113 ) * 10;

	areaLight3.position.y = Math.sin( Date.now() * 0.00111 ) * 3 + 5;
	areaLight3.position.z = Math.sin( Date.now() * 0.001113 ) * 10;

	// render
	renderer.render( scene, camera );
}