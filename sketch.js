var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var bgImg;

var collidedSound,jumpSound;

var lives=3;


function preload(){
  trex_running =   loadAnimation("trex100.png","trex300.png","trex400.png");
  trex_collided = loadAnimation("trex_collided 100.png");
  
  cloudImage = loadImage("cloud 100.png");

  obstacle1 = loadImage("ob 100.png");
  obstacle2 = loadImage("obstacle200.png");
  obstacle3 = loadImage("obstacle300.png");
  obstacle4 = loadImage("obstacle400.png");
  obstacle5 = loadImage("obstacle500.png");
  obstacle6 = loadImage("obstacle600.png");
  
  gameOverImg = loadImage("game-over-3.png");
  restartImg = loadImage("restart2.png");
  
  bgImg=loadImage("night background.jpg");
  
  collidedSound=loadSound("salamisound-3019782-slight-impact-with-sheet.mp3");
  jumpSound=loadSound("salamisound-8739576-sfx-jump-1-game-computer.mp3");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  trex = createSprite(50,330,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  gameOver = createSprite(width/2,height/2-100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.2;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-0,width,100);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  camera.x=trex.x;
  gameOver.position.x=restart.position.x=camera.x;

  background(bgImg);

  strokeWeight(4);
  stroke("yellow");
  textSize(20);
 
  text("Score:"+ score, 500,200);
  text("Lives : " + lives ,displayWidth/2-200,displayHeight/2);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    
    if(keyDown("space")&& trex.y >= height-80) {
      trex.velocityY = -12;  
      jumpSound.play();
}
  
    trex.velocityY = trex.velocityY + 0.8;
   
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        collidedSound.play();
        lives=lives-1;
}

if(lives===0){
  background("red");
  trex.destroy();
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  text("GAME OVER",displayWidth/2-500,displayHeight/2); 
}
}else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)||keyDown("SPACE")){
      reset();
      touches=[]
}
}
  drawSprites(); 
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x+displayWidth/2,200);
    cloud.y = Math.round(random(150,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -3;

    cloud.lifetime = 133;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
}
  }

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+displayWidth/2,height-69,20,30);
    
    obstacle.velocityX = -(6 + 3*score/100);

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
}
      
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
}
}

 function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  score=0;
}