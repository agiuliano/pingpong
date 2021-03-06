
//variables for scene
var renderer, scene, camera;
var width = 1000, height = 600;
var playing = false;
var shadows = false;
//sphere's dimensions
var radius = 5, segments = 10, rings = 10;

//variables for the plane
var planeWidth = 400, planeHeight = 200, planeQuality = 50;

//variables for the paddles
var paddleWidth = 10, paddleHeight = 30, paddleDepth = 10, paddleQuality = 1;

//object's variables 
var ball, paddle1, paddle2;

//ball movement
var ballDirX = 1, ballDirY = 1, startingBallSpeed = 2, ballSpeed = 3;

var startingPaddleSpeed = 5, paddleSpeed = 6;
var score_P1 = 0, score_P2 = 0; scoreToWin = 5;

//higher value implies greater difficulty
var set_diff = 0.3;
var start_play = false;

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

    camera.position.z = 320;
    camera.position.x = -planeWidth/2 - 110;
    camera.position.z = paddle1.position.z + 100;
    // camera.position.z = paddle1.position.z;
    //YAW rotation "Rotation around y axis
    camera.rotation.y = -60 * Math.PI/180;
    // camera.rotation.y = -90 * Math.PI/180;
    // camera.rotation.x = -60 * Math.PI/180;
    //ROLL rotation "rotation around z axis"
    camera.rotation.z = -90 * Math.PI/180; //value in radians


}

function draw()
{
    renderer.render(scene, camera);
    renderer.setClearColor(0x000099, 1);

    // loop the draw() function
    requestAnimationFrame(draw);

    playerPaddleBehaviour();
    opponentPaddleMovement();
    ballBehaviour();
    paddlePhysics();
    moveBall();
}

function createLights()
{
    var light1, light2, light3, light4, light5, light6, point_light;
    var posX = (planeWidth/2) * 1.2;
    var posY = (planeHeight/2) * 1.2;

    light1 = new THREE.SpotLight(0xffffff, 2);
    light1.position.set( -posX, -posY, 30 );
    light1.castShadow = shadows;
    scene.add(light1);

    light2 = new THREE.SpotLight(0xffffff, 2);
    light2.position.set( posX, posY, 30 );
    light2.castShadow = shadows;
    scene.add(light2);

    light3 = new THREE.SpotLight(0xffffff, 2);
    light3.position.set( posX, -posY, 30 );
    light3.castShadow = shadows;
    scene.add(light3);

    light4 = new THREE.SpotLight(0xffffff, 2);
    light4.position.set( -posX, posY, 30 );
    light4.castShadow = shadows;
    scene.add(light4);

    //light5 = new THREE.SpotLight(0xffffff, 1);
    light5 = new THREE.PointLight( 0xffffff, 1);
    light5.position.set( -posX, 0, 20 );
	
    scene.add(light5);
}

function initializeBall()
{
    var sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x032149,
    });

    //Create a ball with SphereGeometry method
    ball = new THREE.Mesh( new THREE.SphereGeometry(radius,
        segments,rings),sphereMaterial);

    //add the sphere to the scene
    scene.add(ball);

    ball.position.z = radius;
    ball.castShadow = true;
}

function initializeTable()
{
    var plane_texture = THREE.ImageUtils.loadTexture( "images/plane_texture.jpg" );
    var planeMaterial = new THREE.MeshPhongMaterial(
    {
        map: plane_texture
    });


    // create the playing surface plane
    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            planeWidth * 0.95,	//we want to show where the ball goes out-of-bounds
            planeHeight,
            planeQuality,
            planeQuality),
        planeMaterial);

    scene.add(plane);
    plane.receiveShadow = true;

    var wood_texture = THREE.ImageUtils.loadTexture( "images/wood_texture.jpg" );
    var table_material = new THREE.MeshPhongMaterial({
        map: wood_texture,
        metal: true
    });
    var table = new THREE.Mesh(new THREE.BoxGeometry(
            planeWidth*1.05, planeHeight*1.1, 10),
        table_material);
    table.position.z = -6;
    scene.add(table);
    table.receiveShadow = true;
}

