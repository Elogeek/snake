//create area game
//let gameTry = document.querySelector('#game-area');
let canvas = document.getElementById("snakeCanvas");
let context = canvas.getContext("2d");

let score = document.querySelector(".score");

let startBtn = document.getElementById("startBtn");
//foods
let fruit = document.getElementById("fruit");
let virus = document.getElementById("virus");

let snakeHeadX, snakeHeadY, fruitX, fruitY, virusX, virusY, tail, totalTail, directionVar, direction, previousDir;
let speed=1, xSpeed, ySpeed;
const scale = 20;
let rows = canvas.height / scale;
let min = scale / 10; //for min coordinate of fruit
let max = rows - min; //for max
let gameInterval,  //interval after which screen will be updated
    virusInterval, //interval after which virus position will be updated
    intervalDuration = 150, //starting screen updation interval
    minDuration = 75; //minimum screen updation interval
let playing, gameStarted;
let boundaryCollision;
let tail0;

startBtn.addEventListener("click", startGame);

//reset the variables to starting value
function reset() {
    clearInterval(gameInterval);
    clearInterval(virusInterval);
    intervalDuration=150;
        minDuration=75;
    tail = [];
    totalTail = 0;
    directionVar = "Right";
    direction = "Right";
    previousDir = "Right";
    xSpeed = scale * speed;
    ySpeed = 0;
    snakeHeadX = 0;
    snakeHeadY = 0;
    playing = false; gameStarted = false;
    boundaryCollision=false;
}

function startGame() {
    reset();
    gameStarted = true;
    playing = true;
    fruitPosition();
    virusPosition();
    main();
}

//EventListener to check which arrow key is pressed
window.addEventListener("keydown", pressedKey);

function pressedKey() {
    if(event.keyCode===32 && gameStarted) {

    }
    else {
        previousDir = direction;
        directionVar = event.key.replace("Arrow", "");
        changeDirection();
    }
}

//change the direction of snake based on arrow key pressed
function changeDirection() {
    switch (directionVar) {
        case "Up":
            //move "up" only when previous direction is not "down"
            if (previousDir !== "Down") {
                direction = directionVar;
                xSpeed = 0;
                ySpeed = scale * -speed;
            }
            break;

        case "Down":
            //move "down" only when previous direction is not "up"
            if (previousDir !== "Up") {
                direction = directionVar;
                xSpeed = 0;
                ySpeed = scale * speed;
            }
            break;

        case "Left":
            //move "left" only when previous direction is not "right"
            if (previousDir !== "Right") {
                direction = directionVar;
                xSpeed = scale * -speed;
                ySpeed = 0;
            }
            break;

        case "Right":
            //move "right" only when previous direction is not "left"
            if (previousDir !== "Left") {
                direction = directionVar;
                xSpeed = scale * speed;
                ySpeed = 0;
            }
            break;
    }
}

//random coordinates for fruit or virus
function generateCoordinates() {
    let xCoordinate = (Math.floor(Math.random() * (max - min) + min)) * scale;
    let yCoordinate = (Math.floor(Math.random() * (max - min) + min)) * scale;
    return {xCoordinate, yCoordinate};
}

//check snake's collision
function checkCollision() {
    let tailCollision=false, virusCollision=false;
    boundaryCollision=false;
    //with its own tail
    for (let i = 0; i < tail.length; i++) {
        if (snakeHeadX === tail[i].tailX && snakeHeadY === tail[i].tailY) {
            tailCollision=true;
        }
    }
    //with boundaries
    if(snakeHeadX >= canvas.width || snakeHeadX < 0 || snakeHeadY >= canvas.height || snakeHeadY < 0)
    {
        boundaryCollision=true;
    }
    //with virus
    if(snakeHeadX === virusX && snakeHeadY === virusY) {
        virusCollision=true;
    }
    return (tailCollision || boundaryCollision || virusCollision);
}

