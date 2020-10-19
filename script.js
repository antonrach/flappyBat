const screen = document.querySelector('.gamescreen');
const screenContext = screen.getContext('2d');

const bat = new Image();
const bg = new Image();
const fg = new Image();
const pipeUp = new Image();
const pipeDown = new Image();

bat.src = 'img/bat.png';
fg.src = 'img/fg.jpg';
pipeUp.src = 'img/pipeUp.png';
pipeDown.src = 'img/pipeDown.png';
bg.src = 'img/bg.jpg';

let anim;
let animation = true;

let xPosBat = 10;
let yPosBat = 200;

let score = 0;
let highScore;

if(localStorage.getItem('highScore') !== null) {
    highScore = +localStorage.getItem('highScore');
} else {
    highScore = 0;
}

let pipe = [];


function pause(){

}

function draw(){
    screenContext.drawImage(bg, 0, 0, 1024, 530);

    pipe.forEach(item => {
        screenContext.drawImage(pipeUp, item.x, item.y);
        screenContext.drawImage(pipeDown, item.x, item.y + pipeUp.height + 140);

        item.x -=1;

        if(item.x == -52){
            item.x = 1024;
            item.y = (Math.floor(Math.random() * pipeUp.height) - pipeUp.height);
        }

        if(xPosBat + bat.width >= item.x && xPosBat <= item.x + pipeUp.width && (yPosBat <= pipeUp.height + item.y || yPosBat + bat.height >= item.y + 140 + pipeUp.height)){
            location.reload();
            localStorage.setItem('highScore', highScore.toString());
        }

        if(item.x == 5){
            score++;
            if(score > highScore) {
                highScore = score;
            }
        }
    })
    
    screenContext.drawImage(bat, xPosBat, yPosBat);

    yPosBat += 2;

    screenContext.fillStyle = '#fff';
    screenContext.font = '24px Verdana';
    screenContext.fillText('Score: ' + score + ', High: ' + highScore, 10, 30);


    anim = requestAnimationFrame(draw);
}

function firstPipes(){
    pipe[0] = {
        x: 256,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
    }
    pipe[1] = {
        x: 512,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
    }
    pipe[2] = {
        x: 768,
        y: (Math.floor(Math.random() * pipeUp.height) - pipeUp.height)
    }
    pipe[3] = {
        x: 1024,
        y: (Math.floor(Math.random() * pipeUp.height) - pipeUp.height)
    }
}

pipeUp.onload = firstPipes;
bg.onload = draw;


document.addEventListener('keydown', event => {
    if(event.key === ' ' || event.key === 'ArrowUp'){
        if(animation === true){
            yPosBat -= 50;
        }
    }
})
document.addEventListener('keydown', event => {
    if(event.key === 'ArrowDown'){
        if(animation === true){
            yPosBat += 10;
        }
    }
})
document.addEventListener('keydown', event => {
    if(event.key === 'Escape'){
        if(animation === true){
            cancelAnimationFrame(anim);
            document.querySelector('.pauseoverlay').classList.add('_active');
            animation = false;
        } else if(animation === false){
            document.querySelector('.pauseoverlay').classList.remove('_active');
            anim = requestAnimationFrame(draw);
            animation = true;
        }
    }
});