function initializePaddle()
{
    var player_texture = THREE.ImageUtils.loadTexture( "images/player_texture.jpg" );
    //create the first paddle
    paddle1_Material = new THREE.MeshPhongMaterial({
        map: player_texture,
        metal: true
    });

    paddle1 = new THREE.Mesh(new THREE.BoxGeometry(
            paddleWidth, paddleHeight, paddleDepth),
        paddle1_Material);

    //add paddle1 to the scene
    scene.add(paddle1);

    //set position of paddle1
    paddle1.position.x = -planeWidth/2 + paddleWidth/2;
    paddle1.position.z = paddleDepth/2;
    paddle1.scale.y = 0.01;

    var opponent_texture = THREE.ImageUtils.loadTexture( "images/opponent_texture.jpg" );
    //create the second paddle
    paddle2_Material = new THREE.MeshPhongMaterial({
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
    paddle2.position.z = paddleDepth/2;
}

function createScene()
{

    var canvas = document.getElementById("gameCanvas");

    renderer = new THREE.WebGLRenderer();

    scene = new THREE.Scene();

    renderer.setSize(width, height);

    canvas.appendChild(renderer.domElement);

    initializeBall();
    createLights();
    initializeTable();
    initializePaddle();

    renderer.shadowMapEnabled = true;
}

function playerPaddleBehaviour()
{
    // move left
    if (Key.isDown(Key.A))
    {
        // if paddle is not touching the side of table we move
        if (paddle1.position.y < planeHeight * 0.4)
        {
            paddle1DirY = paddleSpeed;
        }
        // else we don't move 
        else
        {
            paddle1DirY = 0;
        }
    }
    // move right
    else if (Key.isDown(Key.D))
    {
        // if paddle is not touching the side of table we move
        if (paddle1.position.y > -planeHeight * 0.4)
        {
            paddle1DirY = -paddleSpeed;
        }
        // else we don't move
        else
        {
            paddle1DirY = 0;
        }
    }

    // else don't move paddle (if no press the button)
    else
    {
        paddle1DirY = 0;
    }

    if (Key.isDown(Key.S))
    {
        if (paddle1.position.x < -planeWidth * 0.43) {
            paddle1.position.x += 3;
        }
    }
    else if (Key.isUp(Key.S))
    {
        if (paddle1.position.x > -planeWidth/2 + paddleWidth/2) {
            paddle1.position.x -= 5;
        }
    }

    if (Key.isDown(Key.SPACE))
    {
        if(score_P1 == 0 && score_P2 == 0){

            start_play = true;
            document.getElementById("level").disabled = true;
        }
        playing = true;
    }

    //when the game starts the paddle will be resized to 1
    paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;

    paddle1.position.y += paddle1DirY;
}

function opponentPaddleMovement(){

    //The axis of the paddle's movement is y (due the camera position)
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

function ballBehaviour(){
    // if ball goes off the 'left' side (Player's side)
    if (ball.position.x <= -planeWidth/2)
    {
        //add 1 point to the opponent
        score_P2++;
        // update scoreboard HTML
        var cpuPoints = document.getElementById("cpu-points");
        cpuPoints.innerHTML = score_P2;
        cpuPoints.className = "scores animated bounce";
        setTimeout(function() {
            cpuPoints.className = "scores";
        }, 1000);
        // reset ball position
        resetBall(2);

        checkScore();
    }

    // if ball goes off the 'right' side (CPU's side)
    if (ball.position.x >= planeWidth/2)
    {
        // Player scores
        score_P1++;
        // update scoreboard HTML
        var playerPints = document.getElementById("player-points");
        playerPints.innerHTML = score_P1;
        playerPints.className = "scores animated bounce";
        setTimeout(function() {
            playerPints.className = "scores";
        }, 1000);
        // reset ball position
        resetBall(1);

        checkScore();
    }

    // if ball goes off the top side (side of table)
    if (ball.position.y <= -planeHeight/2)
    {
        ballDirY = -ballDirY;
        document.getElementById('plop').play();

    }
    // if ball goes off the bottom side (side of table)
    if (ball.position.y >= planeHeight/2)
    {
        ballDirY = -ballDirY;
        document.getElementById('plop').play();
    }
}

function moveBall()
{
    if (playing == true) {
        //Update ball position over time
        ball.position.x += ballDirX * ballSpeed;
        ball.position.y += ballDirY * ballSpeed;

        // limit ball's y-speed to 2x the x-speed
        // in this manner the ball doesn't speed from left to right super fast
        // we keep game playable for humans
        if (ballDirY > ballSpeed * 2)
        {
            ballDirY = ballSpeed * 2;
        }
        else if (ballDirY < -ballSpeed * 2)
        {
            ballDirY = -ballSpeed * 2;
        }
    }
}

function resetBall(loser){
    playing = false;

    if (loser == 1)
    {
        ball.position.x = (planeWidth/2)*0.8;
        ball.position.y = 0;
        ballDirX = -1;
    }

    else
    {
        ball.position.x = -(planeWidth/2)*0.8;
        ball.position.y = 0;
        ballDirX = 1;
    }

    // we reset this, otherwise the ball starts with the speed
	//that it had before exiting from the plain
    ballDirY = 1;

}

function checkScore(){
    document.getElementById('peep').play();
    if (score_P1 === scoreToWin || score_P2 === scoreToWin) {
        var scoreContainer = document.getElementById('score-container'),
            resultContainer = document.getElementById('scores');

        scoreContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        resultContainer.className = "animated tada";
    }

    if(score_P1 === scoreToWin){
        ballSpeed = 0;

        document.getElementById("scores").innerHTML = "Player wins!";
        document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
        ball.position.x = 0;
        ball.position.y = 0;

    }

    else if(score_P2 === scoreToWin){
        ballSpeed = 0;

        document.getElementById("scores").innerHTML = "CPU wins!";
        document.getElementById("winnerBoard").innerHTML = "Refresh to play again";

        ball.position.x = 0;
        ball.position.y = 0;
    }
}

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
            // and if ball is travelling towards player (the player position is negative)
            if (ballDirX < 0)
            {
                // put some code to indicate a hit
                document.getElementById('beep').play();
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
            // and if ball is travelling towards opponent (positive direction)
            if (ballDirX > 0)
            {
                // put some code to indicate a hit
                document.getElementById('beep').play();
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

function setDifficulty(level){
    level = parseInt(level);

    var adjustment = 0.3;
    set_diff = level * adjustment;

    ballSpeed = startingBallSpeed + level * (1 - adjustment);
    paddleSpeed = startingPaddleSpeed + level * (1 - adjustment);
}