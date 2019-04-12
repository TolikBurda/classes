var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');


var start = document.getElementById('start');
var stop = document.getElementById('end');
var twoPlayers = document.getElementById('two')
start.addEventListener('click', startGame);
stop.addEventListener('click', stopGame);
// twoPlayers.addEventListener('click', function(e){

// });
var fieldWidth = 20;
var fieldHeight = 20;
var cellSize = 10;
canvas.width = (fieldWidth + 1)*cellSize;
canvas.height = (fieldHeight + 1)*cellSize;

var apple = { x: 0, y: 0 }

function spawnApple(){
    apple.x = Math.round(Math.random() * fieldWidth);
    apple.y = Math.round(Math.random() * fieldHeight); 
}


class Snake {
    constructor(w, h, n){
        this.segments = [];
        this.currentDirecion = { x: 0, y: 0};
        this.fieldWidth = w;
        this.fieldHeight = h;
        this.createSnake();
        this.playerNumber = n
    }
    createSnake(){
        const head = {
            x: Math.round(Math.random() *  this.fieldWidth),
            y: Math.round(Math.random() * this.fieldHeight)
        }
        this.segments.push(head);
    }

    growSnake(){
        const newPiece = {
            x: this.segments[0].x + this.currentDirecion.x,
            y: this.segments[0].y + this.currentDirecion.y
        }

        this.segments.unshift(newPiece);
    }

    moveSnake(){
        const head = this.segments[0];

        let tmp = this.segments.pop();
        tmp.x = head.x + this.currentDirecion.x;
        tmp.y = head.y + this.currentDirecion.y;
        this.segments.unshift(tmp);
    }

    checkAppleCollision(apple){
        if(this.segments[0].x + this.currentDirecion.x == apple.x && this.segments[0].y + this.currentDirecion.y == apple.y){
            return true
        }
        return false
    }

    checkTailCollision(){
        for(let i = 1; i < this.segments.length; i++){
            if(this.segments[0].x == this.segments[i].x && this.segments[0].y == this.segments[i].y){
                return true; //stopGame()
            }
        }
        return false
    }

    checkBordersCollision(){
        if(this.segments[0].x > this.fieldWidth || this.segments[0].y > this.fieldHeight || this.segments[0].x < 0 || this.segments[0].y < 0){
            // ctx.fillStyle = 'white';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            // ctx.fillStyle = 'black';
            // ctx.font = 'bold 40px Georgia';
            // ctx.fillText("game over", 50, 50);
            return true; // clearInterval(intervalId);
        }
        return false
    }

    changeDirectionOfSnake(e){
        let newDirection = {x: 0, y: 0}
        if(this.playerNumber == 1){
            
            if(e.keyCode == 38){
                newDirection.x = 0;
                newDirection.y = -1; 
                this.currentDirecion = newDirection;
            }
        
            if(e.keyCode == 40){
                newDirection.x = 0;
                newDirection.y = 1;
                this.currentDirecion = newDirection;
            }
        
            if(e.keyCode == 39){
                newDirection.x = 1;
                newDirection.y = 0;
                this.currentDirecion = newDirection;
            }
        
            if(e.keyCode == 37){
                newDirection.x = -1;
                newDirection.y = 0;
                this.currentDirecion = newDirection;
                
            }
            if(newDirection.x * this.currentDirecion.x || newDirection.y * this.currentDirecion.y == -1){
                return
            }
           
        
        }else if(this.playerNumber == 2){
            
            if(e.keyCode == 87){
                newDirection.x = 0;
                newDirection.y = -1; 
                this.currentDirecion = newDirection;
            }
        
            if(e.keyCode == 83){
                newDirection.x = 0;
                newDirection.y = 1;
                this.currentDirecion = newDirection;
            }
        
            if(e.keyCode == 68){
                newDirection.x = 1;
                newDirection.y = 0;
                this.currentDirecion = newDirection;
            }
        
            if(e.keyCode == 65){
                newDirection.x = -1;
                newDirection.y = 0;
                this.currentDirecion = newDirection;
            }
            if(newDirection.x * this.currentDirecion.x || newDirection.y * this.currentDirecion.y == -1){
                return
            }
            
        }
        
    }

}
//бла-бла-бла
document.addEventListener('keydown', function(e){
    for(let i = 0; i < arrOfSnakes.length; i++){
        arrOfSnakes[i].changeDirectionOfSnake(e)
    }
})

function drawField(){
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    for(let j = 0; j < arrOfSnakes.length; j++){
        let snake = arrOfSnakes[j]
        for(let i = 0; i < snake.segments.length; i++){
            ctx.strokeRect(snake.segments[i].x*cellSize, snake.segments[i].y*cellSize, cellSize, cellSize);
        }
    }
    
    ctx.strokeStyle = 'magenta';
    ctx.strokeRect(apple.x*cellSize, apple.y*cellSize, cellSize, cellSize);

    ctx.strokeStyle = 'blue';
    ctx.strokeRect(0, 0, (fieldWidth + 1)*cellSize, (fieldHeight + 1)*cellSize);
}

let number1 = 1;
let number2 = 2;
let arrOfSnakes = [];

function createSnakes(){
    arrOfSnakes = [];
    const snake = new Snake(fieldWidth, fieldHeight, number1);
    const snake1 = new Snake(fieldWidth, fieldHeight, number2);
    arrOfSnakes.push(snake)
    arrOfSnakes.push(snake1)
    console.log(arrOfSnakes);
    
}

let intervalId = null;

function startGame(){
    stopGame();
    createSnakes()
    intervalId = setInterval(mainLoop, 300);
    spawnApple();
    drawField();
}

function mainLoop(){
    for(let i = 0; i < arrOfSnakes.length; i++){
        if(arrOfSnakes[i].checkAppleCollision(apple)){
            arrOfSnakes[i].growSnake();
            spawnApple()
        }else{
            arrOfSnakes[i].moveSnake();
        }
        if(arrOfSnakes[i].checkTailCollision()){
            stopGame();
        }else if(arrOfSnakes[i].checkBordersCollision()){
            stopGame();
        }
        drawField();
    }
}

function stopGame(){
    clearInterval(intervalId);
}