//Snake
//draw Snake Head (), drawSnakeBody() ==> the snake is drawn using the x and y coordinates of each part of its body, where x and y represent the upper left corner of that part.
//the context.arc method is used here to draw a circle for the head part and eyes
//the “scale” variable stores the number of pixels that each part of the snake's body takes up
function drawSnakeHead(color) {
    context.beginPath();
    context.arc(snakeHeadX+scale/2, snakeHeadY+scale/2, scale/2, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    //eyes
    context.beginPath();
    if(direction === "Up") {
        context.arc(snakeHeadX+(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
        context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
    }
    else if(direction === "Down") {
        context.arc(snakeHeadX+(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
        context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
    }
    else if(direction === "Left") {
        context.arc(snakeHeadX+(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
        context.arc(snakeHeadX+(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
    }
    else {
        context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
        context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
    }
    context.fillStyle = "black";
    context.fill();
}
//draw the snake tail
function drawSnakeTail() {
    let tailRadius = scale/4;
    for (let i = 0; i < tail.length; i++) {
        tailRadius = tailRadius+((scale/2-scale/4)/tail.length);
        context.beginPath();
        context.fillStyle = "#6c2c3a";
        context.arc((tail[i].tailX+scale/2), (tail[i].tailY+scale/2), tailRadius, 0, 2 * Math.PI);
        context.fill();
    }
}

//moveSnakeForward () function shifts the coordinates of the snakehead to the next position.
// the variables xSpeed and ySpeed represent movement, if the snake is moving horizontally,
// xSpeed will be equal to 'scale' (positive for the right and negative for the left direction) and ySpeed
// will be equal to zero and vice versa. So, the new snake head value is assigned using these variables.

//shift snake's previous positions to next position
function moveSnakeForward() {
    tail0 = tail[0];
    for (let i = 0; i < tail.length - 1; i++) {
        tail[i] = tail[i + 1];
    }
    tail[totalTail - 1] = { tailX: snakeHeadX, tailY: snakeHeadY };
    snakeHeadX += xSpeed;
    snakeHeadY += ySpeed;
}

//only in case of boundary collision
function moveSnakeBack()
{
    context.clearRect(0, 0, 500, 500);
    for (let i = tail.length-1; i >= 1; i--) {
        tail[i] = tail[i - 1];
    }
    if(tail.length >= 1) {
        tail[0] = { tailX: tail0.tailX, tailY: tail0.tailY };
    }
    snakeHeadX -= xSpeed;
    snakeHeadY -= ySpeed;
    drawVirus();
    drawFruit();
    drawSnakeTail();
}

//display snake
function drawSnake() {
    drawSnakeHead("#7d4350");
    drawSnakeTail();
    if (checkCollision()) {
        clearInterval(gameInterval);
        clearInterval(virusInterval);
        if(boundaryCollision) {
            moveSnakeBack();
        }
        drawSnakeHead("red");
        setTimeout(()=> {
            let scoreModal = document.getElementById("score");
            scoreModal += alert('Vous avez perdu ! Votre score est de : ' + totalTail);
        }, 1000);
    }
}


//VIRUS//
function virusPosition() {
    let virus = generateCoordinates();
    virusX = virus.xCoordinate;
    virusY = virus.yCoordinate;
}

function drawVirus() {
    context.drawImage(virus, virusX, virusY, scale, scale);
}

//FRUIT//
//generate random fruit position with in canvas
function fruitPosition() {
    let fruit = generateCoordinates();
    fruitX = fruit.xCoordinate;
    fruitY = fruit.yCoordinate;
}

//draw image of fruit
function drawFruit() {
    context.drawImage(fruit, fruitX, fruitY, scale, scale);
}

//MAIN GAME//
function checkSamePosition() {
    if(fruitX === virusX && fruitY === virusY) {
        virusPosition();
    }
    for(let i=0; i < tail.length; i++){
        if(virusX === tail[i].tailX && virusY === tail[i].tailY)
        {
            virusPosition();
            break;
        }
    }
    for(let i = 0; i < tail.length; i++){
        if(fruitX === tail[i].tailX && fruitY === tail[i].tailY)
        {
            fruitPosition();
            break;
        }
    }
}

function main() {
    //update state at specified interval
    virusInterval = window.setInterval(virusPosition, 10000);
    gameInterval = window.setInterval(() => {
        context.clearRect(0, 0, 500, 500);
        checkSamePosition();
        drawVirus();
        drawFruit();
        moveSnakeForward();
        drawSnake();

        //check if snake eats the fruit - increase size of its tail, update score and find new fruit position
        if (snakeHeadX === fruitX && snakeHeadY === fruitY) {
            totalTail++;
            //increase the speed of game after every 20 points
            if(totalTail%20 === 0 && intervalDuration>minDuration) {
                clearInterval(gameInterval);
                window.clearInterval(virusInterval);
                intervalDuration=intervalDuration-10;
                main();
            }
            fruitPosition();
        }
        score.innerText = totalTail;

    }, intervalDuration);
}







