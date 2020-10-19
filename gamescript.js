const screen = document.querySelector('.gamescreen');
const screenContext = screen.getContext('2d');

const bat = new Image();
const bg = new Image();
const fg = new Image();
const pipeUp = new Image();
const pipeDown = new Image();

const scoreSound = new Audio();
const mainMusic = new Audio();
const oy = new Audio();

bat.src = 'img/bat.png';
fg.src = 'img/fg.jpg';
pipeUp.src = 'img/pipeUp.png';
pipeDown.src = 'img/pipeDown.png';
bg.src = 'img/bg.jpg';

scoreSound.src = 'audio/345299__scrampunk__okay.wav';
scoreSound.volume = .5;
mainMusic.src = 'audio/main (mp3cut.net).mp3';
mainMusic.loop = true;
mainMusic.volume = .3;
oy.src = 'audio/45908__daveincamas__ooyy.wav';
oy.volume = .6;

let anim;
let animation = false;
let level;
let sound;

let xPosBat = 10;
let yPosBat = 200;

let score = 0;
let highScore;
let hardScore;

if(localStorage.getItem('highScore') !== null) {
    highScore = +localStorage.getItem('highScore');
} else {
    highScore = 0;
}

if(localStorage.getItem('highScore') !== null) {
    hardScore = +localStorage.getItem('hardScore');
} else {
    hardScore = 0;
}

document.querySelector('.normalhighscore .countscore span').innerText = highScore;
document.querySelector('.hardcorehighscore .countscore span').innerText = hardScore;

sound = false;
document.querySelector('.sound span').innerText = 'OFF';

let pipe = [];


function pause(){

}

function bgDraw(){
    screenContext.drawImage(bg, 0, 0, 1024, 530);
}

function draw(speed, gravity){
    screenContext.drawImage(bg, 0, 0, 1024, 530);

    if(speed === 1){
        level = 'easy';
    } else if(speed === 2){
        level = 'hard';
    }

    pipe.forEach(item => {
        screenContext.drawImage(pipeUp, item.x, item.y);
        screenContext.drawImage(pipeDown, item.x, item.y + pipeUp.height + 140);

        item.x -=speed;

        if(item.x == -52){
            item.x = 1228;
            item.y = (Math.floor(Math.random() * pipeUp.height) - pipeUp.height);
        }

        if(xPosBat + bat.width >= item.x && xPosBat <= item.x + pipeUp.width && (yPosBat <= pipeUp.height + item.y || yPosBat + bat.height >= item.y + 140 + pipeUp.height)){
            if(sound === true){
                oy.play();
            }
            reloadGame();
            if(level === 'easy'){
                localStorage.setItem('highScore', highScore.toString());
                document.querySelector('.normalhighscore .countscore span').innerText = highScore;
            } else if(level === 'hard'){
                localStorage.setItem('hardScore', hardScore.toString());
                document.querySelector('.hardcorehighscore .countscore span').innerText = hardScore;
            }
        }

        if(item.x == 6){
            score++;
            if(sound === true){
                scoreSound.play();
            }
            if(level === 'easy'){
                if(score > highScore) {
                    highScore = score;                    
                }
            } else if(level === 'hard'){
                if(score > hardScore) {
                    hardScore = score;                    
                }
            }
            
        }
    })
    
    screenContext.drawImage(bat, xPosBat, yPosBat);

    yPosBat += gravity;

    screenContext.fillStyle = '#fff';
    screenContext.font = '24px Verdana';
    if(level === 'easy'){
        screenContext.fillText('Score: ' + score + ', High: ' + highScore, 10, 30);
    } else if(level === 'hard'){
        screenContext.fillText('Score: ' + score + ', High: ' + hardScore, 10, 30);
    }
    
    anim = requestAnimationFrame(() => {
        draw(speed, gravity);
    });
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
    pipe[4] = {
        x: 1280,
        y: (Math.floor(Math.random() * pipeUp.height) - pipeUp.height)
    }
}

function reloadMenu(){
    firstPipes();
    bgDraw();
    document.querySelectorAll('.container > div').forEach(item => {
        item.classList.remove('_active');
    })
    document.querySelector('.menu').classList.add('_active');
    xPosBat = 10;
    yPosBat = 200;
    score = 0;
}

function reloadGame(){
    firstPipes();
    xPosBat = 10;
    yPosBat = 200;
    score = 0;
    document.querySelector('.pauseoverlay').classList.remove('_active');
    animation = true;
}

function noActive(act){
    if(act === 'playing'){
        let counter = 0;
        document.querySelectorAll('.container > div').forEach(item => {
            if(item.classList.contains('_active')){
                counter++;
            }
        })
        if(counter === 0){
            return true
        } else {
            return false
        }
    } else if (act === 'paused'){
        if(document.querySelector('.pauseoverlay').classList.contains('_active')){
            return true
        } else {
            return false
        }
    }
}

let moduleQuest = (function(){
    const question = document.querySelector('.question');

    const quest = {
        open(txt) {
            document.querySelectorAll('.container > div').forEach(item => {
                item.classList.remove('_active');
            })
            question.querySelector('.questdesc').innerText = txt;
            question.classList.add('_active');
        },
        close() {
            question.classList.remove('_active');
        }
    }
    question.querySelector('.ansyes').addEventListener('click', () => {
        quest.close();
    })
    question.querySelector('.ansno').addEventListener('click', () => {
        quest.close();
    })
    return quest
})();

