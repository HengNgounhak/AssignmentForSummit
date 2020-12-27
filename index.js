var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
const startBtn = document.getElementById("start");
const alertStart = document.getElementById("alertStart");
const showScore = document.getElementById("score");
const showNumScore = document.getElementById("numScore");
const showBackground = document.getElementById("game");
const song = document.getElementById("song");
const fire = document.getElementById("fire");

const imageShark = document.getElementById('shark');
const imageBullet = document.getElementById('bullet');
const imagearmBullet = document.getElementById('bullet');
const imageShootingBullet = document.getElementById('bullet');
const image = document.getElementById('source');
const imagebeach = document.getElementById('beach');

let timeShark = 2000; //Time for show a shark from array
let numberBullet = 0;
let score = 0;
let isShoot = false;
let gameOver = false;

let allBullet = [];
let sharks = [];

let ship = {
    w: 80,
    h: 50,
    x: 20,
    y: 250,
    speed: 8,
    dx: 0,
    dy: 0
};

//for display bullet on the sea
let bullet = {
    w: 20,
    h: 15,
    x: 50,
    y: 100,
};

//for display bullet on ship for shoot
let armBullet = {
    w: 0,
    h: 15,
    x: ship.x + ship.w,
    y: ship.y + ship.h / 2,
};

//to reset the value for restart game
function init() {
    numberBullet = 0;
    score = 0;
    gameOver = false;

    allBullet = [];
    sharks = [];

    ship = {
        w: 80,
        h: 50,
        x: 20,
        y: 250,
        speed: 4,
        dx: 0,
        dy: 0
    };

    bullet = {
        w: 20,
        h: 15,
        x: 50,
        y: 100,
    };

    armBullet = {
        w: 0,
        h: 15,
        x: ship.x + ship.w,
        y: ship.y + ship.h / 2,
    };
}

//for show bullet on other place in the sea only 1/4 canvas width
function respawn() {
    bullet.x = Math.round(Math.random() * ((canvas.width / 4) - bullet.w));
    bullet.y = Math.round(Math.random() * (canvas.height - bullet.h));
}

//for show bullet on ship where ever ship go
function arm() {
    armBullet.x = ship.x + ship.w;
    armBullet.y = ship.y + ship.h / 2;
    armBullet.w = 20;
}

//for draw ship, armBullet, Bullet
function drawarmBullet() {
    ctx.drawImage(imagearmBullet, armBullet.x, armBullet.y, armBullet.w, armBullet.h);
}

function drawship() {
    ctx.drawImage(image, ship.x, ship.y, ship.w, ship.h);
}

function drawBullet() {
    ctx.drawImage(imageBullet, bullet.x, bullet.y, bullet.w, bullet.h);
}

//for draw each shoot bullet in array
function makeShooting(x, y, w, h, s) {
    return {
        x: x,
        y: y,
        w: w,
        h: h,
        s: s,
        draw: function() {
            ctx.drawImage(imageShootingBullet, this.x, this.y, this.w, this.h)
        }
    }
}

//for create shoot bullet and add into array
function shoot() {
    var shootX = ship.x + ship.w;
    var shootWight = 20;
    var shootHight = 15;
    var shootY = ship.y + ship.h / 2;
    var shootSpeed = 20;
    allBullet.push(makeShooting(shootX, shootY, shootWight, shootHight, shootSpeed));
}

//for draw each shark in array
function makeShark(x, y, w, h, s) {
    return {
        x: x,
        y: y,
        w: w,
        h: h,
        s: s,
        draw: function() {
            ctx.drawImage(imageShark, this.x, this.y, this.w, this.h)
        }
    }
}

//for create shark and add into array
function shark() {
    var sharkX = canvas.width - 50;
    var sharkWight = 80;
    var sharkHight = 50;
    var sharkY = Math.round(Math.random() * (canvas.height - sharkHight));
    var sharkSpeed = 1;
    sharks.push(makeShark(sharkX, sharkY, sharkWight, sharkHight, sharkSpeed));
}

//clear the screen
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//for move ship 
function newPos() {
    ship.x += ship.dx;
    ship.y += ship.dy;

    detectWalls();
}

