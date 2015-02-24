var renderer, scene, camera, pointLight, spotLight;

function setup()
{
	createScene();
	draw();
}

function draw()
{  
    // draw THREE.JS scene
    renderer.render(scene, camera);
 
    // loop the draw() function
    requestAnimationFrame(draw);
 
    // process game logic

}


function createScene()
{
	// set the scene size
	var WIDTH = 640,
	HEIGHT = 360;

	var VIEW_ANGLE = 45;
	var ASPECT = WIDTH / HEIGHT;
	var NEAR = 1;
	var FAR = 1000;
	 
	
	var c = document.getElementById("gameCanvas");

	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR);

	scene = new THREE.Scene();
	scene.add(camera);

	camera.position.z = 320;

	renderer.setSize(WIDTH, HEIGHT);

	c.appendChild(renderer.domElement);

	 
	
	 
	
	 
	// add the camera to the scene
	
	 
	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
	


	var radius = 20;
	var segments = 10;
	var rings = 20;
	 
	// create the sphere's material
	var sphereMaterial = new THREE.MeshPhongMaterial({
		color: 0x017ad4,

	});
	 
	// Create a ball with sphere geometry
	var ball = new THREE.Mesh(
	    new THREE.SphereGeometry(radius,
	    segments,
	    rings),
	    sphereMaterial);

	 
	// add the sphere to the scene
	scene.add(ball);



	// // create a point light
	pointLight = new THREE.PointLight(0xffffff);
	 
	// set its position
	pointLight.position.x = -100;
	pointLight.position.y = 100;
	pointLight.position.z = 20;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	 
	// add to the scene
	scene.add(pointLight);


	// create the plane's material	
	var planeMaterial =
	new THREE.MeshLambertMaterial(
	{
	    color: 0x4BD121
	});
	 

	var planeWidth = 100;
	var planeHeight = 20;
	var planeQuality = 100;
	// create the playing surface plane
	var plane = new THREE.Mesh(
	    new THREE.PlaneGeometry(
	    planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
	    planeHeight,
	    planeQuality,
	    planeQuality),
	    planeMaterial);
	 
	scene.add(plane);
}