function confirm(text){
    moduleQuest.open(text);
    return new Promise((res, rej) => {
        document.querySelector('.ansyes').addEventListener('click', () => {
            res();
        })
        document.querySelector('.ansno').addEventListener('click', () => {
            rej();
        })
        document.addEventListener('keypress', event => {
            if(event.key === 'Enter') {
                event.preventDefault();
            }
        })
    })
}

function exitGame(text){
    let p = confirm(text);
    p.then(() => {
        window.close();
    }).catch(() => {
        document.querySelector('.menu').classList.add('_active');
    })
}

function resetScore(mode){
    if(mode === 'normal'){
        let p = confirm('Are you sure that you want to reset your high score of the normal mode?');
        p.then(() => {
            localStorage.removeItem('highScore');
            highScore = 0;
            document.querySelector('.normalhighscore .countscore span').innerText = highScore;
            document.querySelector('.scorerec').classList.add('_active');
        }).catch(() => {
            document.querySelector('.scorerec').classList.add('_active');
        })
    } else if(mode === 'hardcore'){
        let p = confirm('Are you sure that you want to reset your high score of the hardcore mode?');
        p.then(() => {
            localStorage.removeItem('hardScore');
            hardScore = 0;
            document.querySelector('.hardcorehighscore .countscore span').innerText = hardScore;
            document.querySelector('.scorerec').classList.add('_active');
        }).catch(() => {
            document.querySelector('.scorerec').classList.add('_active');
        })
    }
}

pipeUp.onload = firstPipes;
bg.onload = bgDraw;

if(sound === true){
    mainMusic.onload = mainMusic.play();
}

function stopMusic(){
    mainMusic.pause();
    mainMusic.currentTime = 0;
    sound = false;
    document.querySelector('.sound span').innerText = 'OFF';
}

function playMusic(){
    sound = true;
    document.querySelector('.sound span').innerText = 'ON';
    mainMusic.play();
}


document.addEventListener('keydown', event => {
    if(event.key === ' ' || event.key === 'ArrowUp'){
        if(animation === true){
            if(level === 'easy'){
                yPosBat -= 50;
            } else if(level === 'hard'){
                yPosBat -= 80;
            }
            
        }
    }
})
document.addEventListener('keydown', event => {
    if(event.key === 'ArrowDown'){
        if(animation === true){
            if(level === 'easy'){
                yPosBat += 10;
            } else if(level === 'hard'){
                yPosBat += 20;
            }
            
        }
    }
})
document.addEventListener('keydown', event => {
    if(event.key === 'Escape'){
        if(animation === true && noActive('playing')){
            cancelAnimationFrame(anim);
            document.querySelector('.pauseoverlay').classList.add('_active');
            animation = false;
            if(level === 'easy'){
                localStorage.setItem('highScore', highScore.toString());
                document.querySelector('.normalhighscore .countscore span').innerText = highScore;
            } else if(level === 'hard'){
                localStorage.setItem('hardScore', hardScore.toString());
                document.querySelector('.hardcorehighscore .countscore span').innerText = hardScore;
            }
        } else if(animation === false && noActive('paused')){
            document.querySelector('.pauseoverlay').classList.remove('_active');
            if(level === 'easy') {
                anim = requestAnimationFrame(() => {
                    draw(1, 2);
                });
            }  else if(level === 'hard') {
                anim = requestAnimationFrame(() => {
                    draw(2, 3);
                });
            }
            
            animation = true;
        }
    }
});

document.querySelector('.restart').addEventListener('click', () => {
    reloadGame();
    if(level === 'easy') {
        anim = requestAnimationFrame(() => {
            draw(1, 2);
        });
    } else if(level === 'hard') {
        anim = requestAnimationFrame(() => {
            draw(2, 3);
        });
    }
    animation = true;
})

document.querySelector('.exit').addEventListener('click', () => {
    exitGame('Do you want to quit the game?');
})
document.querySelector('.easy').addEventListener('click', () => {
    document.querySelector('.menu').classList.remove('_active');
    animation = true;
    draw(1, 2);
})
document.querySelector('.hard').addEventListener('click', () => {
    document.querySelector('.menu').classList.remove('_active');
    animation = true;
    draw(2, 3);
})
document.querySelectorAll('.openmenu').forEach(item => {
    item.addEventListener('click', () => {
        reloadMenu();
    })
})
document.querySelector('.instructions').addEventListener('click', () => {
    document.querySelector('.menu').classList.remove('_active');
    document.querySelector('.instructdesc').classList.add('_active');
})
document.querySelector('.sound').addEventListener('click', () => {
    if(sound === false){
        playMusic();
    } else if(sound === true){
        stopMusic();
    }
})
document.querySelector('.highscore').addEventListener('click', () => {
    document.querySelector('.menu').classList.remove('_active');
    document.querySelector('.scorerec').classList.add('_active');
})
document.querySelector('.resetnormal').addEventListener('click', () => {
    resetScore('normal');
})
document.querySelector('.resethard').addEventListener('click', () => {
    resetScore('hardcore');
})
document.addEventListener('keyup', event => {
    if(document.querySelector('.question').classList.contains('_active')){
        if(event.key === 'Escape'){
            document.querySelector('.ansno').click();
        }
        if(event.key === 'Enter'){
            document.querySelector('.ansyes').click();
        }
    }
})