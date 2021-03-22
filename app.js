//create area game
let gameTry = document.querySelector('#game-area');

let game = document.createElement("canvas");
    game.style.border = "3px solid black";
    game.style.width = "500px";
    game.style.height = "400px";
    gameTry.appendChild(game);


//create snake
let snake_array;
function create_snake() {
    let length = 3; //Length of the snake
    snake_array = []; //Empty array to start with
    for(let i = length-1; i >= 0; i--)
    {
        //This will create a horizontal snake starting from the top left
        snake_array.push({x: i, y:0});
    }
}

//place random food in the game (16x20=>320)
function create_food() {
    let food = document.getElementById("apple");
    let y = Math.round(Math.random()*(320));
    function getRandomFood(food) {
        return Math.floor(Math.random() * Math.floor(y));
    }

    //console.log(getRandomFood());
    return food;
}

    function initGame() {
        create_snake();
        create_food();
        // display the score
       let  score = 0;
       let  level = 1;

}
    initGame();


 // replay game
function replay() {
    window.reload();
}

replay;





