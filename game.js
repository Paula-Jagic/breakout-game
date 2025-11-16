const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');


let gameState='beginning';

let score=0;
let highScore=localStorage.getItem('HighScore') || 0;

let keys={};

const BROJ_REDOVA=5;
const BROJ_STUPACA=10;
const POČETNA_BRZINA_LOPTICE=3;


const ŠIRINA_CIGLE=68;
const VISINA_CIGLE=20;
const VELIČINA_LOPTICE=10;
const ŠIRINA_PALICE=100;
const VISINA_PALICE=15;

const RAZMAK_CIGLI_HORIZONTALNO=30;
const RAZMAK_CIGLI_VERTIKALNO=15;
const OFFSET_TOP=120; 


let bricks=[];

const BOJE_CIGLI=[
    [153, 51, 0],     
    [255, 0, 0],    
    [255, 153, 204],  
    [0, 255, 0],      
    [255, 255, 153] ]

//Definiranje paddle objekta
let paddle={
    x: canvas.width/2 - ŠIRINA_PALICE/2,  
    y: canvas.height-50,                   
    width: ŠIRINA_PALICE,
    height: VISINA_PALICE,
    color: 'white',                           
    speed: 10,  

};

//Definiranje ball objekta
let ball={
    x: 0,
    y: 0,
    size: VELIČINA_LOPTICE,  
    speedX: 0,
    speedY: 0
};

//Crtanje početnog naslova
function drawBeginning() {
    ctx.shadowColor = 'transparent'
    ctx.font='bold 36px Helvetica, Verdana';
    ctx.fillStyle='white';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('BREAKOUT', canvas.width/2, canvas.height/2-20);
    
    
    ctx.font='bold italic 18px Helvetica, Verdana';
    ctx.fillText('Press SPACE to begin', canvas.width/2, canvas.height/2+20);
}


//Crtanje paddle-a
function drawPaddle() { 
    
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle=paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  
}


//Crtanje lopte/ball-a
function drawBall() {
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle='lightgray';
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
    
 
}

//Funkcionalnost pomicanja paddle-a sa strelicama lijevo, desno, a i d
function movePaddle() {
    if (keys['ArrowLeft'] || keys['a']) {
        paddle.x -= paddle.speed;
    }
    
    
    if (keys['ArrowRight'] || keys['d']) {
        paddle.x += paddle.speed;
    }
    
    
    if (paddle.x < 0) {
        paddle.x=0;  
    }
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x=canvas.width - paddle.width;  
    }
}

//Funkcija za inicijalizaciju lopte 
function initBall() {
    ball.x=paddle.x+paddle.width/2- ball.size/2;
    ball.y=paddle.y-ball.size;
    
    const randomSmjer=Math.random()>0.5 ? 1 : -1;
    ball.speedX=POČETNA_BRZINA_LOPTICE*randomSmjer; 
    ball.speedY=-POČETNA_BRZINA_LOPTICE; 
}


//Funkcionalnost konstantnog pomicanja loptice
function updateBall() {
    ball.x+=ball.speedX;
    ball.y+=ball.speedY;
}

//Funkcionalnost kolizije sa zidom
function checkWallCollisions() { 
    //promjena smjera kretanja horizontalno   
    if (ball.x <=0 || ball.x + ball.size >=canvas.width) {
        ball.speedX=-ball.speedX; 
    }
    
    
    //promjena smjera pomicanja lopte vertikalno
    if (ball.y <=0) {
        ball.speedY=-ball.speedY; 
    }
    
    //ako ne uspijemo uhvatiti loptu
    if (ball.y+ball.size>=canvas.height) {
         if (score > highScore) {
            highScore=score;
            localStorage.setItem('HighScore', highScore);
        }
        //kraj igre
        gameState='gameover';
    }
}


//Funkcionalnost kolizije sa paddle-om
function checkPaddleCollision() {
    if (ball.x + ball.size > paddle.x && 
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.size > paddle.y && 
        ball.y < paddle.y + paddle.height) {

        //mjenjanje smjera prema gore
        ball.speedY = -Math.abs(ball.speedY); 
    }
}


//Crtanje kraja igre ako osoba izgubi
function drawGameOver() {
    ctx.shadowColor = 'transparent'
    ctx.font='bold 40px Helvetica, Verdana';
    ctx.fillStyle='yellow';  
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
}


//Inicijalizacija cigla
function initBricks() {
    bricks=[];

    //računamo kako bismo mogli centrirati blok cigla
    const UKUPNA_SIRINA_CIGLI=BROJ_STUPACA*ŠIRINA_CIGLE+(BROJ_STUPACA-1)*RAZMAK_CIGLI_HORIZONTALNO;
    const OFFSET_LEFT=(canvas.width-UKUPNA_SIRINA_CIGLI)/2;

    
    for (let i=0; i<BROJ_REDOVA; i++) {
        for (let j=0; j<BROJ_STUPACA; j++) {
            const brickX=j*(ŠIRINA_CIGLE+RAZMAK_CIGLI_HORIZONTALNO)+OFFSET_LEFT;
            const brickY=i*(VISINA_CIGLE+RAZMAK_CIGLI_VERTIKALNO)+OFFSET_TOP;
            
            bricks.push({
                x: brickX,
                y: brickY,
                width: ŠIRINA_CIGLE,
                height: VISINA_CIGLE,
                color: `rgb(${BOJE_CIGLI[i].join(',')})`,
                destroyed: false
            });
        }
    }
}
//Crtanje cigle 
function drawBricks() {
    bricks.forEach(brick => {
        if (!brick.destroyed) {
            
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillStyle=brick.color;
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            
        
        }
    });
}


