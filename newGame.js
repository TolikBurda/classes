class Snake {
    constructor(w, h, inputMap){
        this.segments = [];
        this.currentDirecion = { x: 0, y: 0};
        this.fieldWidth = w;
        this.fieldHeight = h;
        this.createSnake();
        this.superInputMap = inputMap;
        this.score = 0;
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

    checkTailCollision(segments){
        for(let i = 1; i < segments.length; i++){
            if(this.segments[0].x == segments[i].x && this.segments[0].y == segments[i].y){
                return i;
            }
        }
        return 0
    }

    checkBordersCollision(){
        if(this.segments[0].x > this.fieldWidth || this.segments[0].y > this.fieldHeight || this.segments[0].x < 0 || this.segments[0].y < 0){
            return true; 
        }
        return false
    }

    changeDirectionOfSnake(keyCode){
        var directionMap = {
            up : { x: 0, y: -1},
            down: { x: 0, y: 1},
            right: { x: 1, y: 0},
            left: { x: -1, y: 0}
        }   
        let directionChange = directionMap[this.superInputMap[keyCode]]

        if(!directionChange){
            return null
        }

        if (directionChange.x * this.currentDirecion.x == -1 || directionChange.y * this.currentDirecion.y == -1) {
            return
        }  
        this.currentDirecion = directionChange;
    }
}

class Game {
    constructor(d){
        this.draw = new Drawing();
        this.gameControl();
        this.intervalId = null;
        this.arrOfSnakes = [];
        this.apple = { x: 0, y: 0 };
        this.timer = 200;
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
        this.apple.x = Math.round(Math.random() * this.draw.fieldWidth);
        this.apple.y = Math.round(Math.random() * this.draw.fieldHeight);     
    }

    createSnakes(){
        const snake = new Snake(this.draw.fieldWidth, this.draw.fieldHeight, this.superInputMap[0]);
        const snake1 = new Snake(this.draw.fieldWidth, this.draw.fieldHeight, this.superInputMap[1]);
        this.arrOfSnakes.push(snake)
        this.arrOfSnakes.push(snake1)
    }

    cutTail(){
        for(let i = 0; i < this.arrOfSnakes.length; i++){
            let snake1 = this.arrOfSnakes[i]
            for(let k = 0; k < this.arrOfSnakes.length; k++){
                let snake2 = this.arrOfSnakes[k];
                let segmentNumber = snake1.checkTailCollision(snake2.segments)
                console.log('f',segmentNumber);
                if(segmentNumber != 0){
                    let tail = snake2.segments.splice(segmentNumber, snake2.segments.length)
                    if(i == k){
                        snake1.score -= tail.length;
                    }else{
                        snake1.score += tail.length;
                    }
                }

            }

        }   
    }

    snakesControl(){
        document.addEventListener('keydown', (e)=> {
            for(let i = 0; i < this.arrOfSnakes.length; i++){
                this.arrOfSnakes[i].changeDirectionOfSnake(e.keyCode)
            }
        })
    }

    stopGame(){
        clearInterval(this.intervalId);
        this.arrOfSnakes = [];
    }

    startGame(){
        this.stopGame();
        this.createSnakes();
        this.snakesControl();
        this.intervalId = setInterval(()=> {
            this.mainLoop()
        }, this.timer);
        this.spawnApple();
    }

    gameControl(){
        this.draw.startButton.addEventListener('click', ()=>{                        ///()=>
            this.startGame();  
        } );

        this.draw.stopButton.addEventListener('click', ()=>{
            this.stopGame();
        } );
    }

    mainLoop(){
        this.cutTail();
        this.draw.scoreField.value = '';
        for(let i = 0; i < this.arrOfSnakes.length; i++){
            if(this.arrOfSnakes[i].checkAppleCollision(this.apple)){
                this.arrOfSnakes[i].growSnake();
                this.spawnApple();
            }else{
                this.arrOfSnakes[i].moveSnake();
            }
            if(this.arrOfSnakes[i].checkTailCollision(this.arrOfSnakes[i].segments) > 0){
            }else if(this.arrOfSnakes[i].checkBordersCollision()){
                this.stopGame();
            }
            this.draw.drawField(this);
            this.draw.scoreField.value += this.arrOfSnakes[i].score + ' ';
        }
    }
}

class Drawing {
    constructor(){
        this.canvas = null;
        this.scoreField = null;
        this.startButton = null;
        this.stopButton = null;
        this.createHtmlElements();
        this.ctx = this.canvas.getContext('2d');
        this.fieldWidth = 40;
        this.fieldHeight = 40;
        this.cellSize = 10;
        this.canvas.width = (this.fieldWidth + 1)*this.cellSize;
        this.canvas.height = (this.fieldHeight + 1)*this.cellSize; 
    }
    createHtmlElements(){
        let arrOfHtmlElements = [];
        let div = document.createElement('div');
        let startGame = document.createElement('input');
        startGame.type = 'button';
        startGame.id = 'start';
        startGame.value = 'start game';
        this.startButton = startGame
        let endGame = document.createElement('input');
        endGame.type = 'button';
        endGame.id = 'end';
        endGame.value = 'end game';
        this.stopButton = endGame;
        let canv = document.createElement('canvas');
        canv.id = 'canvas';
        canv.style = 'display: block;';
        this.canvas = canv;
        let scoreField = document.createElement('input');
        scoreField.type = 'text';
        this.scoreField = scoreField
        arrOfHtmlElements.push(scoreField);
        arrOfHtmlElements.push(startGame);
        arrOfHtmlElements.push(endGame);
        arrOfHtmlElements.push(canv);
        for(let n = 0; n < arrOfHtmlElements.length; n++){
            div.appendChild(arrOfHtmlElements[n])
        }
        document.body.appendChild(div);
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

const game = new Game();