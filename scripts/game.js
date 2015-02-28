
//variables for scene
var renderer, scene, camera;
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
var ballDirX = 1, ballDirY = 1, ballSpeed = 3;

var paddleSpeed = 6;
var score_P1 = 0, score_P2 = 0; scoreToWin = 5;

//higher value implies greater difficulty
var set_diff = 0.8;


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

	//old values camera
	camera.position.x = paddle1.position.x - 100;
	camera.position.z = paddle1.position.z + 100;
	//YAW rotation "Rotation around y axis
	camera.rotation.y = -60 * Math.PI/180;
	// camera.rotation.x = 20 * Math.PI/180;
	//ROLL rotation "rotation around z axis"
	camera.rotation.z = -90 * Math.PI/180; //value in radians

	// camera.position.x = paddle1.position.x ;
	// camera.position.z = paddle1.position.z + 100;
	// //YAW rotation "Rotation around y axis
	// // camera.rotation.y = -20 * Math.PI/180;
	// // camera.rotation.x = 20 * Math.PI/180;
	// //ROLL rotation "rotation around z axis"
	// camera.rotation.z = -90 * Math.PI/180; //value in radians
}

function draw()
{  
    // draw THREE.JS scene
    renderer.render(scene, camera);
 
    // loop the draw() function
    requestAnimationFrame(draw);

    playerPaddleBehaviour();
	opponentPaddleMovement();
    ballBehaviour();
    paddlePhysics();
	
}

function createLights()
{
	var light1, light2, light3, light4, light5, light6;
	var posX = (planeWidth/2) * 1.2;
	var posY = (planeHeight/2) * 1.2;

	//create a point light
	// light1 = new THREE.PointLight(0xffffff);
	// light1.position.x = planeWidth/4;
	// light1.position.y = planeHeight/4;
	// light1.position.z = 20;
	// light1.intensity = 2.9;
	// light1.distance = 1000;

	light1 = new THREE.SpotLight(0xffffff, 2);
	light1.position.set( -posX, -posY, 30 );
	light1.castShadow = true;
	scene.add(light1);

	light2 = new THREE.SpotLight(0xffffff, 2);
	light2.position.set( posX, posY, 30 );
	light2.castShadow = true;
	scene.add(light2);

	light3 = new THREE.SpotLight(0xffffff, 2);
	light3.position.set( posX, -posY, 30 );
	light3.castShadow = true;
	scene.add(light3);

	light4 = new THREE.SpotLight(0xffffff, 2);
	light4.position.set( -posX, posY, 30 );
	light4.castShadow = true;
	scene.add(light4);

	light5 = new THREE.SpotLight(0xffffff, 1);
	light5.position.set( -posX, 0, 20 );
	light5.castShadow = true;
	scene.add(light5);
}


function createScene()
{	
	 
	var canvas = document.getElementById("gameCanvas");

	renderer = new THREE.WebGLRenderer();
	

	scene = new THREE.Scene();

	renderer.setSize(width, height);

	canvas.appendChild(renderer.domElement);

//--------------------------------------------------------------------------	

	var ball_texture = THREE.ImageUtils.loadTexture( "images/ball_texture.jpg" );
	// create the sphere's material
	var sphereMaterial = new THREE.MeshPhongMaterial({
		// color: 0x032149,
		map: ball_texture
	});
	 
	//Create a ball with SphereGeometry method
	ball = new THREE.Mesh( new THREE.SphereGeometry(radius,
	    segments,rings),sphereMaterial);
	 
	//add the sphere to the scene
	scene.add(ball);
	

	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;

    createLights();
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
	
	var player_texture = THREE.ImageUtils.loadTexture( "images/player_texture.jpg" );
	//create the first paddle
	paddle1_Material = new THREE.MeshPhongMaterial({
		// color: 0xFFFF00, //1B32C0
		map: player_texture,
		metal: true
	});

	paddle1 = new THREE.Mesh(new THREE.BoxGeometry(
			paddleWidth, paddleHeight, paddleDepth),
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
	
	var opponent_texture = THREE.ImageUtils.loadTexture( "images/opponent_texture.jpg" );
	//create the second paddle
	paddle2_Material = new THREE.MeshPhongMaterial({
		// color: 0x000000,
		map: opponent_texture,
		metal: true
	});
	
	paddle2 = new THREE.Mesh(new THREE.BoxGeometry(
			paddleWidth, paddleHeight, paddleDepth),
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

	// else don't move paddle
	else
	{
		paddle1DirY = 0;
	}

	if (Key.isDown(Key.S))
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
	}

	//when the game starts the paddle will be resized to 1
	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	

	paddle1.position.y += paddle1DirY;
}
//--------------------------------------------------------------------------
function opponentPaddleMovement(){

	//The axis of the paddle's movement is y
	paddle2DirY = (ball.position.y - paddle2.position.y) * set_diff;

	
	// nel caso in cui il valore incrementale sulla posizione y del paddle sia sotto i limiti
	// di velocità dettati da paddlespeed, allora posso incrementare la posizione del paddle
	// del valore paddle2DirY che ci serve per inseguire la palla
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{	
		paddle2.position.y += paddle2DirY;
	}

	// altrimenti, abbiamo che il valore incrementale sulla direzione y del paddle, supererebbe la massima velocità consentita
	// esempio: supponi che la max velocità è 5, e per inseguire la palla calcoliamo il valore paddle2DirY = 6.
	// in questo caso, se non riportassimo la posizione entro i limiti di velocità si avrebbe che la opsizione verrebbe incrementata di 6
	// però il player umano, può incrementare la sua posizione solo di 5, quindi non sarebbe fair.
	// i limiti di bound della velocità sono quindi dettati da -5 e +5 in base a se ci stiamo muovendo a destra o sinistra.
	else
	{
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}

		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}
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
//--------------------------------------------------------------------------
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
//--------------------------------------------------------------------------


function paddlePhysics()
{
    // PLAYER PADDLE LOGIC
 
	// if ball is aligned with paddle1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// and if ball is aligned with paddle1 on y plane
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirX < 0)
			{
				// put some code to indicate a hit
				
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}
 
	// OPPONENT PADDLE LOGIC	
 
	// if ball is aligned with paddle2 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{
		// and if ball is aligned with paddle2 on y plane
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards opponent (+ve direction)
			if (ballDirX > 0)
			{
				// put some code to indicate a hit
				
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}
