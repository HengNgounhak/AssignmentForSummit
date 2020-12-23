var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
var startBtn = document.getElementById("start");
var alertStart = document.getElementById("alertStart")

const imageShark = document.getElementById('shark');
const imageBullet = document.getElementById('bullet');
const imageShootBullet = document.getElementById('bullet');
const image = document.getElementById('source');

var timeShark = 3000;
var numberBullet = 0;
var isShoot = false;

var allBullet = [];

const player = {
    w: 80,
    h: 50,
    x: 20,
    y: 250,
    speed: 10,
    dx: 0,
    dy: 0
};

var bullet = {
    w: 20,
    h: 15,
    x: 50,
    y: 100,
};

var shootBullet = {
    w: 0,
    h: 15,
    x: player.x + player.w,
    y: player.y + player.h / 2,
    speed: 20,
};

var sharks = [];

function respawn() {
    bullet.x = Math.round(Math.random() * ((canvas.width / 4) - bullet.w));
    bullet.y = Math.round(Math.random() * (canvas.height - bullet.h));
}

function arm() {
    shootBullet.x = player.x + player.w;
    shootBullet.y = player.y + player.h / 2;
    shootBullet.w = 20;
}

function drawShootBullet() {
    ctx.drawImage(imageShootBullet, shootBullet.x, shootBullet.y, shootBullet.w, shootBullet.h);
}

function drawPlayer() {
    ctx.drawImage(image, player.x, player.y, player.w, player.h);
}

function drawBullet() {
    ctx.drawImage(imageBullet, bullet.x, bullet.y, bullet.w, bullet.h);
}

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

function shark() {
    var sharkX = canvas.width - 50;
    var sharkWight = 80;
    var sharkHight = 50;
    var sharkY = Math.round(Math.random() * (canvas.height - sharkHight));
    var sharkSpeed = 5;
    sharks.push(makeShark(sharkX, sharkY, sharkWight, sharkHight, sharkSpeed));
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.x += player.dx;
    player.y += player.dy;

    detectWalls();
}

function detectWalls() {
    // Left wall
    if (player.x < 0) {
        player.x = 0;
    }

    // Right Wall
    if (player.x + player.w > canvas.width) {
        player.x = canvas.width - player.w;
    }

    // Top wall
    if (player.y < 0) {
        player.y = 0;
    }

    // Bottom Wall
    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
    }
}


function update() {
    clear();

    drawPlayer();

    drawBullet();

    newPos();

    requestAnimationFrame(update);

    drawShootBullet();

    if ((player.x <= bullet.x && bullet.x <= (player.x + player.w)) && (player.y <= bullet.y && bullet.y <= (player.y + player.h))) {

        // Respawn target: delete old target, and random new target at other location
        respawn();
        // numberBullet += 1;
        allBullet.push(arm());
    }
    // if(numberBullet > 0){
    //     arm();
    // }

    if (allBullet.length > 0) {
        // arm();
        // for (var i = 0; i < allBullet.length; i = 0) {
        //     arm();
        // }
    }

    if (isShoot) {
        shootBullet.x += shootBullet.speed;
        if (shootBullet.x == (canvas.width)) {
            shootBullet.w = 0;
        }
    }

    sharks.forEach(function(shark) {
        shark.x -= shark.s;
        shark.draw();
        if (shark.x == 0) {
            sharks.pop(makeShark);
        }
    })

    text();
}

function moveUp() {
    player.dy = -player.speed;
}

function moveDown() {
    player.dy = player.speed;
}

function moveRight() {
    player.dx = player.speed;
}

function moveLeft() {
    player.dx = -player.speed;
}

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
        player.dx = 0;
        player.dy = 0;
    }
}

function startGame() {
    alertStart.style.display = 'none';
    update();
}

setInterval(shark, timeShark);
// setTimeout(shark, 1000);

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

document.addEventListener('keydown', function(event) {
    event.preventDefault();
    if (event.keyCode == 32) {
        // if (numberBullet < 1) {
        //     numberBullet += 1;
        // }

        isShoot = true;
        // numberBullet -= 1;
        allBullet.length -= 1;

    }
});

//Number of bullet text
function text() {
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.fillText("Bullet: " + numberBullet, 10, 20);
}