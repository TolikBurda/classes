let start = document.getElementById('start');
let stop = document.getElementById('end');
let twoPlayers = document.getElementById('two')
start.addEventListener('click', startGame);
stop.addEventListener('click', stopGame);
// twoPlayers.addEventListener('click', function(e){

// });
const fieldWidth = 20;
const fieldHeight = 20;
const cellSize = 10;


class Game {
    constructor(arr, w, h){
        this.fieldWidth = w;
        this.fieldHeight = h;
        this.intervalId = null;
        this.arrOfSnakes = arr;
        this.apple = { x: 0, y: 0 }
        // this.snake = s;
        // this.snake1 = s1
    }
    spawnApple(){ 
        this.apple.x = Math.round(Math.random() * this.fieldWidth);
        this.apple.y = Math.round(Math.random() * this.fieldHeight); 
    }
    // createSnakes(){
    //     this.arrOfSnakes.push(snake)
    //     this.arrOfSnakes.push(snake1)
    //     console.log(this.arrOfSnakes);
    // }
    startGame(){
        createSnakes();
        this.intervalId = setInterval(mainLoop, 600);
        spawnApple();
    }
    mainLoop(){

    }
    stopGame(){

    }

}

const snake = new Snake(fieldWidth, fieldHeight, number1);
const snake1 = new Snake(fieldWidth, fieldHeight, number2);

const game = new Game([snake, snake1], fieldWidth, fieldHeight)


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
            return true; 
        }
        return false
    }

    changeDirectionOfSnake(e){
        if(this.playerNumber == 1){
            
            if(e.keyCode == 38 && this.currentDirecion.y != 1){
                this.currentDirecion.x = 0;
                this.currentDirecion.y = -1;
            }
        
            if(e.keyCode == 40 && this.currentDirecion.y != -1){
                this.currentDirecion.x = 0;
                this.currentDirecion.y = 1;
            }
        
            if(e.keyCode == 39 && this.currentDirecion.x != -1){
                this.currentDirecion.x = 1;
                this.currentDirecion.y = 0;
            }
        
            if(e.keyCode == 37 && this.currentDirecion.x != 1){
                this.currentDirecion.x = -1;
                this.currentDirecion.y = 0;    
            }
        
        }else if(this.playerNumber == 2){
            
            if(e.keyCode == 87 && this.currentDirecion.y != 1){
                this.currentDirecion.x = 0;
                this.currentDirecion.y = -1; 
            }
        
            if(e.keyCode == 83 && this.currentDirecion.y != -1){
                this.currentDirecion.x = 0;
                this.currentDirecion.y = 1;
            }
        
            if(e.keyCode == 68 && this.currentDirecion.x != -1){
                this.currentDirecion.x = 1;
                this.currentDirecion.y = 0;
            }
        
            if(e.keyCode == 65 && this.currentDirecion.x != 1){
                this.currentDirecion.x = -1;
                this.currentDirecion.y = 0;
            }
        }
        
    }
}
const snake = new Snake(fieldWidth, fieldHeight, number1);
const snake1 = new Snake(fieldWidth, fieldHeight, number2);

class Drawing {
    constructor(w, h, c, g){
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.fieldWidth = w;
        this.fieldHeight = h;
        this.cellSize = c;
        this.game = g;
        this.canvas.width = (this.fieldWidth + 1)*this.cellSize;
        this.canvas.height = (this.fieldHeight + 1)*this.cellSize; 
    }

    

    drawField(){   
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        ctx.strokeStyle = 'black';
        for(let j = 0; j < this.game.arrOfSnakes.length; j++){
            let snake = this.game.arrOfSnakes[j]
            for(let i = 0; i < snake.segments.length; i++){
                ctx.strokeRect(snake.segments[i].x*this.cellSize, snake.segments[i].y*this.cellSize, this.cellSize, this.cellSize);
            }
        }
        
        ctx.strokeStyle = 'magenta';
        ctx.strokeRect(this.game.apple.x*this.cellSize, this.game.apple.y*this.cellSize, this.cellSize, this.cellSize);
    
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(0, 0, (this.fieldWidth + 1)*this.cellSize, (this.fieldHeight + 1)*this.cellSize);
    }
}
const draw = new Drawing(fieldWidth, fieldHeight, cellSize, game)





document.addEventListener('keydown', function(e){
    for(let i = 0; i < arrOfSnakes.length; i++){
        arrOfSnakes[i].changeDirectionOfSnake(e)
    }
})