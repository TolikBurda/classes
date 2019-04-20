let start = document.getElementById('start');
let stop = document.getElementById('end');
let twoPlayers = document.getElementById('two')
//start.addEventListener('click', game.startGame);
// stop.addEventListener('click', stopGame);
// twoPlayers.addEventListener('click', function(e){
// });

const fieldWidth = 20;
const fieldHeight = 20;
const cellSize = 10;
// const number1 = 1;
// const number2 = 2;

// var directionMap = {
//     up : { x: 0, y: -1},
//     down: {x: 0, y: 1},
//     right: {x: 1, y: 0},
//     left: { x: -1, y: 0}
// }

// var superInputMap = {
//     38 : directionMap.up,
//     40 : directionMap.down,
//     39 : directionMap.right,
//     37 : directionMap.left
// }

// var eventCode = 37

// var directionChange = superInputMap[eventCode]

// if (directionChange) {
//     console.log(directionChange);
    
// } else {
//     console.log('button not connected');

// }



class Snake {
    constructor(w, h, inputMap){
        this.segments = [];
        this.currentDirecion = { x: 0, y: 0};
        this.fieldWidth = w;
        this.fieldHeight = h;
        this.createSnake();
        this.superInputMap = inputMap;
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
        var directionMap = {
            up : { x: 0, y: -1},
            down: { x: 0, y: 1},
            right: { x: 1, y: 0},
            left: { x: -1, y: 0}
        }
        
        // var superInputMap = {
        //     38 : 'up',
        //     40 : 'down',
        //     39 : 'right',
        //     37 : 'left'
        // }
        
        var eventCode = e.keyCode
        console.log(superInputMap[eventCode]);
        
        var directionChange = this.superInputMap[eventCode]

        if(!directionChange){
            return null
        }
        if(directionChange in directionMap){
            if (directionChange.x * this.currentDirecion.x != -1 && directionChange.y * this.currentDirecion.y != -1) {
                this.currentDirecion = directionChange;
                //console.log(directionChange);
            }  
        }

    }
}

class Game {
    constructor(w, h, d){
        this.fieldWidth = w;
        this.fieldHeight = h;
        this.intervalId = null;
        this.arrOfSnakes = [];
        this.apple = { x: 0, y: 0 };
        this.draw = d;
        // this.snake = s;
        // this.snake1 = s1;
        //this.spawnApple();
        //this.createSnakes();
        this.superInputMap = [
            {
                38 : 'up',
                40 : 'down',
                39 : 'right',
                37 : 'left'
            },
            {
                87 : 'up',
                83 : 'down',
                68 : 'right',
                65 : 'left'
            }
        ]
    }
    
    spawnApple(){ 
        this.apple.x = Math.round(Math.random() * this.fieldWidth);
        this.apple.y = Math.round(Math.random() * this.fieldHeight); 
        //console.log(this.apple);
        
    }
    createSnakes(){
        const snake = new Snake(this.fieldWidth, this.fieldHeight, this.superInputMap[0]);
        console.log(snake);
        const snake1 = new Snake(this.fieldWidth, this.fieldHeight, this.superInputMap[1]);
        console.log(snake1);
        
        this.arrOfSnakes.push(snake)
        this.arrOfSnakes.push(snake1)
        console.log(this.arrOfSnakes);
    }

    snakesControl(){

        document.addEventListener('keydown', function(e){
            for(let i = 0; i < this.arrOfSnakes.length; i++){
                this.arrOfSnakes[i].changeDirectionOfSnake(e)
            }
        })
    }

    stopGame(){
        clearInterval(this.intervalId);
    }

    startGame(){
        this.stopGame();
        this.createSnakes();
        //this.arrOfSnakes;
        this.intervalId = setInterval(()=> {
            this.mainLoop()
        }, 600);   //// var 
        this.spawnApple();
    }

    gameControl(){
        start.addEventListener('click', ()=>{                        ///()=>
            this.startGame();
        } );
    }

    mainLoop(){
        for(let i = 0; i < this.arrOfSnakes.length; i++){
            if(this.arrOfSnakes[i].checkAppleCollision(this.apple)){
                this.arrOfSnakes[i].growSnake();
                this.spawnApple()
            }else{
                this.arrOfSnakes[i].moveSnake();
            }
            if(this.arrOfSnakes[i].checkTailCollision()){
                this.stopGame();
            }else if(this.arrOfSnakes[i].checkBordersCollision()){
                this.stopGame();
            }
            this.draw.drawField(this);
        }
    }
}

class Drawing {
    constructor(w, h, c){
        this.canvas = document.getElementById('canvas');///создавать, а не получать 
        this.ctx = canvas.getContext('2d');
        this.fieldWidth = w;
        this.fieldHeight = h;
        this.cellSize = c;
        //this.game = g;
        this.canvas.width = (this.fieldWidth + 1)*this.cellSize;
        this.canvas.height = (this.fieldHeight + 1)*this.cellSize; 
        
    }

    drawField(game){   
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.ctx.strokeStyle = 'black';
        for(let j = 0; j < game.arrOfSnakes.length; j++){
            let snake = game.arrOfSnakes[j]
            for(let i = 0; i < snake.segments.length; i++){
                this.ctx.strokeRect(snake.segments[i].x*this.cellSize, snake.segments[i].y*this.cellSize, this.cellSize, this.cellSize);
            }
        }
        
        
        this.ctx.strokeStyle = 'magenta';
        this.ctx.strokeRect(game.apple.x*this.cellSize, game.apple.y*this.cellSize, this.cellSize, this.cellSize);
    
        this.ctx.strokeStyle = 'blue';
        this.ctx.strokeRect(0, 0, (this.fieldWidth + 1)*this.cellSize, (this.fieldHeight + 1)*this.cellSize);
    }
}


const draw = new Drawing(fieldWidth, fieldHeight, cellSize)
const game = new Game(fieldWidth, fieldHeight, draw)

start.addEventListener('click', function(){                        ///()=>
    game.startGame();
} );
stop.addEventListener('click', function(){
    game.stopGame();
} );

// document.addEventListener('keydown', function(e){
//     for(let i = 0; i < game.arrOfSnakes.length; i++){
//         game.arrOfSnakes[i].changeDirectionOfSnake(e)
//     }
// })

// var event = new Event("keydown");

// document.dispatchEvent(event)




// function test2(){
//     console.log('hello again');
// }

// class Test {
//     constructor () {
//         console.log('hello');
//     }
// }

// var t = new Test()
// test2()

