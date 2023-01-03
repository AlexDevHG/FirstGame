const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

window.addEventListener('load',setCanvasSize);
window.addEventListener('resize',setCanvasSize);
window.addEventListener('keydown',moveByKeys);
btnUp.addEventListener('click',moveUp);
btnDown.addEventListener('click',moveDown);
btnLeft.addEventListener('click',moveLeft);
btnRight.addEventListener('click',moveRight)

let canvasSize;
let elementSize;
let level = 0;
let lives = 3;
let timePlayer;
let timeInterval;
let timeStart;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x : undefined,
    y : undefined,
};

let  enemiesPosition = [

]

function setCanvasSize(){
    window.innerHeight>window.innerWidth ? canvasSize=(window.innerWidth*0.7) : canvasSize=(window.innerHeight*0.7);

    canvas.setAttribute('width',canvasSize);
    canvas.setAttribute('height',canvasSize);

    canvasSize = Number(canvasSize.toFixed(0));

    elementSize = canvasSize/10;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() { 
    game.font = elementSize + 'px Verdana';
    game.textAlign = 'start';

    const map = maps[level];

    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart=Date.now();  
        timeInterval=setInterval(showTime,100); 
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();

    enemiesPosition = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowCols.forEach((row,rowIndex) => {
        row.forEach((col,colIndex) => {
            const emoji = emojis[col];
            const posX = elementSize * (colIndex);
            const posY = elementSize * (rowIndex+1);
            game.fillText(emoji,posX,posY);
            if (col === 'O'){
                if (!playerPosition.x && !playerPosition.y){
                    playerPosition.x=posX;
                    playerPosition.y=posY;
                } 
            } else if (col === 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
                }
            else if (col === 'X') {
                enemiesPosition.push({
                    x: posX,
                    y: posY,
                })
                }
        }); 
    });
    movePlayer();
  
}

function movePlayer() {
    /*if (Math.abs(playerPosition.x-giftPosition.x<2) && Math.abs(playerPosition.y-giftPosition.y)<2){
        console.log('meta');
        levelWin();
    }*/

    const giftCollisionX = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
    const giftCollisionY = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
    const giftCollision = giftCollisionX && giftCollisionY;

    if(giftCollision){
        levelWin();
    }

    const enemyCollision = enemiesPosition.find(enemy =>{
        const enemyCollisionX = enemy.x.toFixed(2) == playerPosition.x.toFixed(2);
        const enemyCollisionY = enemy.y.toFixed(2) == playerPosition.y.toFixed(2);
        return enemyCollisionX && enemyCollisionY;
    });

        if(enemyCollision){
            levelFail();
        }

    game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel');
    level=level+1;
    startGame();
}

function levelFail() {
    console.log('Chocaste contra un enemigo')
    lives--; // lives = lives-1;

    if (lives<=0){
        console.log('Perdiste por burro :(');
        level = 0;
        lives = 3;
        timeStart=undefined;
    }
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    console.log('Completaste el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now()-timeStart;
    
    if (recordTime){
        if(recordTime>=playerTime){
            localStorage.setItem('record_time', playerTime)
            pResult.innerText ='Felicidades, superaste el record';
        } else {
            pResult.innerText = 'Lo siento, no superaste el record';
            }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerText = 'Primera vez? Trata de superar tu record';
    }

    setTimeout(() => location.reload(),2000)
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']); // 

    spanLives.innerText = '';
    heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {
    spanTime.innerText = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerText = localStorage.getItem('record_time');
}

function moveByKeys(event) {
    switch(event.key){
        case 'ArrowUp' : moveUp(); break;
        case 'ArrowLeft' : moveLeft(); break;
        case 'ArrowRight' : moveRight(); break;
        case 'ArrowDown' : moveDown(); break;
    }
}

function moveUp() {
    if(playerPosition.y - elementSize < elementSize){
        console.log('out');
    }
    else{
    playerPosition.y -= elementSize;
    startGame();
    }
}

function moveLeft() {
    if(playerPosition.x - elementSize < 0){
        console.log('out');
    } else {
    playerPosition.x -= elementSize;
        startGame();
    }
}

function moveRight() {
    if(playerPosition.x > canvasSize-elementSize){
        console.log('out');
    } else {
    playerPosition.x += elementSize;
        startGame();
    }
}

function moveDown() {
    if (playerPosition.y > canvasSize - elementSize){        
        console.log('out');
    } else {
    playerPosition.y += elementSize;
        startGame();
    }
}
    /*
    for (let i = 0 ; i < 10; i++){
        for(let j = 1; j <= 10;j++){
            game.fillText(emojis[mapRowCols[i][j-1]],elementSize*(j-1),elementSize*(i+1));
        }
    }

    console.log(maps[0]);
}
    //window.innerHeight
    //window.innerWidth
    
    game.fillRect(0,0,100,100);//lugar donde va a iniciar el traxo (x,y,medidas)
    game.clearRect(0,0,100,100); // para borrar

    game.font = '25px, Verdana'; // se puede agregar estilos al texto
    game.fillStyle = 'purple'; // estilos
    game.textAlign = 'center'; // dependiendo lo que se coloque, el texto finalizara, empezara o estara al centro las coordenadas
    game.fillText('Platzi', 25, 25); //permite agreagar texto, se debe indicar las coordendas de origen
    */