//Funkcionalnost kolizije sa ciglama
function checkBrickCollisions() {
    for (let i=0; i< bricks.length; i++) {
        const brick=bricks[i];
        //ignorira već uništene cigle
        if (brick.destroyed) continue;
        
        //isti princip kao i kod kolizije sa palicom
        if (ball.x + ball.size > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y + ball.size > brick.y &&
            ball.y < brick.y + brick.height) {

            //cigla je uništena, povećava se score
            brick.destroyed=true;
            score++;
            
            //Definiranje rubova
            const ballBottom=ball.y+ball.size;
            const ballTop=ball.y;
            const ballRight=ball.x+ball.size;
            const ballLeft=ball.x;
            
            const brickBottom=brick.y+brick.height;
            const brickTop=brick.y;
            const brickRight=brick.x+brick.width;
            const brickLeft=brick.x;
            
            //računanje koliko su rubovi cigle i loptice međusobno udaljeni
            const fromLeft=ballRight-brickLeft;
            const fromRight=brickRight-ballLeft;
            const fromTop=ballBottom-brickTop;
            const fromBottom=brickBottom-ballTop;
            
            //računanje s koje strane su međusobno najmanje udaljeni loptica i cigla, odnosno gdje su se prvo sudarili
            const minDistance=Math.min(fromLeft, fromRight, fromTop, fromBottom);
            
            //Definiramo kada je kut udaren
            const isCornerHit= 
                (minDistance==fromLeft && (fromTop < 5 || fromBottom < 5)) ||
                (minDistance==fromRight && (fromTop < 5 || fromBottom < 5)) ||
                (minDistance==fromTop && (fromLeft < 5 || fromRight < 5)) ||
                (minDistance==fromBottom && (fromLeft < 5 || fromRight < 5));
            
            //Mjenjamo smjer kretanja loptice
            if (minDistance==fromLeft || minDistance==fromRight) {
                
                ball.speedX=-ball.speedX;
            } else {
                
                ball.speedY=-ball.speedY;
            }
            
            //Ako je kut udaren, mjenjamo brzinu loptice
            if (isCornerHit) {
                ball.speedX *=1.08;  
                ball.speedY *=1.08;
            }
            
            return;
        }
    }
}

//Funkcionalnost u slučaju da razbijemo sve cigle (update-anje score-a i prelazak na gamestate win kod kojeg se na ekranu prikazuje poruka)
function checkWin() {
    const leftBricks=bricks.filter(brick => !brick.destroyed).length; 
    if (leftBricks==0) {
          if (score>highScore) {
            highScore=score;
            localStorage.setItem('HighScore', highScore);
        }
        gameState='win';
    }
}

//Crtanje poruke za pobjedu
function drawWin() {
    ctx.shadowColor = 'transparent'
    ctx.font='bold 40px Helvetica, Verdana';
    ctx.fillStyle='yellow';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('YOU WIN!', canvas.width/2, canvas.height/2);
}


//Funkcionalnost crtanja rezultata
function drawScores() {  
    ctx.shadowColor = 'transparent'
    ctx.font='bold 20px Helvetica, Verdana';
    ctx.fillStyle='white';
    ctx.textAlign='left';
    ctx.textBaseline='top';
    ctx.fillText(`Trenutni broj bodova: ${score}`, 20, 20);
    
    ctx.textAlign='right';
    ctx.fillText(`Maksimalni broj bodova: ${highScore}`, canvas.width - 100, 20);
}

//Glavni loop igre
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState=='beginning') {
        drawBeginning();
    } 
    else if (gameState=='playing') {
        movePaddle();
        updateBall();          
        checkWallCollisions();
        checkBrickCollisions();
        checkWin();
        drawBricks();  
        drawPaddle();
        drawBall();
        checkPaddleCollision();
        drawScores();
    }

    else if (gameState=='gameover') {
        drawGameOver();
         }

    else if (gameState=='win') {
        drawWin();    
    }

    requestAnimationFrame(gameLoop);
}


//Event listener za pritisnute tipke
document.addEventListener('keydown', function(event) {
    if (event.code=='Space') {
        
        if (gameState=='beginning' || gameState=='gameover' || gameState=='win') {
            gameState='playing'; 
            score=0;
            paddle.x=canvas.width/2 - ŠIRINA_PALICE/2;
            paddle.y=canvas.height-50;
            initBricks();
            initBall();
            keys={};
        }
    }
    
    keys[event.key]=true; 
});


window.addEventListener('load', function() {
    gameLoop(); 
});


//Event listener kada tipka više nije pritisnuta
document.addEventListener('keyup', function(event) {
    keys[event.key]=false; 
});