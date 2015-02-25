
//variables for scene
var renderer, scene, camera, pointLight, spotLight;

//sphere's dimensions
var radius = 5, segments = 10, rings = 10;

//variables for the plane
var planeWidth = 400, planeHeight = 200, planeQuality = 50;

//variables for the paddles
var paddleWidth = 10, paddleHeight = 30, paddleDepth = 10, paddleQuality = 1;

//object's variables 
var ball, paddle1, paddle2;



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
	
	camera.position.x = paddle1.position.x - 100;
	camera.position.z = paddle1.position.z + 100;
	//YAW rotation "Rotation around y axis
	camera.rotation.y = -60 * Math.PI/180;
	//ROLL rotation "rotation around z axis"
	camera.rotation.z = -90 * Math.PI/180; //value in radians
	

}


function createScene()
{
	// set the scene size
	var width = 640, height = 360;

	var VIEW_ANGLE = 50;
	var ASPECT = width / height;
	var NEAR = 1;
	var FAR = 1000;
	 
	var canvas = document.getElementById("gameCanvas");

	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR);

	scene = new THREE.Scene();
	scene.add(camera);
	
	//this is needed because otherwise we haven't a correct 
	//rendering for the shadow
	camera.position.z = 320;

	renderer.setSize(width, height);

	canvas.appendChild(renderer.domElement);

//--------------------------------------------------------------------------	
	// create the sphere's material
	var sphereMaterial = new THREE.MeshPhongMaterial({
		color: 0x017ad4,
	});
	 
	//Create a ball with SphereGeometry method
	ball = new THREE.Mesh( new THREE.SphereGeometry(radius,
	    segments,rings),sphereMaterial);
	 
	//add the sphere to the scene
	scene.add(ball);
	
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;
//--------------------------------------------------------------------------

//DA VEDERE POINTLIGHT

	//create a point light
	pointLight = new THREE.PointLight(0xffffff);
	 
	// set its position
	pointLight.position.x = -100;
	pointLight.position.y = 100;
	pointLight.position.z = 20;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	 
	// add to the scene
	scene.add(pointLight);

//--------------------------------------------------------------------------
	// create the plane's material	
	var planeMaterial =
	new THREE.MeshPhongMaterial(
	{
	    color: 0x4BD121
	});
	 

	// create the playing surface plane
	var plane = new THREE.Mesh(
	    new THREE.PlaneGeometry(
	    planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
	    planeHeight,
	    planeQuality,
	    planeQuality),
	    planeMaterial);
	 
	scene.add(plane);
//--------------------------------------------------------------------------
	
		
	//create the first paddle
	paddle1_Material = new THREE.MeshPhongMaterial({
		color: 0xFFFF00 //1B32C0
	});

	paddle1 = new THREE.Mesh(new THREE.CubeGeometry(
			paddleWidth, paddleHeight, paddleDepth,paddleQuality,10,10),
			paddle1_Material);
	
	//add paddle1 to the scene
	scene.add(paddle1);
	
	//set position of paddle1
	paddle1.position.x = -planeWidth/2 + paddleWidth;
	
	//to make the shadow
	paddle1.receiveShadow = true;
	paddle1.castShadow = true;
			
	paddle1.position.z = paddleDepth;
	
	//create the second paddle
	paddle2_Material = new THREE.MeshPhongMaterial({
		color: 0xFF0000
	});
	
	paddle2 = new THREE.Mesh(new THREE.CubeGeometry(
			paddleWidth, paddleHeight, paddleDepth,paddleQuality,10,10),
			paddle2_Material);
	
	//add paddle2 to the scene
	scene.add(paddle2);
	
	//set position of paddle1
	paddle2.position.x = planeWidth/2 - paddleWidth;
	
	//to make the shadow
	paddle2.receiveShadow = true;
	paddle2.castShadow = true;

	paddle2.position.z = paddleDepth;
	
//--------------------------------------------------------------------------	
	
}