const svgNS = "http://www.w3.org/2000/svg";
const svg=document.getElementById("svg");

//размеры поля
var W = 800;
var H = 450;
svg.setAttributeNS(null, 'width', W);
svg.setAttributeNS(null, 'height', H);

//размеры ракеток
const paddleH = 100;
const paddleW = 10;
const step = 3;//шаг передвижения ракетки

//координаты ракеток
let leftPaddle = document.createElementNS(svgNS, "rect");
let rightPaddle = document.createElementNS(svgNS, "rect");
let leftPaddleY = H/2-paddleH/2;
let rightPaddleY = H/2-paddleH/2;

//про мяч
let ball = document.createElementNS(svgNS, 'circle');
const rad = 15; //радиус мяча
let ballX = W/2;
let ballY = H/2;
let xv;//скорость передвижения по x
let yv;//скорость передвижения по y

//рандомное выпрыгивание
function randomYNumber() {
    let num = Math.random() * (5 - (-5)) + (-5);
    if (num === 0) {
        num = 3;
    }
    return num;
  }
function randomXNumber() {
    let num = Math.random();
    if (num < 0.5) {
        num = (-5);
    } else {
        num = 5;
    }
    return num;
}


//движение
let action = false;
let requestID;

//для управления ракетками
var UPleftpaddle = false;
var DOWNleftpaddle = false;
var UPrightpaddle = false;
var DOWNrightpaddle = false;

function draw() {
//вставляем поле как прямоугольник
let field = document.createElementNS(svgNS, "rect");
field.setAttributeNS(null, 'width', W);
field.setAttributeNS(null, 'height', H);
field.setAttributeNS(null, 'fill', '#fbfd99');
svg.appendChild(field);

//отрисовываем ракетки
leftPaddle.setAttributeNS(null, 'x', 0);
leftPaddle.setAttributeNS(null, 'y', leftPaddleY);
leftPaddle.setAttributeNS(null, 'width', paddleW);
leftPaddle.setAttributeNS(null, 'height', paddleH);
leftPaddle.setAttributeNS(null, 'fill', '#008000');
svg.appendChild(leftPaddle);

rightPaddle.setAttributeNS(null, 'x', W-paddleW);
rightPaddle.setAttributeNS(null, 'y', rightPaddleY);
rightPaddle.setAttributeNS(null, 'width', paddleW);
rightPaddle.setAttributeNS(null, 'height', paddleH);
rightPaddle.setAttributeNS(null, 'fill', '#0000cc');
svg.appendChild(rightPaddle);

//рисуем мячик
ball.setAttributeNS(null, 'cx', ballX);
ball.setAttributeNS(null, 'cy', ballY);
ball.setAttributeNS(null, 'fill', '#ff0000');
ball.setAttributeNS(null, 'r', rad);
svg.appendChild(ball);
}
draw();

var ballH = {
    posX: ballX,
    posY: ballY,
    update: function() {
        ball.setAttributeNS(null, 'cx', this.posX);
        ball.setAttributeNS(null, 'cy', this.posY);        
    }
}

function start() {
    reset();
    document.getElementById('startButton').disabled = true;
    requestID = requestAnimationFrame(update);
    action = true;
    
}
function update() {
    ballH.posX+=xv;
    ballH.posY+=yv;      
    ballH.update();    
    requestID = requestAnimationFrame(update);
    checkWalls();
    moveRockets();
}
function stop() {
    if (requestID) {
        cancelAnimationFrame(requestID);
    }
    action = false;
    document.getElementById('startButton').disabled = false;
}

//сброс всех положений и установка в первоначальные
function reset() {
    ballH.posX = W/2;
    ballH.posY = H/2;
    xv = randomXNumber();
    yv = randomYNumber();
    leftPaddleY = H/2-paddleH/2;
    rightPaddleY = H/2-paddleH/2;
    leftPaddle.setAttributeNS(null, 'y', leftPaddleY);
    rightPaddle.setAttributeNS(null, 'y', rightPaddleY);
}

//проверяем стены
function checkWalls() {
    //проверяем пол   
    if (ballH.posY + rad + yv > H) {
       yv = -yv;       
    }
    //проверяем потолок
    if (ballH.posY - rad + yv < 0) {
        yv=-yv;        
    }
    //проверяем правую стену
    if (ballH.posX + rad == W-paddleW && ballH.posY + rad > rightPaddleY && ballH.posY - rad < rightPaddleY + paddleH) {
        xv=-xv;        
    }
    if (ballH.posX + rad + xv > W) {
        xv = 0;
        yv = 0;
        document.getElementById('leftPlayer').innerHTML++;
        stop();
    }
    //проверяем левую стену
    if (ballH.posX - rad == paddleW && ballH.posY + rad > leftPaddleY && ballH.posY - rad < leftPaddleY + paddleH) {
        xv = -xv;
    }
    if (ballH.posX - rad == 0) {
        xv = 0;
        yv = 0;
        document.getElementById('rightPlayer').innerHTML++;
        stop();
    }
}

//управление ракетками
document.onkeydown = function(e) {
    if (e.keyCode == 16) {UPleftpaddle = true;}
    if (e.keyCode == 17) {DOWNleftpaddle = true;}
    if (e.keyCode == 38) {UPrightpaddle = true;}
    if (e.keyCode == 40) {DOWNrightpaddle = true;}
}

document.onkeyup = function(e) {
    if (e.keyCode == 16) {UPleftpaddle = false;}
    if (e.keyCode == 17) {DOWNleftpaddle = false;}
    if (e.keyCode == 38) {UPrightpaddle = false;}
    if (e.keyCode == 40) {DOWNrightpaddle = false;}
}

function moveRockets() {
    if (UPleftpaddle){
        leftPaddleY = leftPaddleY - step;
        leftPaddle.setAttributeNS(null, 'y', leftPaddleY);
        if (leftPaddleY < 0) {leftPaddleY = 0;}        
    }
    if (DOWNleftpaddle){
        leftPaddleY = leftPaddleY + step;
        leftPaddle.setAttributeNS(null, 'y', leftPaddleY);
        if (leftPaddleY > H - paddleH) {leftPaddleY = H - paddleH}
    }
    if (UPrightpaddle) {
        rightPaddleY = rightPaddleY - step;
        rightPaddle.setAttributeNS(null, 'y', rightPaddleY);
        if (rightPaddleY < 0) {rightPaddleY = 0;}
    }
    if (DOWNrightpaddle) {
        rightPaddleY = rightPaddleY + step;
        rightPaddle.setAttributeNS(null, 'y', rightPaddleY);
        if (rightPaddleY > H-paddleH) {rightPaddleY = H - paddleH}
    }
}
