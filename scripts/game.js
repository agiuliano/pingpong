
//variables for scene
var renderer, scene, camera, pointLight, spotLight;
var width = 640, height = 400;

//sphere's dimensions
var radius = 5, segments = 10, rings = 10;

//variables for the plane
var planeWidth = 400, planeHeight = 200, planeQuality = 50;

//variables for the paddles
var paddleWidth = 10, paddleHeight = 30, paddleDepth = 10, paddleQuality = 1;

//object's variables 
var ball, paddle1, paddle2;

//ball movement
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

var paddleSpeed = 15;
var score_P1 = 0, score_P2 = 0; scoreToWin = 2;


function setup()
{
	createScene();
	setTheCamera();	
	draw();	
}

function setTheCamera()
{
	var VIEW_ANGLE = 50;
	var ASPECT = width / height;
	var NEAR = 1;
	var FAR = 1000;

	camera = new THREE.PerspectiveCamera(
	    VIEW_ANGLE,
	    ASPECT,
	    NEAR,
	    FAR);

	scene.add(camera);
	
	//this is needed because otherwise we haven't a correct 
	//rendering for the shadow
	camera.position.z = 320;

	camera.position.x = paddle1.position.x - 100;
	camera.position.z = paddle1.position.z + 100;
	//YAW rotation "Rotation around y axis
	camera.rotation.y = -60 * Math.PI/180;
	//ROLL rotation "rotation around z axis"
	camera.rotation.z = -90 * Math.PI/180; //value in radians
}

function draw()
{  
    // draw THREE.JS scene
    renderer.render(scene, camera);
 
    // loop the draw() function
    requestAnimationFrame(draw);

    playerPaddleBehaviour();
    ballBehaviour();
	
}



function createScene()
{	
	 
	var canvas = document.getElementById("gameCanvas");

	renderer = new THREE.WebGLRenderer();
	

	scene = new THREE.Scene();

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
	paddle1.scale.y = 0.01;
	
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

//--------------------------------------------------------------------------
function playerPaddleBehaviour()
{
	// move left
	if (Key.isDown(Key.A))		
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.y < planeHeight * 0.4)
		{
			paddle1DirY = paddleSpeed;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
		}
	}	
	// move right
	else if (Key.isDown(Key.D))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.y > -planeHeight * 0.4)
		{
			paddle1DirY = -paddleSpeed;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
		}
	}

	else if (Key.isDown(Key.S))
	{
		if (paddle1.position.x < -planeWidth * 0.45) {
			paddle1.position.x += 1;
		}
	}

	else if (Key.isUp(Key.S))
	{
		if (paddle1.position.x > -planeWidth * 0.50) {
			paddle1.position.x -= 3;
		}
		paddle1DirY = 0;
	}

	// else don't move paddle
	else
	{
		// stop the paddle
		paddle1DirY = 0;
	}

	//when the game starts the paddle will be resized to 1
	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	

	paddle1.position.y += paddle1DirY;
}
//--------------------------------------------------------------------------

function ballBehaviour(){
	// if ball goes off the 'left' side (Player's side)
	if (ball.position.x <= -planeWidth/2)
	{	
		//add 1 point to the opponent
		score_P2++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score_P1 + "-" + score_P2;
		// reset ball to center
		resetBall(2);
		
		checkScore();		
	}
	
	// if ball goes off the 'right' side (CPU's side)
	if (ball.position.x >= planeWidth/2)
	{	
		// Player scores
		score_P1++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score_P1 + "-" + score_P2;
		// reset ball to center
		resetBall(1);
		
		checkScore();
	}
	
	// if ball goes off the top side (side of table)
	if (ball.position.y <= -planeHeight/2)
	{
		ballDirY = -ballDirY;
	}	
	// if ball goes off the bottom side (side of table)
	if (ball.position.y >= planeHeight/2)
	{
		ballDirY = -ballDirY;
	}
	
	//Update ball position over time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	
	// limit ball's y-speed to 2x the x-speed
	// this is so the ball doesn't speed from left to right super fast
	// keeps game playable for humans
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

function resetBall(loser){	
	// if player lost the last point, we send the ball to opponent
	if (loser == 1)
	{
		ball.position.x = planeWidth/2;
		ball.position.y = 0;
		ballDirX = -1;
	}
	// else if opponent lost, we send ball to player
	else
	{
		ball.position.x = -planeWidth/2;
		ball.position.y = 0;
		ballDirX = 1;
	}
	
	// set the ball to move +ve in y plane (towards left from the camera)
	ballDirY = 1;
}

//--------------------------------------------------------------------------

function checkScore(){
	if(score_P1 === scoreToWin){
		ballSpeed = 0;
		
		document.getElementById("scores").innerHTML = "Player wins!";		
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		ball.position.x = 0;

	}
	
	else if(score_P2 === scoreToWin){
		ballSpeed = 0;
		
		document.getElementById("scores").innerHTML = "CPU wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		
		ball.position.x = 0;
	}

}