//for not let ship move outside canvas
function detectWalls() {
    // Left wall
    if (ship.x < 0) {
        ship.x = 0;
    }

    // Right Wall
    if (ship.x + ship.w > canvas.width) {
        ship.x = canvas.width - ship.w;
    }

    // Top wall
    if (ship.y < 0) {
        ship.y = 0;
    }

    // Bottom Wall
    if (ship.y + ship.h > canvas.height) {
        ship.y = canvas.height - ship.h;
    }
}

//for move play when tap keys
function moveUp() {
    ship.dy = -ship.speed;
}

function moveDown() {
    ship.dy = ship.speed;
}

function moveRight() {
    ship.dx = ship.speed;
}

function moveLeft() {
    ship.dx = -ship.speed;
}

//for detect keys for move
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        moveRight();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        moveLeft();
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        moveUp();
    } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        moveDown();
    }
}

function keyUp(e) {
    if (
        e.key == 'Right' ||
        e.key == 'ArrowRight' ||
        e.key == 'Left' ||
        e.key == 'ArrowLeft' ||
        e.key == 'Up' ||
        e.key == 'ArrowUp' ||
        e.key == 'Down' ||
        e.key == 'ArrowDown'
    ) {
        ship.dx = 0;
        ship.dy = 0;
    }
}
//for detect ship and bullet touch each other
function touchAbullet() {
    const touchBullet = Math.hypot(ship.x - bullet.x, ship.y - bullet.y)
    if ((touchBullet - ship.w * 0.8 - bullet.w / 2) < 1) {
        respawn();
        numberBullet += 1;
    }

}

//for shoot the bullet
function startShoot() {
    if (isShoot) {
        shoot();
        fire.play();
        isShoot = false;
    }

    allBullet.forEach(function(aBullet) {
        aBullet.x += aBullet.s;
        aBullet.draw();
        if (aBullet.x == canvas.width) {
            allBullet.shift(makeShooting);
        }
    })
}

//draw shark
function callShark() {
    sharks.forEach(function(shark) {
        song.play();
        shark.x = shark.x - shark.s;
        shark.draw();
        if (shark.x < 0) {
            gameOver = true;
        }
    })
}

//detect shark and bullet - shark and ship
function touch() {
    sharks.forEach(function(shark, j) {
        const touchShip = Math.hypot(ship.x - shark.x, ship.y - shark.y)
        if (touchShip - ship.w / 2 - shark.w / 2 < 1) {
            gameOver = true;
        }

        allBullet.forEach(function(bullet, i) {
            const touch = Math.hypot(bullet.x - shark.x, bullet.y - shark.y)
            if (touch - bullet.w / 2 - shark.w / 2 < 1) {
                setTimeout(() => {
                    allBullet.splice(i, 1);
                    sharks.splice(j, 1);
                }, 0);

                score += 1;
            }
        })
    })
}

let id;
//for draw or update every thing in canvas every second
function update() {

    clear();

    ctx.drawImage(imagebeach, 0, 0, canvas.width, canvas.height);

    drawship();

    drawBullet();

    newPos();

    id = requestAnimationFrame(update);

    drawarmBullet();

    touchAbullet();

    if (numberBullet > 0) {
        arm();
    } else {
        armBullet.w = 0;
    }

    startShoot();

    callShark();

    touch();

    text();

    if (gameOver) {
        // clear();
        cancelAnimationFrame(id);
        showBackground.style.display = 'none';
        alertStart.style.display = 'flex';
        showScore.style.display = 'inline';
        showNumScore.innerHTML = score;
        startBtn.innerHTML = 'Play Again';
    }
}

//for start game when tap start or play again
function startGame() {
    alertStart.style.display = 'none';
    showBackground.style.display = 'inline';

    init();
    update();
    song.play();
}

//for shark to get out a lot 
if (score > 10) {
    timeShark = 1000;
}

//time for shark get out
setInterval(shark, timeShark);

//listener for key tap
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
document.addEventListener('keydown', function(event) {
    event.preventDefault();
    if (event.keyCode == 32) {
        if (numberBullet > 0) {
            isShoot = true;
        }

        if (numberBullet < 1) {
            numberBullet += 1;
        }

        numberBullet -= 1;
    }
});

//for show text on screen
function text() {
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.fillText("Bullet: " + numberBullet, 10, 20);

    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.fillText("Score: " + score, canvas.width - 60, 20);
}